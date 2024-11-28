<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import buttonComponent from './ui/elements/buttonComponent.vue';
import inputComponent from './ui/elements/inputComponent.vue'
import { useApiKeyStore } from '@/stores/apiManager';

interface Headers {
  [key: string]: string;
}

const apiKey = ref('')
const errorMessage = ref('') // Mensaje de error
const isApiKeyValid = ref(false)
const showApiKey = ref(false)
const isLoading = ref(false)
const successMessage = ref('')

const isValidApiKey = () => {
  // Verifica si la API key tiene al menos 30 caracteres y contiene obligatoriamente un número y opcionalmente una letra mayúscula, una letra minúscula, guiones y guiones bajos
  const regex = /^(?=.*\d)[a-zA-Z\d\-_]*$/
  isApiKeyValid.value = apiKey.value.length >= 30 && regex.test(apiKey.value)
  return isApiKeyValid.value
}

const apiValidationConfig = [
  { name: 'PEXELS', url: 'https://api.pexels.com/v1/search?query=ocean', headerKey: 'Authorization' },
  { name: 'UNSPLASH', url: 'https://api.unsplash.com/search/photos?query=ocean', headerKey: 'Authorization', prefix: 'Client-ID' },
  {
    name: 'PIXABAY',
    getUrl: () => `https://pixabay.com/api/?key=${apiKey.value}&q=ocean`,
    headerKey: null
  }
];

const validateApiKey = async () => {
  for (const api of apiValidationConfig) {
    // Usar la función getUrl si está presente, de lo contrario usar la propiedad url
    const uniqueUrl = `${api.getUrl ? api.getUrl() : api.url}&_=${Date.now()}`;
    let headers: Headers = {};

    if (api.headerKey) {
      const headerValue = api.prefix ? `${api.prefix} ${apiKey.value}` : apiKey.value;
      headers[api.headerKey] = headerValue;
    }

    try {
      const response = await axios.get(uniqueUrl, { headers });
      if (response.status === 200 && (api.name !== 'PIXABAY' || response.data.totalHits > 0)) {
        // La validación fue exitosa
        return api.name;
      }
    } catch (error) {
      console.error(`Error validando ${api.name}:`, error);
    }
  }
  return null; // Si ninguna API key es válida, retorna null
};

const applyApiKey = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (isValidApiKey()) {
    isLoading.value = true;

    const validatedApiName = await validateApiKey();

    if (validatedApiName) {
      successMessage.value = 'API key válida. Aplicando...';

      // Recargar la página y luego establecer la API Key
      reloadPage(validatedApiName);
    } else {
      errorMessage.value = 'API key inválida, no es posible conectar.';
      isLoading.value = false;
    }
  } else {
    errorMessage.value = 'Esto no es una API key válida';
    isLoading.value = false;
  }
};

const reloadPage = (apiName: string) => {
  setTimeout(() => {
    // Resetear mensajes de éxito y carga
    successMessage.value = '';
    isLoading.value = false;
    // Establecer la API Key después de que se completa la recarga simulada
    useApiKeyStore().setApiKey(apiName, apiKey.value);
    apiKey.value = '';
    console.clear();
    
  }, 1500); // Retraso de 2 segundos para simular la recarga
};


const pasteFromClipboard = async () => {
  // Lógica para pegar desde el portapapeles
  const textFromClipboard = await navigator.clipboard.readText()
  apiKey.value = textFromClipboard
  applyApiKey()
}

const toggleShowApiKey = () => {
  // Lógica para mostrar u ocultar la clave
  showApiKey.value = !showApiKey.value
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'z') {
    apiKey.value = ''
  }
}
</script>

<template>
  <div class="section-input flex max-w-screen-sm mx-auto">
    <inputComponent v-model="apiKey" placeholder="Api key" @input="applyApiKey()"
      :type="showApiKey ? 'text' : 'password'" />
      <buttonComponent class="px-2 mx-1 text-current" v-show="!isLoading" value-name="Pegar" @click=" pasteFromClipboard" />
      <buttonComponent class="px-2 text-current max-[520px]:hidden" :value-name="showApiKey ? 'Ocultar' : 'Mostrar'"
        @click="toggleShowApiKey" />

  </div>
  <div class="absolute left-0 flex flex-col text-center my-5 w-full">
    <span class="text-red-500" v-show="apiKey.trim() !== ''">{{ errorMessage }}</span>
    <span class="text-green-500" v-show="successMessage !== ''">{{ successMessage }}</span>

    <div v-show="isLoading && !successMessage" class="pb-3">
      <span class="animate-spin">⚙️</span> Validando...
    </div>

  </div>
</template>
