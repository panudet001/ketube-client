import type { Album } from "~/interfaces/responses/pages/artist/Album";
import type { Artist } from "~/interfaces/responses/pages/artist/Artist";

export interface Video {
  id?: string;
  slug: string;
  name: string;
  imagePath: string;
  duration: number;
  artists: Artist[];
  album: Album;
  partnerName: string;
  partnerImage: string;
}
