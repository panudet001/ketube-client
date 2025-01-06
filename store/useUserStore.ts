import type { KetubeError } from "~/interfaces/KetubeError";
import type { User } from "~/interfaces/responses/user/User";
import type { Result } from "~/interfaces/responses/user/Result";
import { userService } from "~/services/userService";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";

interface State {
  user: Result | User | null;
  error: KetubeError | null;
  isLoading: boolean;
  isShowFavorite: boolean;
  playlists: string[];
  videos: string[];
}

export const useUserStore = defineStore("useUserStore", {
  state: (): State => {
    return {
      user: null,
      error: null,
      isLoading: false,
      isShowFavorite: false,
      playlists: [],
      videos: [],
    };
  },
  actions: {
    async get() {
      const isAuthenticated = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
      if (isAuthenticated.value) {
        this.isLoading = true;
        await userService
          .get()
          .then((value) => {
            this.user = value;
            this.user = {
              id: value.id,
              name: value.name,
              email: value.email,
              image: value.image,
              gender: value.gender,
              dateOfBirth: value.dateOfBirth,
              isPartner: value.isPartner,
              partnerName: value.partnerName,
              partnerImage: value.partnerImagePath,
            } as Result;
            this.error = null;
          })
          .catch((reason) => {
            this.error = reason;
            if (reason.exception === "UNAUTHORIZED") {
              const token = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
              token.value = null;
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    async updateProfile(formUser: User) {
      this.isLoading = true;
      await userService
        .updateProfile(formUser)
        .then((value) => {
          this.user = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getFavorites() {
      this.isShowFavorite = false;
      const isAuthenticated = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
      const cookiePlaylists = useCookie(
        ketubeCookieCode.COOKIES_FAVORITE_PLAYLIST,
      );
      const cookieVideos = useCookie(ketubeCookieCode.COOKIES_VIDEO_PLAYLIST);
      if (isAuthenticated.value) {
        this.isLoading = true;
        this.isShowFavorite = true;
        await userService
          .getFavorites()
          .then((value) => {
            this.playlists = value.playlists;
            this.videos = value.videos;
            cookiePlaylists.value = JSON.stringify(value.playlists);
            cookieVideos.value = JSON.stringify(value.videos);
            this.error = null;
          })
          .catch((reason) => {
            this.error = reason;
            if (reason.exception === "UNAUTHORIZED") {
              const token = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
              token.value = null;
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },

    getFavoritesCookie() {
      const cookiePlaylists = useCookie(
        ketubeCookieCode.COOKIES_FAVORITE_PLAYLIST,
      );
      const cookieVideos = useCookie(ketubeCookieCode.COOKIES_VIDEO_PLAYLIST);

      if (cookiePlaylists.value) {
        this.playlists = cookiePlaylists.value;
        this.videos = cookieVideos.value;
      } else {
        this.getFavorites();
      }
    },

    addFavorites(type: string, val: string) {
      const cookiePlaylists = useCookie(
        ketubeCookieCode.COOKIES_FAVORITE_PLAYLIST,
      );
      const cookieVideos = useCookie(ketubeCookieCode.COOKIES_VIDEO_PLAYLIST);

      if (type === "playlists") {
        this.playlists.push(val);
        cookiePlaylists.value = JSON.stringify(this.playlists);
      }
      if (type === "videos") {
        this.videos.push(val);
        cookieVideos.value = JSON.stringify(this.videos);
      }
    },

    delFavorites(type: string, index: number) {
      const cookiePlaylists = useCookie(
        ketubeCookieCode.COOKIES_FAVORITE_PLAYLIST,
      );
      const cookieVideos = useCookie(ketubeCookieCode.COOKIES_VIDEO_PLAYLIST);

      if (type === "playlists") {
        this.playlists.splice(index, 1);
        cookiePlaylists.value = JSON.stringify(this.playlists);
      }
      if (type === "videos") {
        this.videos.splice(index, 1);
        cookieVideos.value = JSON.stringify(this.videos);
      }
    },
  },
});
