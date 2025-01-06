import type { RecommendedAlbums } from "./RecommendedAlbum";
import type { Video } from "~/interfaces/responses/pages/album/Video";
import type { Artist } from "~/interfaces/responses/pages/album/Artist";
import type { AdsFooter } from "~/interfaces/responses/pages/album/AdsFooter";

export interface Album {
  name: string;
  nameColor: string;
  imagePath: string;
  imageCoverPath: string;
  artist: Artist;
  videos: Video[];
  recommendedAlbums: RecommendedAlbums[];
  adsAboveFooter: AdsFooter;
  description: string;
  slug: string;
}
