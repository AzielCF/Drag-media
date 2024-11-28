import { onMounted, onUnmounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSearchStore } from "../stores/search";
import { useGlobalVarsStore } from "../stores/globalVars";
import { useSelectVideoQuality } from "../modules/selectVideoQuality";
import { useMediaSearch } from "./mediaSearch";
import { useIsMediaDraggable } from "../utils/vue/isMediaDraggable";
import { useDownloadActions } from "./downloadActions";
import { useGroupedMediaColumn } from "./groupedMediaColumn";
import { executeOnScrollThreshold } from "../utils/executeOnScrollThreshold";

export function useMediaManager(mediaType: "photos" | "videos") {
  const searchStore = useSearchStore();
  const { query, orientation } = storeToRefs(searchStore);

  const { showLoader, downloadPhotoSize, downloadVideoSize } = storeToRefs(
    useGlobalVarsStore()
  );

  const downloadSize =
    mediaType === "photos" ? downloadPhotoSize : downloadVideoSize;

  const { searchMedia, cancelEndpoint, mediaItems, columnCount, directoryStorage, isLoading, isAvaliableApi } =
    useMediaSearch(mediaType);

  const { selectVideoQuality } = useSelectVideoQuality(
    mediaItems,
    downloadSize
  );

  const { updateColumnCount, groupedMedia } = useGroupedMediaColumn(
    columnCount,
    mediaItems
  );

  const { isMediaDraggable, downloadedMediaNames } = useIsMediaDraggable(
    downloadSize,
    mediaType
  );

  const { handleDragStart, startDownloadFile, refreshResults } =
    useDownloadActions(directoryStorage, downloadSize, mediaType);

  // ************************************************************ //

  let removeScrollListener: () => void;
  let removeColumnCountListener: () => void;
  
  onMounted(() => {
    searchMedia(true);
    removeScrollListener = executeOnScrollThreshold(searchMedia);
    removeColumnCountListener = updateColumnCount();
  });

  onUnmounted(() => {
    removeScrollListener();
    removeColumnCountListener();
  });

  watch([query, orientation], () => {
    searchMedia(true);
  });

  // Si downloadSize cambia su valor, refrescamos los resultados de la carpeta local
  watch(downloadSize, () => {
    refreshResults();
  });

  return {
    downloadedMediaNames,
    downloadSize,
    isLoading,
    isAvaliableApi,
    mediaItems,
    columnCount,
    groupedMedia,
    handleDragStart,
    startDownloadFile,
    isMediaDraggable,
    refreshResults,
    selectVideoQuality,
    cancelEndpoint
  };
}
