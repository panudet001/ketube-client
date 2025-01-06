import type { Video } from "~/interfaces/responses/pages/artist/Video";
import type { Playlist } from "~/interfaces/responses/pages/artist/Playlist";
import type { Album } from "~/interfaces/responses/pages/artist/Album";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";

interface ArtistRelation {
  slug: string;
  name: string;
  imagePath: string;
}

export interface Artist {
  name: string;
  nameColor: string;
  imagePath: string;
  imageCoverPath: string;
  videos: Video[];
  recommendedPlaylists: Playlist[];
  similarArtists: ArtistRelation[];
  featuringArtists: ArtistRelation[];
  newReleaseVideo: Video[];
  description: string;
  albums: Album[];
  adsAboveFooter: AdsFooter;
}
