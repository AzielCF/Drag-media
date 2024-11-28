<script setup lang="ts">
import { onUnmounted } from "vue";
import { storeToRefs } from 'pinia'
import { useGlobalVarsStore } from '../stores/globalVars'
import loaderComponent from '../components/ui/elements/loaderComponent.vue'
import { useMediaManager } from '../composables/MediaManager'
import { loaderState } from '../composables/loaderState'

const {
  groupedMedia,
  isLoading,
  isAvaliableApi,
  downloadedMediaNames,
  handleDragStart,
  startDownloadFile,
  isMediaDraggable,
  cancelEndpoint
} = useMediaManager('photos');

const { photoPreviewSize, downloadPhotoSize } = storeToRefs(useGlobalVarsStore())

onUnmounted(() => {
  cancelEndpoint();
});
</script>

<template>
  <main class="flex flex-col">
    <template v-if="!isAvaliableApi"><span>No hay api disponible.</span></template>
    <template v-else>
      <div class="gallery">
        <template v-for="group in groupedMedia" :key="group.id">
          <div class="column">
            <template v-for="photo in group" :key="photo.id">
              <div class="relative my-2.5 max-w-50 overflow-hidden bg-cover bg-[50%] bg-no-repeat">
                <template v-if="loaderState(photo.id)">
                  <loaderComponent />
                </template>

                <a target="_blank" rel="noopener"
                  @dragstart="downloadedMediaNames.includes(`${photo.id}[${downloadPhotoSize}]`) && handleDragStart($event, photo.src[downloadPhotoSize], photo.id)">
                  <img :key="photo.id" class="w-full h-full rounded hover:opacity-60 cursor-pointer"
                    :src="photo.src[photoPreviewSize]" :alt="photo.alt" :draggable="!isMediaDraggable(photo.id)">
                </a>

                <div v-if="isMediaDraggable(photo.id) && !loaderState(photo.id)">
                  <a class="download-button" target="_blank" rel="noopener"
                    @click="startDownloadFile(photo.src[downloadPhotoSize], photo.id)">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAU0lEQVR4nO3QsQqAMAxF0ffXHdM/v+KgQ0qtaCxIc6BLh3ch0jJwMtAgTzRCnsgDij/LBdOHEXs0fjNir8YHkZjxTiR2/ADU/Z0fKRTBND2gv9oAVZTQEh7ZErUAAAAASUVORK5CYII=">
                  </a>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
      <div v-if="isLoading">Cargando contenido...</div>
    </template>
  </main>
</template>
