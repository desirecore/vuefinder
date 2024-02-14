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

      <button class="vf-btn py-0 vf-btn-primary"
              :class="{disabled: !isSelectButtonActive}"
              :disabled="!isSelectButtonActive"
              v-if="app.selectButton.active" @click="app.selectButton.click(app.selectedItems, $event)">{{ t("Select") }}</button>

      <span class="mr-1" :aria-label="t('Settings')" data-microtip-position="top-left" role="tooltip" @click="app.emitter.emit('vf-modal-show', {type:'about'})">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-slate-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
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
import {computed, inject, ref} from 'vue';

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

const isSelectButtonActive = computed(() => {
  const selectionAllowed = app.selectButton.multiple ? app.selectedItems.length > 0 : app.selectedItems.length === 1;
  return app.selectButton.active && selectionAllowed;
});

</script>

