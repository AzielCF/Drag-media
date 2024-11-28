
export function transformSearch<T>(data: any): any {
  const { total, page, per_page, next_page, url, hits } = data;
  return {
    total_results: total,
    page: page,
    per_page: per_page,
    next_page: next_page,
    url: url,
    videos: hits,
    photos: hits
  };
}

export function transformItem(
  item: any,
  endPoint: string
): Object {
  if (endPoint === "photos") {
    return transformPhoto(item);
  } else if (endPoint === "videos") {
    return transformVideo(item);
  }
  // Si endPoint no coincide con "photos" ni "videos", devolver el mismo item sin transformación
  return item;
}

export function transformPhoto(item: any): Object {
  return {
    id: item.id,
    width: item.imageWidth,
    height: item.imageHeight,
    photographer: item.user,
    photographer_url: item.pageURL,
    src: {small: item.previewURL, medium: item.webformatURL, large: item.largeImageURL},
    alt: item.tags,
  }
}

export function transformVideo(item: any): Object {
  const videoFiles = Object.values(item.videos || []).map(transformVideoFile)
  return {
    id: item.id,
    width: videoFiles[1].width,
    height: videoFiles[1].height,
    image: Object.values(item.videos || []).map(transformVideoPicture)[3].picture,
    user: item.user,
    video_files: videoFiles,
  }
}

function transformVideoFile(videoFile: any){
  return {
    id: videoFile.id,
    quality: videoFile.quality,
    width: videoFile.width,
    height: videoFile.height,
    link: videoFile.url,
  }
}

function transformVideoPicture(videoPicture: any) {
  return {
    id: videoPicture.id,
    picture: videoPicture.thumbnail,
  }
}
