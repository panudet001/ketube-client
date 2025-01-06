import type { AdsFooter } from "./AdsFooter";
import type { Video } from "~/interfaces/responses/pages/karaoke/Video";
import type { Room } from "~/interfaces/responses/pages/karaoke/Room";

export interface Karaoke {
  recommendedVideos: Video[];
  adsAboveFooter: AdsFooter;
  videosByArtis: Video[];
  room: Room;
}
