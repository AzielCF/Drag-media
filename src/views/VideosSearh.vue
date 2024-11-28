<script setup lang="ts">
import { useMediaManager } from '../composables/MediaManager';
import { loaderState } from '../composables/loaderState';
import { storeToRefs } from 'pinia';
import { useGlobalVarsStore } from '../stores/globalVars';
import {
  handleMouseEnterToVideoPrev,
  handleMouseLeaveToVideoPrev,
  convertUrl
} from '../composables/playerMouseHover'
import LoaderComponent from '../components/ui/elements/loaderComponent.vue';
import { onUnmounted } from "vue";

const {
  groupedMedia,
  isLoading,
  isAvaliableApi,
  downloadedMediaNames,
  handleDragStart,
  startDownloadFile,
  isMediaDraggable,
  selectVideoQuality,
  cancelEndpoint
} = useMediaManager('videos');

const { downloadVideoSize } = storeToRefs(useGlobalVarsStore());

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
            <template v-for="video in group" :key="video.id">
              <!--Si no hay forma de descargar la calidad seleccionada, no aparece-->
              <div v-if="selectVideoQuality(video.id)" class="relative my-2.5 max-w-50 overflow-hidden bg-cover bg-[50%] bg-no-repeat">
                <template v-if="loaderState(video.id)">
                  <LoaderComponent />
                </template>
                <a target="_blank" rel="noopener"
                  @dragstart="downloadedMediaNames.includes(`${video.id}[${downloadVideoSize}]`) && handleDragStart($event, selectVideoQuality(video.id), video.id)"
                  @mouseenter="handleMouseEnterToVideoPrev(video, selectVideoQuality)"
                  @mouseleave="handleMouseLeaveToVideoPrev(video)">
                  <img :src="convertUrl(video.image)" :alt="video.alt"
                    :draggable="!isMediaDraggable(video.id.toString())" class="w-full h-full rounded hover:opacity-60 cursor-pointer" />
                  <!--Este contenedor es el video dinamico-->
                  <div :id="`video-container-${video.id}`" :draggable="!isMediaDraggable(video.id.toString())"
                    :class="!isMediaDraggable(video.id.toString())"
                    class="absolute z-30 top-0 left-0 w-full h-full object-cover rounded overflow-hidden shadow cursor-pointer" />
                </a>
                <div v-if="isMediaDraggable(video.id) && !loaderState(video.id)">
                  <a class="download-button" target="_blank" rel="noopener"
                    @click="startDownloadFile(selectVideoQuality(video.id), video.id)">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAU0lEQVR4nO3QsQqAMAxF0ffXHdM/v+KgQ0qtaCxIc6BLh3ch0jJwMtAgTzRCnsgDij/LBdOHEXs0fjNir8YHkZjxTiR2/ADU/Z0fKRTBND2gv9oAVZTQEh7ZErUAAAAASUVORK5CYII=" />
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