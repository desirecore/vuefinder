<template>
  <div class="p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none">
    <div class="flex leading-5 items-center">
      <div class="mx-2" :aria-label="t('Storage')" data-microtip-position="top-right" role="tooltip">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      </div>
      <select v-model="app.adapter" @change="handleStorageSelect" class="py-0.5 text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8">
        <option v-for="storage in app.data.storages" :value="storage">
          {{ storage }}
        </option>
      </select>

     <div class="ml-3">
       <span v-if="searchQuery.length">{{ app.data.files.length }} items found. </span>
       <span class="ml-1">{{ selectedItemCount > 0 ? t('%s item(s) selected.', selectedItemCount) : '' }}</span>
     </div>
    </div>
    <div class="flex leading-5 items-center justify-end">

      <span class="mr-1" :aria-label="t('Settings')" data-microtip-position="top-left" role="tooltip" @click="app.emitter.emit('vf-modal-show', {type:'about'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-slate-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <g fill-rule="evenodd" clip-rule="evenodd">
            <path d="M6.848 1.254a2.344 2.344 0 0 1 2.304 0l5.079 2.867a2.344 2.344 0 0 1 1.19 2.041v5.676c0 .845-.454 1.625-1.19 2.04l-5.079 2.868a2.344 2.344 0 0 1-2.304 0L1.769 13.88a2.344 2.344 0 0 1-1.19-2.041V6.162c0-.845.454-1.625 1.19-2.04l5.079-2.868Z"/>
            <path d="M8 7.125a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75ZM4.562 9a3.437 3.437 0 1 1 6.875 0 3.437 3.437 0 0 1-6.874 0Z"/>
          </g>
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFStatusbar'
};
</script>

<script setup>
import {inject, ref} from 'vue';

const app = inject('ServiceContainer');
const {t} = app.i18n;
const {setStore} = app.storage;

const selectedItemCount = ref(0);

const handleStorageSelect = () => {
  app.emitter.emit('vf-search-exit');
  app.emitter.emit('vf-fetch', {params:{q: 'index', adapter: app.adapter}});
  setStore('adapter', app.adapter)
};

app.emitter.on('vf-nodes-selected', (items) => {
  selectedItemCount.value = items.length;
})

const searchQuery = ref('');

app.emitter.on('vf-search-query', ({newQuery}) => {
  searchQuery.value = newQuery;
});

</script>

