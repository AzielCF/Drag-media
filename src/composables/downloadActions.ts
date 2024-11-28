import { Ref } from "vue";

export function useDownloadActions(
  directoryStorage: string | null,
  downloadSize: Ref<string>,
  mediaType: string
) {
  const fileExtension = mediaType === "photos" ? ".png" : ".mp4";
  const fileType = mediaType === "photos" ? "img" : "video";

  const handleDragStart = (
    event: Event,
    fileURL: URL | undefined,
    fileID: number
  ) => {
    event.preventDefault();
    const fileName = `${fileID}[${downloadSize.value}]`;
    window.electron.startDrag(
      fileURL,
      fileName,
      fileExtension,
      fileType,
      directoryStorage
    );
  };

  const startDownloadFile = (fileURL: URL | undefined, fileID: number) => {
    const fileName = `${fileID}[${downloadSize.value}]`;
    window.electron.downloadFile(
      fileURL,
      fileID,
      fileName,
      fileExtension,
      fileType,
      directoryStorage
    );
  };

  window.addEventListener("fileDownloaded", (event: any) => {
    const fileName = event.detail.fileName;
    const filePath = event.detail.filePath;
    refreshResults();
    console.log(`Archivo descargado: ${fileName}\nRuta: ${filePath}`);
  });

  const refreshResults = () => {
    window.electron.getDirectoryLocalStorage(directoryStorage);
  };

  return {
    handleDragStart,
    startDownloadFile,
    refreshResults,
  };
}
