<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useApiKeyStore } from './stores/apiManager'
import CustomTitleBarComponent from './components/ui/elements/customTitleBarComponent.vue'
import PopupApikeyComponent from './components/ui/sections/popupApikeyComponent.vue'
import InputSearcherComponent from './components/inputSearcherComponent.vue'
import navMainComponent from './components/ui/sections/navMainComponent.vue'
import floatingButton from './components/ui/elements/floatingButton.vue'
import PopupNotifyUpdate from './components/popupNotifyUpdate.vue'

const store = useApiKeyStore()
const { firstValidApiKey } = storeToRefs(store)
const directoryPhotosStorage = localStorage.getItem('directorySavePhotos')
const directoryVideosStorage = localStorage.getItem('directorySaveVideos')

// Esta logica mantiene el estado del medio descargado, para no volver a descargar
const route = useRoute()
watch(() => route.path, (newPath, oldPath) => {
  // Aquí puedes realizar acciones específicas cuando se cambie de página
  //console.log(`Cambiado de ${oldPath} a ${newPath}`)
  window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
})
</script>

<template>
  <CustomTitleBarComponent />
  <PopupNotifyUpdate/>
  <floatingButton/>
  <template v-if="firstValidApiKey">
    <navMainComponent />
    <InputSearcherComponent v-if="route.path != '/settings'" :routeState="route" /> 
      <RouterView class="flex place-content-center flex-wrap text-center" />
  </template>
  <PopupApikeyComponent v-else/>
</template>