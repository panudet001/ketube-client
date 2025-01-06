import type { Artist } from "~/interfaces/responses/pages/explore/Artist";
import type { Video } from "~/interfaces/responses/pages/explore/Video";
import type { Playlist } from "~/interfaces/responses/pages/explore/Playlist";
import type { Style } from "~/interfaces/responses/pages/explore/Style";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";

export interface Explore {
  artists: Artist[];
  videoNewReleases: Video[];
  recommendedVideos: Video[];
  recommendedPlaylists: Playlist[];
  style: Style[];
  adsBetweenVideo: AdsFooter;
}
