import type { Pagination } from "~/interfaces/Pagination";
import type { Artist } from "~/interfaces/responses/partner/album/Artist";
import type { Video } from "~/interfaces/responses/partner/album/Video";
import type { Styles } from "~/interfaces/responses/partner/album/Styles";

export interface Album {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  artist: Artist;
  styles: Styles[];
  isActive: boolean;
  releasedAt: string;
  publishedAt: string;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
  albumCover: string;
  videos: Video[];
}

export interface AlbumPagination {
  totalAlbums: number;
  startDate: string;
  totalView: string;
  albums: Album[];
  pagination: Pagination;
}

export interface AlbumViewerStats {
  view: number;
}
