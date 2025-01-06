import type { Pagination } from "~/interfaces/Pagination";
import type { Video } from "~/interfaces/responses/partner/playlist/Video";

export interface Playlist {
  id: string;
  name: string;
  slug: string;
  image: string;
  coverPage: string;
  codeColor: string;
  units: number;
  view: number;
  isActive: boolean;
  releasedAt: string;
  publishedAt: string;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
  videos: Video[];
}

export interface PlaylistPagination {
  totalPlaylists: number;
  startDate: string;
  totalView: string;
  playlists: Playlist[];
  pagination: Pagination;
}

export interface PlaylistViewerStats {
  view: number;
}
