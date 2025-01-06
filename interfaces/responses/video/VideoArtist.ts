export interface Artist {
  name: string;
  imagePath: string;
  slug: string;
  totalFollowers: number;
}

export interface Video {
  id: string;
  name: string;
  slug: string;
  imagePath: string;
  artists: Artist[];
}

export interface VideoArtist {
  results: Video[];
  adsSearch: any;
}
