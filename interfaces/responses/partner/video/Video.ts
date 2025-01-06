import type { Artist } from "~/interfaces/responses/partner/video/Artist";
import type { Style } from "~/interfaces/responses/partner/video/Style";
import type { createBy } from "~/interfaces/responses/partner/video/CreateBy";
import type { ViewerStats } from "~/interfaces/responses/partner/video/Stats";

export interface Video {
  id: string;
  name: string;
  slug: string;
  description: string;
  view: number;
  duration: string;
  lyrics: string;
  status: string;
  video: string;
  image: string;
  releasedAt: string;
  publishedAt: string;
  expiredAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  styles: Style[];
  artists: Artist[];
  createdBy: createBy;
  updatedBy: createBy;
  viewerStats: ViewerStats[];
}

export interface Pagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}

export interface VideoPagination {
  totalVideos: number;
  startDate: string;
  totalView: string;
  videos: Video[];
  pagination: Pagination;
}

export interface VideoViewerStats {
  view: number;
  date: string;
}
