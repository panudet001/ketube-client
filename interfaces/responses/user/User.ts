export interface User {
  name: string;
  gender: string;
  dateOfBirth: string;
  profileImage?: File;
}

export interface UserFavorites {
  videos: string[];
  artists: string[];
  playlists: string[];
}
