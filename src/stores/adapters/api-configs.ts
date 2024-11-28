import type { ItemTransformed } from "./types/TypeAdapters.d";
import type { ApiConfig } from "./types/apiconfig";
import * as Pexels from "./Pexels.adapter";
import * as Unsplash from "./Unsplash.adapter";
import * as Pixabay from "./Pixabay.adapter";

const pexelsConfig: ApiConfig = {
  apiKeyHeader: "Authorization",
  transformSearch: (data) => {
    const { total_results, page, per_page, next_page, url, ...rest } = data;
    return {
      total_results,
      page,
      per_page,
      next_page,
      url,
      ...rest,
    };
  },
  transformItem: (item, endPoint) => {
    if (endPoint === "photos") {
      return Pexels.transformPhoto(item);
    } else if (endPoint === "videos") {
      return Pexels.transformVideo(item);
    }
    return item as ItemTransformed;
  },
  baseUrl: "https://api.pexels.com",
  endpoints: {
    photos: "/v1/search?locale=es-ES",
    videos: "/videos/search?locale=es-ES",
  },
  apiKey:
    import.meta.env.VITE_PEXELS_API_KEY ||
    localStorage.getItem("PEXELS_API_KEY"),
};

const unsplashConfig: ApiConfig = {
  authorizationHeader: (apiKey) => ({ Authorization: `Client-ID ${apiKey}` }),
  transformSearch: (data) => Unsplash.transformSearch(data), // Puedes definir una transformación específica si es necesario
  transformItem: (item, endPoint) => {
    if (endPoint === "photos") {
      return Unsplash.transformPhoto(item);
    }
    return item as ItemTransformed;
  },
  baseUrl: "https://api.unsplash.com",
  endpoints: {
    photos: "/search/photos",
  },
  apiKey:
    import.meta.env.VITE_UNSPLASH_API_KEY ||
    localStorage.getItem("UNSPLASH_API_KEY"),
};

const pixabayConfig: ApiConfig = {
  transformSearch: (data) => Pixabay.transformSearch(data), // Puedes definir una transformación específica si es necesario
  transformItem: (item, endPoint) => {
    if (endPoint === "photos") {
      return Pixabay.transformPhoto(item);
    } else if (endPoint === "videos") {
      return Pixabay.transformVideo(item);
    }
    return item as ItemTransformed;
  },
  baseUrl: "https://pixabay.com/api",
  endpoints: {
    photos: "/",
    videos: "/videos/",
  },
  queryParams: {
    key:
      import.meta.env.VITE_PIXABAY_API_KEY ||
      localStorage.getItem("PIXABAY_API_KEY") ||
      "",
  },
};

interface ApiConfigs {
  [key: string]: ApiConfig;
}

export const apiConfigs: ApiConfigs = {
  pexels: pexelsConfig,
  unsplash: unsplashConfig,
  pixabay: pixabayConfig,
};