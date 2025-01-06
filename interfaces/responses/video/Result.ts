import type { Artist } from "~/interfaces/responses/video/Artist";

export interface Result {
  id: string;
  slug: string;
  name: string;
  imagePath: string;
  artists: Artist[];
}
