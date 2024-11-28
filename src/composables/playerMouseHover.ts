import { ref } from "vue";

interface MediaItem {
  id: number;
  quality: string;
  link: URL;
}

interface VideoTS {
  id: number;
  video_files: MediaItem[];
  previewLink?: URL | undefined;
}

const videoRefs = ref(new Map<number, HTMLVideoElement>());
const hoverDelay = 1000; // Tiempo en milisegundos antes de comenzar a cargar el video
let hoverTimeout: NodeJS.Timeout | null;

const VIDEO_QUALITY_SD = "sd";
const VIDEO_CONTAINER_PREFIX = "video-container-";
const VIDEO_CLASS = "z-30 w-full";

const createVideoElement = (video: VideoTS, selectVideoQuality: Function) => {
  video.previewLink = selectVideoQuality(video.id, video, VIDEO_QUALITY_SD);

  if (!video.previewLink || videoRefs.value.has(video.id)) {
    return;
  }

  const videoElement = createVideoDOMElement(video);
  appendVideoElementToDOM(videoElement, video.id);
};

const createVideoDOMElement = (video: VideoTS) => {
  const videoElement = document.createElement("video");
  videoElement.controls = false;
  videoElement.preload = "auto";
  videoElement.autoplay = true;
  videoElement.className = VIDEO_CLASS;
  videoElement.muted = true;
  videoElement.playsInline = true;

  videoElement.addEventListener("error", (e) => handleVideoError(video.id, e));
  videoElement.addEventListener("ended", () => loopVideo(video));
  videoElement.addEventListener("loadeddata", () =>
    handleVideoLoadedData(video, videoElement)
  );

  if (video.previewLink) {
    videoElement.src = convertUrl(video.previewLink);
  }

  return videoElement;
};

const appendVideoElementToDOM = (
  videoElement: HTMLVideoElement,
  videoId: number
) => {
  const videoElementContainer = document.getElementById(
    `${VIDEO_CONTAINER_PREFIX}${videoId}`
  );
  if (videoElementContainer) {
    videoElementContainer.appendChild(videoElement);
  } else {
    console.error("No se encontró el contenedor del elemento de video");
  }

  console.log(`Video ${videoId} is ready to play`);
  if (videoElement.paused) {
    videoElement.play();
  }
};

const handleVideoError = (videoId: number, error: Event) => {
  console.error(`Error loading video with ID ${videoId}:`, error);
};

const handleVideoLoadedData = (
  video: VideoTS,
  videoElement: HTMLVideoElement
) => {
  videoRefs.value.set(video.id, videoElement);
};

const pauseVideo = (video: VideoTS) => {
  const videoElement = videoRefs.value.get(video.id);
  if (videoElement) {
    if (videoElement.readyState > 2) {
      console.log("Pausing video " + video.id);
      videoElement.pause();
    } else {
      console.log("Video " + video.id + " is not ready to be paused");
    }
  }
};

const loopVideo = (video: VideoTS) => {
  const videoElement = videoRefs.value.get(video.id);
  if (videoElement) {
    if (videoElement.readyState > 2) {
      console.log("Looping video " + video.id);
      videoElement.currentTime = 0;
      videoElement.play();
    } else {
      console.log("Video " + video.id + " is not ready to be looped");
    }
  }
};

// Caso particular donde recibimos la funcion selectVideoQuality como argumento, para usarla en createVideoElement
const handleMouseEnterToVideoPrev = (video: VideoTS, selectVideoQuality: Function) => {
  const videoElement = videoRefs.value.get(video.id);
  if (!videoElement) {
    hoverTimeout = setTimeout(() => {
      createVideoElement(video, selectVideoQuality);
    }, hoverDelay);
  } else {
    if (videoElement.readyState > 2 && videoElement.paused) {
      console.log("Reproduciendo video " + video.id);
      videoElement.play();
    }
  }
};

const handleMouseLeaveToVideoPrev = (video: VideoTS) => {
  if (hoverTimeout !== null) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  pauseVideo(video);
};

const convertUrl = (url: URL) => {
  let urlObj = new URL(url);

  // Cambia los parámetros de la URL
  urlObj.searchParams.set("fit", "");
  urlObj.searchParams.delete("h");
  urlObj.searchParams.set("w", "600");
  urlObj.searchParams.set("dpr", "1");

  return urlObj.toString();
};

export { handleMouseEnterToVideoPrev, handleMouseLeaveToVideoPrev, convertUrl };
