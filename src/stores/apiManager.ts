import { defineStore } from 'pinia';
import { ref, computed, Ref } from 'vue';
import { convertString } from '@/utils';

// Definición de tipos
type ApiKeyData = {
  [key: string]: string;
};

type DefaultApiTemp = {
  general: string;
  photos: string;
  videos: string;
};

// Funciones utilitarias para manejar localStorage
const getLocalKeyStorage = (key: string): string | null => {
  return localStorage.getItem(`${key}`);
};

const setLocalKeyStorage = (key: string, value: string): void => {
  localStorage.setItem(`${key}`, value);
};

const deleteLocalKeyStorage = (key: string): void => {
  localStorage.removeItem(`${key}`);
};

export const useApiKeyStore = defineStore('apiKeyStore', () => {
  const defaultApiTemp: Ref<DefaultApiTemp> = ref({
    general: "",
    photos: getLocalKeyStorage("DefaultApiPhotos") || "",  // Verifica si ya existe en localStorage
    videos: getLocalKeyStorage("DefaultApiVideos") || "",  // Verifica si ya existe en localStorage
  });

  // Estado reactivo
  const apiKeys: string[] = ["PEXELS", "PIXABAY", "UNSPLASH"].map(key => convertString(key).toLowerCase());
  const apiKeyData: Ref<ApiKeyData> = ref({});

  // Inicializa el estado con las claves de localStorage
  const initializeApiKeys = () => {
    apiKeys.forEach(api => {
      apiKeyData.value[api] = getLocalKeyStorage(api.toUpperCase() + "_API_KEY") || "";
    });
  };

  // Computed para obtener una API key con su propiedad 'key'
  const getApiKey = computed(() => {
    return (apiName: string): { key: string } | null => {
      const apiKey = apiKeyData.value[apiName];
      return apiKey ? { key: apiKey } : null;
    };
  });

  // Computed para obtener el valor del primer API key válido
  const firstValidApiKey = computed(() => {
    return Object.keys(apiKeyData.value).find(key => apiKeyData.value[key] !== "") || null;
  });

  // Computed para el defaultApi
  const defaultApi = computed(() => {
    const generalKey = firstValidApiKey.value || ""; // Si hay una clave válida, la usa
    return {
      general: generalKey.toLowerCase(),  
      photos: defaultApiTemp.value.photos,  
      videos: defaultApiTemp.value.videos
    };
  });

  // Computed para la API activa basada en defaultApi.general
  const activeApiDefault = computed(() => defaultApi.value.general);

  // Computed para obtener el apiKeyValue reactivo
  const apiKeyValue = computed(() => {
    const apiKey = getApiKey.value(activeApiDefault.value);
    return apiKey ? apiKey.key : null;
  });

  // Función para configurar la API para 'photos' o 'videos'
  const setDefaultApiForCategory = (category: 'photos' | 'videos', apiName: string): void => {
    defaultApiTemp.value[category] = apiName;
    setLocalKeyStorage(`DefaultApi${category.charAt(0).toUpperCase() + category.slice(1)}`, apiName);
  };

  // Función para configurar una API key
  const setApiKey = (apiName: string, apiKey: string): void => {
    apiKeyData.value[convertString(apiName).toLocaleLowerCase()] = apiKey;
    setLocalKeyStorage(`${convertString(apiName).toUpperCase()}_API_KEY`, apiKey);
  };

  // Función para eliminar una API key
  const deleteApiKey = (apiName: string): void => {
    delete apiKeyData.value[apiName];
    deleteLocalKeyStorage(`${convertString(apiName).toUpperCase()}_API_KEY`);
  };

  // Inicializar las API keys al cargar el store
  initializeApiKeys();

  return {
    apiKeyData,
    apiKeys,
    firstValidApiKey,
    getApiKey,
    setApiKey,
    deleteApiKey,
    defaultApi,
    activeApiDefault,
    apiKeyValue,
    setDefaultApiForCategory
  };
});
