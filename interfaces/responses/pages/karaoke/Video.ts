import type { Artist } from "~/interfaces/responses/pages/home/Artist";
import type { Album } from "~/interfaces/responses/video/Album";

export interface Video {
  id: string;
  slug: string;
  name: string;
  imagePath: string;
  view: number;
  artists: Artist[];
  album: Album;
}
