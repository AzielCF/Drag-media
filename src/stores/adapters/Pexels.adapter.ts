import type {
  User,
  SearchResponse,
  ItemTransformed
} from "./types/TypeAdapters.d";

export function transformSearch<T>(data: SearchResponse<T>): SearchResponse<T> {
  const { total_results, page, per_page, next_page, url, ...rest } = data;
  return {
    total_results: total_results,
    page: page,
    per_page: per_page,
    next_page: next_page,
    url: url,
    ...rest,
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
  return item as ItemTransformed;
}

export function transformPhoto(item: any): Object {
  return {
    id: item.id,
    width: item.width,
    height: item.height,
    photographer: item.photographer,
    photographer_url: item.photographer_url,
    src: { ...item.src },
    alt: item.alt,
  }
}

export function transformVideo(item: any): Object {
  return {
    id: item.id,
    width: item.width,
    height: item.height,
    image: item.image,
    user: transformUser(item.user),
    video_files: (item.video_files || []).map(transformVideoFile),
    video_pictures: (item.video_pictures || []).map(transformVideoPicture),
  }
}

function transformUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    url: user.url,
  }
}

function transformVideoFile(videoFile: any): Object {
  return {
    id: videoFile.id,
    quality: videoFile.quality,
    width: videoFile.width,
    height: videoFile.height,
    link: videoFile.link,
  }
}

function transformVideoPicture(videoPicture: any): Object {
  return {
    id: videoPicture.id,
    picture: videoPicture.picture,
  }
}
