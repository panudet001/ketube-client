import type { Pagination } from "~/interfaces/Pagination";
import type { Video } from "~/interfaces/responses/partner/video/Video";

export interface Option {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface OptionArtist {
  pagination: Pagination;
  videos: Video[];
}
