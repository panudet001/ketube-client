import type { Artist } from "~/interfaces/responses/pages/playlist/Artist";

export interface Video {
  id?: string;
  slug: string;
  name: string;
  imagePath: string;
  duration: number;
  artists: Artist[];
}
