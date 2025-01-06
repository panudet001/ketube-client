import type {
  PlaylistMusicItem,
  Result,
} from "~/interfaces/responses/search/Result";
import type { AdsSearch } from "~/interfaces/responses/search/AdsSearch";

// /search?q="สลักจิต"  สลับ Search ทุกอย่าง

export interface Search {
  results: Result[];
  adsSearch: AdsSearch;
}

export interface SearchType {
  musics: PlaylistMusicItem[];
  artists: Result[];
  playlists: Result[];
  albums: Result[];
}

export interface SearchAll {
  videos: PlaylistMusicItem[];
  artists: Result[];
  playlists: Result[];
  albums: Result[];
}
