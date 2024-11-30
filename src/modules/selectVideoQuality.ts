import { Ref, computed } from "vue";

export interface Video {
  id: number;
  height: number;
  width: number;
  video_files: Array<VideoFile>;
}

interface VideoFile {
  height: number;
  width: number;
  quality: string;
  link: URL;
}

// Este script llamado por mediaSearch clasifica las calidades de vídeo de SD a 4k segun dimensiones.
// Se a configurado que si selectVideoQuality tiene argumentos necesarios pueda funcionar sin parametros de useSelectVideoQuality
// Aún así se recomienda usar solo desde useSelectVideoQuality

export function useSelectVideoQuality(
  mediaItemsMain: Ref<Array<Video>>,
  downloadSizeMain: Ref<string>
) {
  const selectVideoQuality = (
    videoId: number,
    objUnic?: Ref<Array<Video>>,
    downloadQuality?: string
  ): URL | undefined => {
    if (typeof videoId !== "number") {
      throw new Error(
        'El argumento "videoId" debe ser un número.'
      );
    }
    const objItems: Ref = objUnic?.value ? objUnic : mediaItemsMain;

    const videoObj = objItems.value.find(
      (video: Video) => video.id === videoId
    );

    if (videoObj && videoObj.video_files) {
      const videoUrl = findVideoUrl(videoObj, downloadQuality);
      return videoUrl;
    }
  };

  const findVideoUrl = (
    videoObj: Video,
    downloadQuality?: string
  ): URL | undefined => {
    const downloadSelect: string = downloadQuality
      ? downloadQuality
      : downloadSizeMain.value;

    const isVertical = videoObj.height > videoObj.width;
    const qualityOrder = ["4kQhd", "qHd", "fullHd", "hd", "sd"];
    const desiredQualityIndex = qualityOrder.indexOf(downloadSelect);

    for (let i = desiredQualityIndex; i < qualityOrder.length; i++) {
      const quality = qualityOrder[i];
      const videoFile = findVideoFile(
        videoObj.video_files,
        isVertical,
        quality
      );
      if (videoFile) {
        return videoFile.link;
      }
    }

    return undefined;
  };

  const findVideoFile = (
    videoFiles: Array<VideoFile>,
    isVertical: boolean,
    quality: string
  ): VideoFile | undefined => {
    if (typeof quality !== "string") {
      throw new Error(
        'El argumento "quality" debe ser una cadena de texto.'
      );
    }
    return videoFiles.find((videoFile) => {
      if (isVertical) {
        return videoFile.height >= 960 && videoFile.quality === quality;
      } else {
        const width = videoFile.width;

        if (width >= 3840) return quality === "4kQhd";
        if (width >= 2560) return quality === "qHd";
        if (width >= 1920) return quality === "fullHd";
        if (width >= 1280) return quality === "hd";
        if (width >= 960) return quality === "sd";

        return false;
      }
    });
  };

  const filterMediaByQuality = computed(() => {
    const objItems: Array<Video> = mediaItemsMain.value;
    const downloadSelect: string = downloadSizeMain.value;
  
    return objItems.filter((videoObj: Video) => {
      if (videoObj.video_files) {
        const isVertical = videoObj.height > videoObj.width;
        const videoFile = findVideoFile(videoObj.video_files, isVertical, downloadSelect);
        return !!videoFile; // Mantener solo los videos que cumplen con la calidad.
      }
      return false;
    });
  });
  
  return {
    selectVideoQuality,
    findVideoUrl,
    findVideoFile,
    filterMediaByQuality
  };
}
