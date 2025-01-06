import type { KetubeError } from "~/interfaces/KetubeError";
import { videoService } from "~/services/videoService";
import { environment } from "~/services/environments";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";
import type { PlaylistMusicItem } from "~/interfaces/responses/search/Result";
export interface Item {
  id: string;
  title: string;
  description: string;
  slug: string;
  imageURL: string;
  ads: boolean;
}

interface State {
  searchResult: Item[] | [];
  error: KetubeError | null;
  isLoading: boolean;
  idAdsSearch: string;
  videoFavorite: PlaylistMusicItem[] | [];
}

export const useVideoStore = defineStore("useVideoStore", {
  state: (): State => {
    return {
      searchResult: [],
      error: null,
      isLoading: false,
      idAdsSearch: "",
      videoFavorite: [],
    };
  },
  actions: {
    async get(q: string) {
      this.isLoading = true;
      await videoService
        .search(q)
        .then((value) => {
          this.searchResult = value.results.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              title: value.name,
              description: value.artists.map((value) => `${value.name}`).join(),
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              ads: false,
            } as Item;
          });

          if (value.adsSearch !== null) {
            this.idAdsSearch = value.adsSearch.id;
            const adsSearch = {
              slug: value.adsSearch.url,
              title: value.adsSearch.name,
              description: value.adsSearch.name,
              imageURL: `${environment.urlApiImg}/${value.adsSearch.imageDesktopPath}`,
              ads: true,
            } as Item;
            this.searchResult = [adsSearch, ...this.searchResult];
          }

          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async getFavorite() {
      const isAuthenticated = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
      if (isAuthenticated.value) {
        this.isLoading = true;
        await videoService
          .getFavorite()
          .then((value) => {
            this.videoFavorite = value.map((value) => {
              return {
                id: value.id,
                slug: value.slug,
                link: `/karaoke?v=${value.slug}`,
                name: value.name,
                imageURL: `${environment.urlApiImg}/${value.image}`,
                artists: value.artists,
                album: value.album?.name ?? "-",
                albumSlug: value.album?.slug ?? null,
                duration: value.duration ? formatTime(value.duration) : "-",
                partnerName: value.partner?.name,
                partnerImage: value.partner?.imagePath
                  ? `${environment.urlApiImg}/${value.partner?.imagePath}`
                  : `${environment.urlBaseApp}/profile.jpeg`,
              } as PlaylistMusicItem;
            });
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

    async addFavorite(val: string) {
      this.isLoading = true;
      await videoService
        .saveFavorite(val)
        .then(() => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async delFavorite(val: string) {
      this.isLoading = true;
      await videoService
        .deleteFavorite(val)
        .then(() => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
