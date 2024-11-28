import { Ref, ref } from "vue";
import { useSearchStore } from "../stores/search";
import useFetchAndLoad from "../modules/useFetchAndLoad";
import type { AxiosCall } from "../modules/useFetchAndLoad";

interface MediaSearchOptions {
  page: number;
  per_page: number;
}

interface MediaSearchContext {
  columnCount: Ref<number>;
  mediaItems: Ref;
  directoryStorage: string | null;
  isAvaliableApi: Ref<boolean>;
  isLoading: Ref<boolean>;
  searchMedia: (isFromInput?: boolean) => void;
  cancelEndpoint: () => void;
}

const { loading, callEndpoint, cancelEndpoint } = useFetchAndLoad();

export  function useMediaSearch (
  mediaType: "photos" | "videos"
): MediaSearchContext {
  const { searcher } = useSearchStore();

  const mediaItems = ref<any[]>([]);
  const columnCount = ref(3);
  const directoryStorage = localStorage.getItem(
    `directorySave${mediaType === "photos" ? "Photos" : "Videos"}`
  );
  const isAvaliableApi = ref(true) // Esta disponible o no la API para videos, fotos, etc
  const page = ref(1);
  const isLoading = ref(false);
  const searchMedia = async (isFromInput: boolean = false) => {
    if (isLoading.value) return;

    if (isFromInput) {
      mediaItems.value = [];
      page.value = 1;
    }

    isLoading.value = true;

    
    const searchOptions: MediaSearchOptions = {
      page: page.value,
      per_page: mediaType === "photos" ? 12 : 9,
    };

    const search = await searcher[mediaType](searchOptions) as AxiosCall<any>;

    const adaptResponse = search.transformResponse;

    callEndpoint(search).then((result) => {
      mediaItems.value = [...mediaItems.value, ...adaptResponse(result, mediaType)];
      page.value += 1;
      isLoading.value = false;
      isAvaliableApi.value = true
    }).catch(() => {
      isAvaliableApi.value = false
        return new Error("Api no disponible");
    })

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
