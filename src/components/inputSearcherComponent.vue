<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'
import { useGlobalVarsStore } from '../stores/globalVars'
import ButtonComponent from './ui/elements/buttonComponent.vue'
import selectorComponent from './ui/elements/selectorComponent.vue'
import inputComponent from './ui/elements/inputComponent.vue'

const { photoPreviewSize, downloadPhotoSize, downloadVideoSize } = storeToRefs(useGlobalVarsStore())

const { query, orientation } = storeToRefs(useSearchStore())
const queryInit = ref('')
const directoryPhotosStorage = localStorage.getItem('directorySavePhotos')
const directoryVideosStorage = localStorage.getItem('directorySaveVideos')

// Obtén el valor almacenado en localStorage o utiliza el valor por defecto 'undefined'
const storedOrientation = localStorage.getItem('storedOrientation')

// Asigna el valor almacenado o el valor por defecto a la referencia 'orientation'
orientation.value = (storedOrientation === null || storedOrientation === "undefined") ? undefined : storedOrientation as "landscape" | "portrait" | "square"

const searcher = () => {
    // Lo reemplazamos con queryInit ya que llenar query puede causar sobrecarga y desincronizacion
    query.value = queryInit.value
    window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
}

const props = defineProps({
    routeState: Object
})

const openOptions = ref(false)

const orientationOptions = [
    { name: 'Todas las orientaciones', value: undefined },
    { name: 'Horizontal', value: 'landscape' },
    { name: 'Vertical', value: 'portrait' },
    { name: 'Cuadrado', value: 'square' }
]

const qualityPreviewSize = [
    { name: 'Baja', value: 'small' },
    { name: 'Media', value: 'medium' },
    { name: 'Alta', value: 'large' }
]

const qualityPhotoDownloadSize = [
    { name: 'Pequeño', value: 'small' },
    { name: 'Mediano', value: 'medium' },
    { name: 'Grande', value: 'large' },
    { name: 'Original', value: 'original' }
]

const qualityVideoDownloadSize = [
    { name: 'SD', value: 'sd' },
    { name: 'HD', value: 'hd' },
    { name: 'Full HD', value: 'fullHd' },
    { name: 'QHD', value: 'qHd' },
    { name: '4k', value: '4kQhd' }
]

// Observa cambios en 'orientation' y guarda el valor en localStorage
watch([orientation], () => {
    localStorage.setItem('storedOrientation', orientation.value as string)
    searcher()
})
</script>

<template>
    <div class="search-bar z-50 bg-[#1d1d1d]"
        :class="props.routeState?.name == 'home' || props.routeState?.name == 'videos' ? 'sticky top-9 ' : null">
        <div class="flex items-center max-w-[695px] mx-auto h-16">
            <inputComponent v-model="queryInit" @keydown.enter="searcher"
                placeholder="Buscar imágenes / vídeos"></inputComponent>
            <ButtonComponent @click.stop="openOptions = !openOptions" class="h-11 ml-3" valueName="Opciones">
                <template #icon>
                    <svg :class="{ 'rotate-180': openOptions }"
                        class="mr-2 h-4 w-4 text-white transform transition duration-200" xmlns="http://www.w3.org/2000/svg"
                        version="1.0" viewBox="0 0 512 512" fill="currentColor">
                        <path
                            d="M512 125.62v4.72c-1.74 13.5-12.27 23.24-25.99 23.24H25.65c-13.5 0-23.88-9.95-25.65-23.19v-4.91c1.03-7.52 4.4-13.48 10.1-17.88 6.02-4.63 11.92-5.25 20.16-5.24 150.28.06 299.94.08 448.99.05 4.39 0 9.24-.32 13.26.78 11.02 3.01 17.52 10.49 19.49 22.43Z" />
                        <rect x="76.89" y="230.43" width="358.22" height="51.14" rx="25.18" />
                        <rect x="179.41" y="358.48" width="153.18" height="51.02" rx="24.66" />
                    </svg>
                </template>
            </ButtonComponent>
        </div>
        <div class="flex flex-wrap max-w-[695px] mx-auto gap-2 pb-4" v-show="openOptions">
            <selectorComponent :options="orientationOptions" v-model="orientation" />
            <selectorComponent v-if="props.routeState?.name == 'home'" :options="qualityPreviewSize"
                v-model="photoPreviewSize" title="Previsualizar" />
            <selectorComponent v-if="props.routeState?.name == 'home'" :options="qualityPhotoDownloadSize"
                v-model="downloadPhotoSize" title="Descarga" />
            <selectorComponent v-else :options="qualityVideoDownloadSize" v-model="downloadVideoSize" title="Descarga" />
        </div>
    </div>
</template>
