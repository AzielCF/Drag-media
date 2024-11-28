import { ref, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import axios from "axios";
import { AxiosResponse } from 'axios';
import { loadAbort } from "../utils/load-abort-axios.util";
import { getApiDetails } from "./getApiDetails";
import { useApiKeyStore } from "@/stores/apiManager";

export const useSearchStore = defineStore("search", () => {
  const defaultQuery = "ocean";
  const query = ref(defaultQuery);
  const orientation = ref<"landscape" | "portrait" | "square" | undefined>(undefined);
  
  const { defaultApi, getApiKey, apiKeyData } = storeToRefs(useApiKeyStore());

  const activeApiDefault = computed(() => defaultApi.value.general);
  const activeApiPhotos = computed(() => defaultApi.value.photos);
  const activeApiVideos = computed(() => defaultApi.value.videos);
  
  // Computed para obtener el valor de la clave API activa
  const apiKeyValue = computed(() => {
    const apiKey = getApiKey.value(activeApiDefault.value);

    return apiKey ? apiKey.key : null;
  });
  const selectedApiName = ref("");

  const searcher = {
    photos: (params: object) => searcher.search("photos", params),
    videos: (params: object) => searcher.search("videos", params),
    search: async (type: "photos" | "videos", params: any) => {
      const immediateApiKey = ref(apiKeyData.value[type === "photos" ? activeApiPhotos.value : activeApiVideos.value]);
      const ApiDetails = getApiDetails(type, selectedApiName, activeApiPhotos, activeApiVideos, activeApiDefault, immediateApiKey.value ? immediateApiKey : apiKeyValue);

      if (!ApiDetails?.apiKey && !ApiDetails?.queryParams?.key) {
        console.error(`No hay API disponible para ${type}.`);
        return { call: null };
      }

      const {
        baseUrl,
        endpoints,
        apiKeyHeader,
        apiKey,
        queryParams,
        authorizationHeader,
        transformItem,
        transformSearch,
      } = ApiDetails;

      const requestParams = {
        ...queryParams,
        ...params,
        query: query.value || defaultQuery,
        q: query.value || defaultQuery,
        orientation: orientation.value
      };

      const headers: any = {};
      if (authorizationHeader) {
        // Si la cabecera de autorización es asíncrona, espera a que se resuelva
        await new Promise((resolve) => {
          Object.assign(headers, authorizationHeader(apiKey));
          resolve(true); // Espera hasta que el encabezado esté completo
        });
      } else if (!queryParams && apiKeyHeader) {
        console.log("apiKeyHeader", apiKeyHeader);
        headers[apiKeyHeader] = apiKey;
      } else if (queryParams) {
        requestParams.key = apiKey;
      }
  
      
      console.log(apiKey)
      console.log(requestParams)

      const controller = loadAbort();
      const response = axios.get(`${baseUrl}${endpoints[type]}`, {
        method: "GET",
        params: requestParams,
        headers,
        signal: controller.signal
      });

      const transformResponse = (response: AxiosResponse, type: string) => {
        const transformedResponse: any = transformSearch(response.data);
        const transformedItems = transformedResponse[type].map((item: any) =>
          transformItem(item, type)
        );
        return transformedItems;
      };

      return { call: response, controller, transformResponse };
    }
  };

  return {
    query,
    searcher,
    orientation,
    activeApiDefault,
    apiKeyValue,
    selectedApiName
  };
});
