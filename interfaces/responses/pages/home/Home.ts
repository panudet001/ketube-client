import type { Banner } from "~/interfaces/responses/pages/home/Banner";
import type { Artist } from "~/interfaces/responses/pages/home/Artist";
import type { Video } from "~/interfaces/responses/pages/home/Video";
import type { Playlist } from "~/interfaces/responses/pages/home/Playlist";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";

export interface Home {
  banners: Banner[];
  artists: Artist[];
  videoNewReleases: Video[];
  recommendedVideos: Video[];
  recommendedPlaylists: Playlist[];
  adsAboveFooter: AdsFooter;
  adsBanner: AdsFooter;
  adsBetweenVideo: AdsFooter;
  recents: Video[];
}
