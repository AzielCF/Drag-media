import { Ref, ref } from "vue";

export function useIsMediaDraggable(
  downloadSize: Ref<string>,
  mediaType: string
) {
  const downloadedMediaNames = ref<string[]>([]);
  // Obtiene los archivos descargados actuales
  window.addEventListener("savedFilesList", (event: any) => {
    const savedFilesList = event.detail.data;
    downloadedMediaNames.value = savedFilesList[mediaType]
      .filter((file: any) => file.includes("[") && file.includes("]")) // Filtrar los nombres de archivos que contienen []
      .map((file: any) => file.split(".")[0]); // Eliminar la extensión del archivo
  });

  // Nota: no poner un refreshResults aqui si no quieres petar
  const isMediaDraggable = (id: number) => {
    return !downloadedMediaNames.value.includes(`${id}[${downloadSize.value}]`);
  };
  return {
    downloadedMediaNames,
    isMediaDraggable,
  };
}
