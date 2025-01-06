import type { Group } from "~/interfaces/responses/pages/artists/Group";
import type { Style } from "~/interfaces/responses/pages/artists/Style";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";

export interface Artists {
  styles: Style[];
  groups: Group[];
  adsAboveFooter: AdsFooter;
}
