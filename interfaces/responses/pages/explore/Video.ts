import type { Artist } from "~/shared/types/video.type";

export interface Video {
  slug: string;
  name: string;
  imagePath: string;
  artists: Artist[];
}
