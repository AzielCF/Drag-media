import type { ApiConfig } from "./apiconfig";
import type { Ref } from "vue";
interface GetApiDetails {
  (
    type: "photos" | "videos",
    selectedApiName: Ref<any>,
    activeApiPhotos: Ref<string>,
    activeApiVideos: Ref<string>,
    activeApiDefault: Ref<string | null>,
    apiKeyValue: ComputedRef<string | null>
  ): ApiConfig | null;
}
