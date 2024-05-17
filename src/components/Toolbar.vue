<template>
  <div class="border-neutral-300 flex justify-between items-center py-1 text-sm">
    <div class="flex text-center" v-if="!searchQuery.length">
      <div class="mx-1.5"
           :aria-label="t('New Folder')" data-microtip-position="bottom-right" role="tooltip"
           v-if="app.features.includes(FEATURES.NEW_FOLDER)"
           @click="app.modal.open(ModalNewFolder, {items: ds.getSelected()})">
        <NewFolderSVG/>
      </div>

      <div class="mx-1.5"
           :aria-label="t('New File')" data-microtip-position="bottom" role="tooltip"
           v-if="app.features.includes(FEATURES.NEW_FILE)"
           @click="app.modal.open(ModalNewFile, {items: ds.getSelected()})">
        <NewFileSVG/>
      </div>

      <div class="mx-1.5"
           :aria-label="t('Rename')" data-microtip-position="bottom" role="tooltip"
           v-if="app.features.includes(FEATURES.RENAME)"
           @click="(ds.getCount() !== 1) || app.modal.open(ModalRename, {items: ds.getSelected()})">
        <RenameSVG :class="(ds.getCount() === 1) ? 'vf-toolbar-icon' : 'vf-toolbar-icon-disabled'"/>
      </div>

      <div class="mx-1.5"
           :aria-label="t('Delete')" data-microtip-position="bottom" role="tooltip"
           v-if="app.features.includes(FEATURES.DELETE)"
           @click="(!ds.getCount()) || app.modal.open(ModalDelete, {items: ds.getSelected()})">
        <DeleteSVG :class="(ds.getCount()) ? 'vf-toolbar-icon' : 'vf-toolbar-icon-disabled'"/>
      </div>

      <div class="mx-1.5"
           :aria-label="t('Upload')" data-microtip-position="bottom" role="tooltip"
           v-if="app.features.includes(FEATURES.UPLOAD)"
           @click="app.modal.open(ModalUpload, {items: ds.getSelected()})">
        <UploadSVG/>
      </div>

      <div class="mx-1.5"
           v-if="app.features.includes(FEATURES.UNARCHIVE) && ds.getCount() === 1 && ds.getSelected()[0].mime_type === 'application/zip'"
           :aria-label="t('Unarchive')" data-microtip-position="bottom" role="tooltip"
           @click="(!ds.getCount()) || app.modal.open(ModalUnarchive, {items: ds.getSelected()})">
        <UnarchiveSVG :class="(ds.getCount()) ? 'vf-toolbar-icon' : 'vf-toolbar-icon-disabled'"/>
      </div>
      <div class="mx-1.5" v-if="app.features.includes(FEATURES.ARCHIVE)"
           :aria-label="t('Archive')" data-microtip-position="bottom" role="tooltip"
           @click="(!ds.getCount()) || app.modal.open(ModalArchive, {items: ds.getSelected()})">
        <ArchiveSVG :class="(ds.getCount()) ? 'vf-toolbar-icon' : 'vf-toolbar-icon-disabled'"/>
      </div>
    </div>

    <div class="flex text-center" v-else>
      <div class="pl-2"> {{ t('Search results for') }} <span
          class="dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded">{{ searchQuery }}</span></div>
      <LoadingSVG v-if="app.fs.loading"/>
    </div>

    <div class="flex text-center items-center justify-end">
        <div v-if="app.features.includes(FEATURES.FULL_SCREEN)" class="mx-1.5" :aria-label="t('Toggle Full Screen')" data-microtip-position="bottom-left" role="tooltip"
              @click="toggleFullScreen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" fill="none" viewBox="0 0 24 24" stroke="none" stroke-width="1.5">
              <path v-if="app.fullScreen" stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </div>

      <div class="mx-1.5"
           :aria-label="t('Change View')" data-microtip-position="bottom-left" role="tooltip"
           @click="searchQuery.length || toggleView()">
          <GridViewSVG v-if="app.view === 'grid'" :class="(!searchQuery.length) ? 'vf-toolbar-icon' : 'vf-toolbar-icon-disabled'"/>
          <ListViewSVG v-if="app.view === 'list'" :class="(!searchQuery.length) ? 'vf-toolbar-icon' : 'vf-toolbar-icon-disabled'"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {inject, ref} from 'vue';
import {FEATURES} from "./features.js";
import ModalNewFolder from "./modals/ModalNewFolder.vue";
import ModalNewFile from "./modals/ModalNewFile.vue";
import ModalRename from "./modals/ModalRename.vue";
import ModalDelete from "./modals/ModalDelete.vue";
import ModalUpload from "./modals/ModalUpload.vue";
import ModalUnarchive from "./modals/ModalUnarchive.vue";
import ModalArchive from "./modals/ModalArchive.vue";
import NewFolderSVG from "./icons/new_folder.svg";
import NewFileSVG from "./icons/new_file.svg";
import RenameSVG from "./icons/rename.svg";
import DeleteSVG from "./icons/delete.svg";
import UploadSVG from "./icons/upload.svg";
import ArchiveSVG from "./icons/archive.svg";
import UnarchiveSVG from "./icons/unarchive.svg";
import LoadingSVG from "./icons/loading.svg";
import FullscreenSVG from "./icons/full_screen.svg";
import MinimizeSVG from "./icons/minimize.svg";
import GridViewSVG from "./icons/grid_view.svg";
import ListViewSVG from "./icons/list_view.svg";

const app = inject('ServiceContainer');
const {setStore} = app.storage;
const {t} = app.i18n;

const ds = app.dragSelect;
const searchQuery = ref('');

app.emitter.on('vf-search-query', ({newQuery}) => {
  searchQuery.value = newQuery;
});

const toggleFullScreen = () => {
  app.fullScreen = !app.fullScreen;
  setStore('full-screen', app.fullScreen);
  app.emitter.emit('vf-fullscreen-toggle');
}

// View Management
const toggleView = () => {
  app.view = app.view === 'list' ? 'grid' : 'list';

  ds.refreshSelection();
  setStore('viewport', app.view)
};

</script>
