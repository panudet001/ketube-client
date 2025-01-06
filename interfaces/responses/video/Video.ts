import type { Artist } from "~/interfaces/responses/video/Artist";
import type { Album } from "~/interfaces/responses/video/Album";

export interface Ads {
  id?: string;
  name?: string;
  videoPath?: string;
  adsImages?: string;
  url?: string;
}

export interface Partner {
  id: string;
  name: string;
  imagePath: string;
}

export interface Video {
  id?: string;
  ads?: Ads;
  videosByArtist: Video[];
  name?: string;
  slug?: string;
  description?: string;
  view?: number;
  imagePath?: string;
  image?: string;
  artists?: Artist[];
  album: Album;
  dateAdded?: Date;
  duration?: number;
  partnerImg: string;
  partnerName: string;
  vocal?: string;
  music?: string;
  video?: string;
  partner?: Partner;
}
