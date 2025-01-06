import type { Artist } from "~/interfaces/responses/pages/playlist/Artist";
import type { Album } from "~/interfaces/responses/pages/album/Album";

export interface Result {
  slug: string;
  name: string;
  imagePath: string;
  type: "video" | "album" | "playlist" | "artist" | "ads";
  artists?: Artist[];
  artistLink?: string;
  description?: string;
  partnerName?: string;
  artist?: Artist;
  id?: string;
}

export interface Partner {
  id: string;
  name: string;
  imagePath: string;
}

export interface PlaylistMusicItem {
  id?: string;
  link: string;
  name: string;
  imagePath?: string;
  artist?: string;
  album?: string;
  albums?: Album;
  albumSlug?: string;
  imageURL: string;
  duration?: string;
  slug?: string;
  artistSlug?: string;
  partnerName?: string;
  partnerImage?: string;
  artists?: Artist[];
  videoSlug: string;
  partner?: Partner;
}
