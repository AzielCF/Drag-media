export interface User {
  id: number;
  name: string;
  url: URL;
}

export interface Photo {
  id: number;
  width: number;
  height?: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original?: string;
    large2x?: string;
    large?: string;
    medium?: string;
    small?: string;
    portrait?: string;
    landscape?: string;
    tiny?: string;
  };
  liked: boolean;
  alt: string;
}

export interface Video {
  id: number;
  width: number;
  height: number;
  url: URL;
  image: string;
  tags: string[];
  duration: number;
  user: User;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

export interface VideoFile {
  id: number;
  quality: string;
  fileType: string;
  width: number;
  height: number;
  fps: number;
  link: URL;
}

export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface SearchResponse<T> {
  total_results: number;
  page: number;
  per_page: number;
  photos?: T[];
  videos?: T[];
  next_page?: string;
  url?: URL
}


export interface PhotoTransformed extends Omit<Photo, "src"> {
  src: { [key: string]: string };
}

export interface VideoTransformed
  extends Omit<Video, "tags" | "user" | "video_files" | "video_pictures"> {
  tags: string[];
  user: User;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

export type ItemTransformed = PhotoTransformed | VideoTransformed;
