import type { Artist } from "~/interfaces/responses/pages/playlist/Artist";
import type { Album } from "~/interfaces/responses/pages/playlist/Album";

export interface Video {
  id?: string;
  name: string;
  slug: string;
  imagePath: string;
  duration: number;
  artists: Artist[];
  album: Album;
  partnerName: string;
  partnerImage: string;
}

export interface Recent {
  videos: Video[];
}
