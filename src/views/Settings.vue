<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import buttonComponent from '@/components/ui/elemets/buttonComponent.vue';
import selectorComponent from '@/components/ui/elemets/selectorComponent.vue';
import inputComponent from '@/components/ui/elemets/inputComponent.vue';
import { useApiKeyStore } from '@/modules/apiManager';
import poppupAddKeyComponent from '@/components/poppupAddkeyComponent.vue';
import appUpdater from '@/components/ui/sections/appUpdaterComponent.vue';
import uppercaseFirstLetter from '@/utils/uppercaseFirstLetter.util'
import { apiConfigs } from "@/stores/adapters/api-configs";

const { apiKeyData, defaultApi } = storeToRefs(useApiKeyStore());

// -------------- DIRECTORY MEDIA SAVE ------------------
const directoryPhotos = ref('');
const directoryVideos = ref('');
const directoryPhotosStorage = localStorage.getItem('directorySavePhotos');
const directoryVideosStorage = localStorage.getItem('directorySaveVideos');

const selectDirectory = (type: string) => {
  if (type == "photos") {
    window.electron.selectDirectory(type);
  } else {
    window.electron.selectDirectory(type);
  }
}

  ; (async () => {
    //Se obtiene del preload el contextBridge foldersObtained()
    const foldersObj = await window.foldersObtained();

    // Si no hay el folder custom en local storage, opta el directorio defauld 
    directoryPhotos.value = directoryPhotosStorage ?? foldersObj.imagesFolder;
    directoryVideos.value = directoryVideosStorage ?? foldersObj.videosFolder;
  })()

window.addEventListener('selectedDirectory', (event: any) => {
  const { selectedDirectory, typeFile } = event.detail.data;
  if (!selectedDirectory) {
    return
  }

  // Verificar cuál input debe actualizarse según el tipo
  if (typeFile == "photos") {
    directoryPhotos.value = selectedDirectory;
    localStorage.setItem('directorySavePhotos', selectedDirectory);
  } else {
    directoryVideos.value = selectedDirectory;
    localStorage.setItem('directorySaveVideos', selectedDirectory);
  }
})

// -------------- SET API KEY ------------------
const applyApiKey = (apiName: string) => {
  if (apiName) {
    useApiKeyStore().deleteApiKey(apiName);
    //location.reload()
  } else {
    console.error('Campo sin valor.');
  }
};

// -------------- SELECT DEFAULT API ------------------
const photoApiOptions = computed(() => {
  const options = Object.keys(apiConfigs)
    .filter(key => apiConfigs[key].endpoints.photos && apiKeyData.value[key])
    .map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: key
    }));

  options.unshift({ name: 'Auto', value: '' });
  return options;
});

const videoApiOptions = computed(() => {
  const options = Object.keys(apiConfigs)
    .filter(key => apiConfigs[key].endpoints.videos && apiKeyData.value[key])
    .map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: key
    }));

  options.unshift({ name: 'Auto', value: '' });
  return options;
});

const selectedApiPhotos = ref(defaultApi.value.photos);
const selectedApiVideo = ref(defaultApi.value.videos);

watch([selectedApiPhotos, selectedApiVideo], () => {
  const apiKeyStore = useApiKeyStore();
  
  apiKeyStore.setDefaultApiForCategory("photos", selectedApiPhotos.value);
  apiKeyStore.setDefaultApiForCategory("videos", selectedApiVideo.value);
  
  localStorage.setItem('DefaultApiPhotos', selectedApiPhotos.value);
  localStorage.setItem('DefaultApiVideos', selectedApiVideo.value);
});

// Cargar desde localStorage si está disponible
selectedApiPhotos.value = localStorage.getItem('DefaultApiPhotos') || defaultApi.value.photos;
selectedApiVideo.value = localStorage.getItem('DefaultApiVideos') || defaultApi.value.videos;

</script>

