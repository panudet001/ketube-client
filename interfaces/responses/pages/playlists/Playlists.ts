import type { Playlist } from "~/interfaces/responses/pages/home/Playlist";
import type { AdsFooter } from "~/interfaces/responses/pages/playlist/AdsFooter";

export interface Playlists {
  playlists: Playlist[];
  adsAboveFooter: AdsFooter;
}
