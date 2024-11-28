import type { SearchResponse } from "./transformResponseTypes";

interface ApiConfig {
  apiKeyHeader?: string;
  authorizationHeader?: (apiKey?: string) => object;
  transformSearch: <T>(data: SearchResponse<T>) => SearchResponse<T>;
  transformItem: (item: any, endPoint: string) => any;
  baseUrl: string;
  endpoints: {
    photos?: string;
    videos?: string;
  };
  apiKey?: string;
  queryParams?: {
    key: string
  };
}