<template>
  <main>

    <div class="w-full max-w-[695px]">
      <section class="pt-3">
        <div class="section-input">
          <h2 class="text-2xl text-center pb-3">Clave API</h2>
          <div class="flex justify-center gap-7  pb-1">
            <template v-for="(key, index) in useApiKeyStore().apiKeys" :key="index">
              <buttonComponent :valueName="uppercaseFirstLetter(key.toString())" class="rounded-3xl"
                :class="apiKeyData[key] ? 'cursor-default bg-green-900' : null"
                :disabled="apiKeyData[key] ? false : true" />
            </template>
          </div>

          <ul class="flex flex-col gap-2 divide-y divide-neutral-600">
            <template v-for="(key, name) in apiKeyData" :key="name">
              <li v-if="key">
                <details class="group">
                  <summary
                    class="flex items-center justify-between gap-2 py-2 font-medium marker:content-none hover:cursor-pointer">
                    <span class="flex gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6" :class="key ? 'text-[#009e69]' : null">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{{ uppercaseFirstLetter(name.toString()) }}</span>
                    </span>
                    <svg class="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fill-rule="evenodd"
                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z">
                      </path>
                    </svg>
                  </summary>
                  <article class="px-1 pb-4">
                    <ul class="flex flex-col gap-1 pl-2">
                      <li>
                        <div class="section-directory">
                          <inputComponent disabled type="password" v-model="apiKeyData[name]" placeholder="Api Key" />
                          <buttonComponent class=" hover:bg-red-900" @click="applyApiKey(name.toString())"
                            valueName="Eliminar" />
                        </div>
                      </li>
                    </ul>
                  </article>
                </details>
              </li>
            </template>
            <li>
              <details class="group">
                <summary class="flex gap-2 py-2">
                  <poppupAddKeyComponent />
                </summary>
              </details>
            </li>
          </ul>
        </div>
      </section>

      <div style="border-bottom: 1px solid #7a7a7a; margin: 20px 0px 20px 0px;" />

      <section name="selector-api-default">
        <h2 class="text-2xl text-center py-2">API por defecto</h2>
        <div class="flex flex-row gap-2 py-2 items-center justify-center">
          <div> Fotos:
            <selectorComponent :options="photoApiOptions" v-model="selectedApiPhotos" />
          </div>
          <div> Videos:
            <selectorComponent :options="videoApiOptions" v-model="selectedApiVideo" />
          </div>
        </div>
      </section>

      <div style="border-bottom: 1px solid #7a7a7a; margin: 20px 0px 20px 0px;" />
      <section>
        <h2 class="text-2xl text-center py-2">Directorios de guardado</h2>
        <div class="flex flex-col gap-2 py-2">
          <div class="section-input">
            <label>Fotos</label>
            <div class="section-directory">
              <inputComponent v-model="directoryPhotos" placeholder="Directorio" disabled />
              <buttonComponent @click="selectDirectory('photos')" valueName="Seleccionar" />
            </div>
          </div>
          <div class="section-input">
            <label>Vídeos</label>
            <div class="section-directory">
              <inputComponent v-model="directoryVideos" placeholder="Directorio" disabled />
              <buttonComponent @click="selectDirectory('video')" valueName="Seleccionar" />
            </div>
          </div>
        </div>
      </section>
      <div style="border-bottom: 1px solid #7a7a7a; margin: 20px 0px 20px 0px;" />
      <section class="w-full pb-4">
        <h2 class="text-2xl py-2">Soporte</h2>
        <a target="_blank" href="https://github.com/AzielCF/Pexels-drag">
          <buttonComponent class="mt-2 w-full" valueName="Repositorio de Github" />
        </a>
        <a target="_blank" href="https://drag-media-web.vercel.app/">
          <buttonComponent class="mt-4 w-full" valueName="Página web" />
        </a>
        <a target="_blank" href="https://github.com/AzielCF/">
          <buttonComponent class="mt-4 w-full" valueName="Autor del proyecto" />
        </a>
      </section>
      <div style="border-bottom: 1px solid #7a7a7a; margin: 20px 0px 20px 0px;" />
      <section class="w-full pb-4">
        <h2 class="text-2xl py-2">Actualizaciones</h2>
        <appUpdater/>
      </section>
      <div class="mt-4" style="border-bottom: 1px solid #7a7a7a;" />
      <section class="disclaimer py-5">
        <h2 class="text-2xl py-2">Disclaimer</h2>
        <p>Drag media utiliza la <a target="_blank" href="https://www.pexels.com/es-es/api/">API de Pexels, Unsplash y
            Pixabay</a> para
          obtener medios de stock, pero no está afiliado, respaldado ni patrocinado por ninguno de sus desarrolladores
          originales. Todos los medios son propiedad de sus respectivos dueños y se proporcionan para uso personal y
          no comercial.</p>
      </section>
      <div class="mt-4" style="border-bottom: 1px solid #7a7a7a;" />
      <section class="pt-5">
        <div>
          Proyecto creado por <a target="_blank" href="https://github.com/AzielCF/">Aziel Cruzado</a>
        </div>
      </section>
    </div>
  </main>
</template>
