import type { Artist } from "~/interfaces/responses/pages/playlist/Artist";
import type { Video } from "~/interfaces/responses/pages/playlist/Video";
import type { RecommendedPlaylist } from "~/interfaces/responses/pages/playlist/RecommendedPlaylist";
import type { AdsFooter } from "~/interfaces/responses/pages/playlist/AdsFooter";

export interface Playlist {
  id?: string;
  name: string;
  slug: string;
  nameColor: string;
  imagePath: string;
  image: string;
  imageCoverPath: string;
  artists: Artist[];
  videos: Video[];
  recommendedPlaylists: RecommendedPlaylist[];
  adsAboveFooter: AdsFooter;
  adsRight: AdsFooter;
  description: string;
}
