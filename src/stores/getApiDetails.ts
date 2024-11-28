import { apiConfigs } from "./adapters/api-configs";
import type { GetApiDetails } from "./adapters/types/getApiDetails";

export const  getApiDetails: GetApiDetails = (type: "photos" | "videos", selectedApiName, activeApiPhotos, activeApiVideos, activeApiDefault, apiKeyValue)  => {
    selectedApiName.value =
      (type === "photos" ? activeApiPhotos.value : null) ||
      (type === "videos" ? activeApiVideos.value : null) ||
      activeApiDefault.value;

    if (!selectedApiName) {
      console.error("No se ha definido ninguna API para la búsqueda.");
      return null;
    }
    if (!(selectedApiName.value in apiConfigs)) {
      throw new Error(`API no válida. Debe ser "Pexels", "Unsplash" o "Pixabay".`);
    }

    const selectedApi = apiConfigs[selectedApiName.value];

    if (!(type in selectedApi.endpoints)) {
      console.warn(
        `La API ${selectedApiName.value} no tiene un endpoint para ${type}.`
      );

      // Buscar en las otras APIs
      for (const api in apiConfigs) {
        if (
          api !== selectedApiName.value &&
          type in apiConfigs[api].endpoints
        ) {
          console.warn(
            `El endpoint ${type} no está disponible en ${selectedApiName.value}, cambiando a ${api} para este endpoint.`
          );
          return apiConfigs[api]; // Devuelve la configuración de la otra API encontrada
        }
      }

      console.error(`Ninguna API tiene un endpoint para ${type}.`);
      return null;
    }

    // Verificar si hay apiKey y si es necesario para la API seleccionada
    const apiKeyRequired =
      selectedApi.apiKeyHeader || selectedApi.authorizationHeader;

    if (apiKeyRequired && !selectedApi.apiKey && !apiKeyValue.value) {
      console.warn(
        `Se requiere una apiKey para la API ${selectedApiName.value}.`
      );
      return null;
    }

    console.log(`Usando ${selectedApiName.value} para el endpoint ${type}. Con key: ${selectedApi.queryParams?.key ? selectedApi.queryParams.key : apiKeyValue.value}`);
    const returnApiKey = selectedApi.queryParams?.key ? selectedApi.queryParams?.key : apiKeyValue.value  ;
    return {
      baseUrl: selectedApi.baseUrl,
      queryParams: selectedApi.queryParams,
      endpoints: selectedApi.endpoints,
      apiKeyHeader: selectedApi.apiKeyHeader,
      authorizationHeader: selectedApi.authorizationHeader,
      transformItem: selectedApi.transformItem,
      transformSearch: selectedApi.transformSearch,
      apiKey: !selectedApi.apiKey ? returnApiKey : selectedApi.apiKey,
    };
  }