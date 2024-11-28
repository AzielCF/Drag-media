import type {
  ItemTransformed
} from "./types/TypeAdapters.d";

export function transformSearch<T>(data: any): any {
  const { total, page, per_page, next_page, url, results } = data;
  return {
    total_results: total,
    page: page,
    per_page: per_page,
    next_page: next_page,
    url: url,
    photos: results
  };
}

export function transformItem(
  item: any,
  endPoint: string
): Object {
  if (endPoint === "photos") {
    return transformPhoto(item);
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
    src: transformQualityPicture(item.urls),
    alt: item.alt_description,
  }
}

function transformQualityPicture(urls: any): Object {
  return {
    small: urls.thumb,
    medium: urls.small,
    large: urls.regular,
    original: urls.full
  }
}
