import type { Artist } from "~/interfaces/responses/pages/home/Artist";

export interface Video {
  id?: string;
  slug: string;
  name: string;
  imagePath: string;
  artists: Artist[];
  partnerName: string;
  partnerImage: string;
}
