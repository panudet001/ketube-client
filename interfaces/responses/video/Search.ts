import type { Result } from "~/interfaces/responses/video/Result";
import type { AdsSearch } from "~/interfaces/responses/search/AdsSearch";

export interface Search {
  results: Result[];
  adsSearch: AdsSearch;
}
