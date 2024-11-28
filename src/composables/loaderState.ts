import { storeToRefs } from "pinia";
import { useGlobalVarsStore } from "../stores/globalVars";

interface ShowLoader {
  state: boolean;
  mediaId: number | undefined;
}

interface ShowLoaderEventDetail {
  state: boolean;
  fileID: number;
}

// Busca un mediaId en el array showLoader.value
const findLoaderIndex = (showLoader: { value: ShowLoader[] }, mediaId: number) => {
  return showLoader.value.findIndex(
    (loader: ShowLoader) => loader.mediaId === mediaId
  );
};

// Maneja el evento 'showLoader'
const updateOrAddLoaderState = (event: CustomEvent<ShowLoaderEventDetail>, showLoader: { value: ShowLoader[] }) => {
  const existingIndex = findLoaderIndex(showLoader, event.detail.fileID);

  if (existingIndex !== -1) {
    showLoader.value[existingIndex].state = event.detail.state;
  } else {
    showLoader.value.push({
      state: event.detail.state,
      mediaId: event.detail.fileID,
    });
  }
};

// Añade el manejador de eventos al objeto window
const addLoaderEventListener = (showLoader: { value: ShowLoader[] }) => {
  window.addEventListener("showLoader", (event) => updateOrAddLoaderState(event as CustomEvent<ShowLoaderEventDetail>, showLoader));
};

// Obtiene el estado del cargador
export const loaderState = (mediaId: number) => {
  const { showLoader } = storeToRefs(useGlobalVarsStore());
  addLoaderEventListener(showLoader);
  const existingIndex = findLoaderIndex(showLoader, mediaId);

  return existingIndex !== -1 ? showLoader.value[existingIndex].state : false;
};
