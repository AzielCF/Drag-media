import { useSearchStore } from "../stores/search";
import useFetchAndLoad from "../modules/useFetchAndLoad";
import type { AxiosCall } from "../modules/useFetchAndLoad";
import { ref, Ref } from 'vue';

interface MediaSearchOptions {
  page: number;
  per_page: number;
}

interface MediaSearchContext {
  columnCount: Ref<number>;
  mediaItems: Ref<any[]>;
  directoryStorage: string | null;
  isAvaliableApi: Ref<boolean>;
  isLoading: Ref<boolean>;
  searchMedia: (isFromInput?: boolean) => Promise<void>;
  cancelEndpoint: () => void;
}

const { loading, callEndpoint, cancelEndpoint } = useFetchAndLoad();

export function useMediaSearch(
  mediaType: "photos" | "videos"
): MediaSearchContext {
  const { searcher } = useSearchStore();

  const mediaItems = ref<any[]>([]);
  const columnCount = ref(3);
  const directoryStorage = localStorage.getItem(
    `directorySave${mediaType === "photos" ? "Photos" : "Videos"}`
  );
  let isAvaliableApi = true;
  let page = 1;
  const isLoading = ref(false); 

  const searchMedia = async (isFromInput: boolean = false): Promise<void> => {
    if (isLoading.value) return;

    if (isFromInput) {
      mediaItems.value = [];
      page = 1;
    }

    isLoading.value = true;

    const searchOptions: MediaSearchOptions = {
      page,
      per_page: mediaType === "photos" ? 18 : 18,
    };

    try {
      const search = await searcher[mediaType](searchOptions) as AxiosCall<any>;
      const adaptResponse = search.transformResponse;

      const result = await callEndpoint(search);
      mediaItems.value = [...mediaItems.value, ...adaptResponse(result, mediaType)];
      page += 1;
      isLoading.value = false;
      isAvaliableApi = true;

    } catch (error) {
      isAvaliableApi = false;
      console.error("API no disponible", error);
      isLoading.value = false;
    }
  };
  return {
    mediaItems,
    columnCount,
    directoryStorage,
    isLoading,
    searchMedia,
    isAvaliableApi,
    cancelEndpoint
  };
}
