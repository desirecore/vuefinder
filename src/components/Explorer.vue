<template>
  <div ref="dropArea" class="relative flex-auto flex flex-col overflow-hidden">
    <div v-if="app.view === 'list' || searchQuery.length" class="grid grid-cols-12 px-1 bg-neutral-50 dark:bg-gray-800 border-b border-neutral-300 dark:border-gray-700 text-xs select-none divide-x">
      <div @click="sortBy('basename')" class="col-span-7 vf-sort-button">
        {{ t('Name') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'basename'"/>
      </div>
      <div v-if="!searchQuery.length" @click="sortBy('file_size')" class="justify-center col-span-2 vf-sort-button">
        {{ t('Size') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'file_size'"/>
      </div>
      <div v-if="!searchQuery.length" @click="sortBy('last_modified')" class="justify-center col-span-3 vf-sort-button">
        {{ t('Date') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'last_modified'"/>
      </div>
      <div v-if="searchQuery.length" @click="sortBy('path')" class="justify-center col-span-5 vf-sort-button">
        {{ t('Filepath') }} <SortIcon :direction="sort.order" v-show="sort.active && sort.column === 'path'"/>
      </div>
    </div>

    <div class="relative">
      <DragItem ref="dragImage" :count="ds.getCount()"/>
    </div>

    <div :ref="ds.scrollBarContainer" class="vf-explorer-scrollbar-container" :class="[{'grid-view': app.view === 'grid'}]">
      <div :ref="ds.scrollBar" class="w-5 bg-transparent pointer-events-none"></div>
    </div>

    <div :ref="ds.area" :class="{'resize-y': !app.fullScreen}"
         class="h-full w-full text-xs  vf-explorer-scrollbar vf-selector-area min-h-[150px] z-0 overflow-y-auto"
         @contextmenu.self.prevent="app.emitter.emit('vf-contextmenu-show',{event: $event, items: ds.getSelected()})"
    >

      <!-- Search View -->
      <Item v-if="searchQuery.length" v-for="(item, index) in getItems()"
            :item="item" :index="index" :dragImage="dragImage" class="vf-item vf-item-list">
        <div class="grid grid-cols-12 items-center">
          <div class="flex col-span-7 items-center">
            <ItemIcon :type="item.type" :small="app.compactListView"/>
            <span class="overflow-ellipsis overflow-hidden whitespace-nowrap">{{ item.basename }}</span>
          </div>
          <div class="col-span-5 overflow-ellipsis overflow-hidden whitespace-nowrap">{{ item.path }}</div>
        </div>
      </Item>
      <!-- List View -->
      <Item v-if="app.view==='list' && !searchQuery.length" v-for="(item, index) in getItems()"
            :item="item" :index="index" :dragImage="dragImage" class="vf-item vf-item-list" draggable="true">
        <div class="grid grid-cols-12 items-center">
          <div class="flex col-span-7 items-center">
            <ItemIcon :type="item.type" :small="app.compactListView"/>
            <span class="overflow-ellipsis overflow-hidden whitespace-nowrap">{{ item.basename }}</span>
          </div>
          <div class="col-span-2 text-center">{{ item.file_size ? app.filesize(item.file_size) : '' }}</div>
          <div class="col-span-3 overflow-ellipsis overflow-hidden whitespace-nowrap px-1 md:px-3">
            {{ datetimestring(item.last_modified) }}
          </div>
        </div>
      </Item>
      <!-- Grid View -->
      <Item v-if="app.view==='grid' && !searchQuery.length" v-for="(item, index) in getItems(false)"
            :item="item" :index="index" :dragImage="dragImage" class="vf-item vf-item-grid" draggable="true">
        <div>
          <div class="relative">
            <img src="data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                 class="lazy h-10 md:h-12 m-auto" v-if="(item.mime_type ?? '').startsWith('image') && app.showThumbnails"
                 :data-src="app.requester.getPreviewUrl(app.fs.adapter, item)" :alt="item.basename" :key="item.path">
            <ItemIcon :type="item.type" v-else/>
            <div class="absolute hidden md:block top-1/2 w-full text-center text-neutral-500"
                 v-if="!((item.mime_type ?? '').startsWith('image') && app.showThumbnails) && item.type !== 'dir'" >
              {{ ext(item.extension) }}
            </div>
          </div>

          <span class="break-all">{{ title_shorten(item.basename) }}</span>
        </div>
      </Item>
    </div>

    <Toast/>
    <div class="pointer-events-none select-none cursor-pointer w-full h-full bg-slate-100 text-slate-500 absolute flex items-center justify-center" v-if="hasFilesInDropArea">
      {{ t('Release to drop these files.') }}
    </div>
  </div>
</template>

<script setup>
import {inject, onBeforeUnmount, onMounted, onUpdated, reactive, ref, watch} from 'vue';
import datetimestring from '../utils/datetimestring.js';
import title_shorten from "../utils/title_shorten.js";
import Toast from './Toast.vue';
import LazyLoad from 'vanilla-lazyload';
import SortIcon from "./SortIcon.vue";
import ItemIcon from "./ItemIcon.vue";
import DragItem from "./DragItem.vue";
import Item from "./Item.vue";
import ModalUpload from "./modals/ModalUpload.vue";


const app = inject('ServiceContainer');
const {t} = app.i18n;

const ext = (item) => item?.substring(0, 3)
const dragImage = ref(null);

const searchQuery = ref('');
const ds = app.dragSelect;
const uploading = ref(false);
const hasFilesInDropArea = ref(false);

/** @type {import('vue').Ref<HTMLDivElement>} */
const dropArea = ref(null);

/** @type {import('vanilla-lazyload').ILazyLoadInstance} */
let vfLazyLoad

app.emitter.on('vf-fullscreen-toggle', () => {
  ds.area.value.style.height = null;
});

app.emitter.on('vf-search-query', ({newQuery}) => {
  searchQuery.value = newQuery;

  if (newQuery) {
    app.emitter.emit('vf-fetch', {
      params: {
        q: 'search',
        adapter: app.fs.adapter,
        path: app.fs.data.dirname,
        filter: newQuery
      },
      onSuccess: (data) => {
        if (!data.files.length) {
          app.emitter.emit('vf-toast-push', {label: t('No search result found.')});
        }
      }
    });
  } else {
    app.emitter.emit('vf-fetch', {params: {q: 'index', adapter: app.fs.adapter, path: app.fs.data.dirname}});
  }
});

const sort = reactive({active: false, column: '', order: ''});

const getItems = (sorted = true) => {
  let files = [...app.fs.data.files],
      column = sort.column,
      order = sort.order === 'asc' ? 1 : -1;

  if (!sorted) {
    return files;
  }

  const compare = (a, b) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  if (sort.active) {
    files = files.slice().sort((a, b) => compare(a[column], b[column]) * order);
  }

  return files;
};

const sortBy = (column) => {
  if (sort.active && sort.column === column) {
    sort.active = sort.order === 'asc'
    sort.column = column
    sort.order = 'desc'
  } else {
    sort.active = true
    sort.column = column
    sort.order = 'asc'
  }
};


onMounted(() => {
  vfLazyLoad = new LazyLoad(ds.area.value);

  dropArea.value.addEventListener('dragover', ev => {
    ev.preventDefault();
    hasFilesInDropArea.value = true;
  });
  dropArea.value.addEventListener('dragleave', ev => {
    ev.preventDefault();
    hasFilesInDropArea.value = false;
  });
  /**
   * @callback ResultCallback
   * @param {FileSystemEntry|FileSystemDirectoryEntry|FileSystemFileEntry} fileSystemEntry
   * @param {File} file
   */

  /**
   * Iterate through all dirs & files, will invoke resultCallback multiple times when read file
   * @param {ResultCallback} resultCallback
   * @param {FileSystemEntry|FileSystemDirectoryEntry|FileSystemFileEntry} item
   * @returns {Promise<void>}
   */
  function scanFiles(resultCallback, item) {
    if (item.isFile) {
      return new Promise((resolve, reject) => {
        item.file(file => {
          resultCallback(item, file);
          resolve();
        }, reject);
      });
    }

    if (item.isDirectory) {
      return new Promise((resolve, reject) => {
        const reader = item.createReader();
        reader.readEntries(async entries => {
          try {
            for (const entry of entries) {
              await scanFiles(resultCallback, entry);
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    }

    return Promise.resolve();
  }

  dropArea.value.addEventListener('drop', async ev => {
    ev.preventDefault();
    hasFilesInDropArea.value = false;
    const trimFileName = /^[/\\](.+)/;
    const fileList = [];
    
    const promises = [...ev.dataTransfer.items].map(async item => {
      if (item.kind === "file") {
        await scanFiles((entry, file) => {
          const matched = trimFileName.exec(entry.fullPath);
          fileList.push({file, path: matched[1]});
        }, item.webkitGetAsEntry());
      }
    });

    // 等待所有的异步操作完成
    await Promise.all(promises);

    // 将文件列表暂存到全局变量中，以便在弹窗中使用
    window.tmpFileList = fileList;
    app.modal.open(ModalUpload, {items: ds.getSelected()});
  });
});

onUpdated(() => {
  vfLazyLoad.update();
});

onBeforeUnmount(() => {
  vfLazyLoad.destroy();
});

</script>
