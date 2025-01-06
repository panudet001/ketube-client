import type { KetubeError } from "~/interfaces/KetubeError";
import { playlistPageService } from "~/services/page/playlistPageService";
import type { Item as PlaylistMusicItem } from "~/components/playlist/PlaylistMusic.vue";
import { environment } from "~/services/environments";
import { formatTime } from "~/utils/formatTime";
import type { Item as SquareCardItem } from "~/components/card/SquareCard.vue";
import type { Playlist } from "~/interfaces/responses/pages/playlist/Playlist";
import type { AdsFooter } from "~/interfaces/responses/pages/playlist/AdsFooter";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";
import type { Item as SquareCarouselItem } from "~/components/carousel/SquareCarousel.vue";

interface State {
  playlistData: Playlist | null;
  recommendedPlaylists: SquareCarouselItem[] | [];
  videoPlaylist: PlaylistMusicItem[] | [];
  playlistItemList: SquareCardItem[] | [];
  error: KetubeError | null;
  isLoading: boolean;
  adsAboveFooter: AdsFooter | null;
  idAdsRecommend: string;
  playlistFavorite: SquareCardItem[] | [];
  isFilterFavorite: boolean;
  isShowFavorite: boolean;
}

export const usePlaylistPageStore = defineStore("usePlaylistPageStore", {
  state: (): State => {
    return {
      playlistData: null,
      recommendedPlaylists: [],
      videoPlaylist: [],
      playlistItemList: [],
      error: null,
      isLoading: false,
      adsAboveFooter: null,
      idAdsRecommend: "",
      playlistFavorite: [],
      isFilterFavorite: false,
      isShowFavorite: false,
    };
  },
  actions: {
    async getBySlug(slug: string) {
      this.isLoading = true;
      await playlistPageService
        .getBySlug(slug)
        .then((value) => {
          this.playlistData = value;

          this.recommendedPlaylists = value.recommendedPlaylists.map(
            (value) => {
              return {
                id: value.id,
                link: `/playlist/${value.slug}`,
                title: value.name,
                imageURL: `${environment.urlApiImg}/${value.imagePath}`,
                imageName: value.name,
                description: value.description,
              } as SquareCarouselItem;
            },
          );

          if (value.adsRight) {
            const adsRight = {
              link: value.adsRight.url,
              title: value.adsRight.name,
              imageURL: `${environment.urlApiImg}/${value.adsRight.imageDesktopPath}`,
              imageName: value.adsRight.name,
              description: value.adsRight.name,
              ads: true,
            } as SquareCarouselItem;

            this.recommendedPlaylists = [
              ...this.recommendedPlaylists,
              adsRight,
            ];
          }

          if (value.adsAboveFooter != null) {
            this.idAdsRecommend = value.adsRight.id;
            this.adsAboveFooter = {
              id: value.adsAboveFooter.id,
              url: value.adsAboveFooter.url,
              imageDesktopPath: `${environment.urlApiImg}/${value.adsAboveFooter.imageDesktopPath}`,
              imageMobilePath: `${environment.urlApiImg}/${value.adsAboveFooter.imageMobilePath}`,
            } as AdsFooter;
          }

          this.videoPlaylist = value.videos.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              link: `/karaoke?v=${value.slug}`,
              name: value.name,
              artist: value.artists.map((value) => `${value.name}`).join(),
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              album: value.album?.name ?? "-",
              albumSlug: value.album?.slug ?? null,
              duration: formatTime(value.duration),
              artistSlug: value.artists.map((value) => `${value.slug}`).join(),
              artists: value.artists,
              partnerName: value.partnerName,
              partnerImage: value.partnerImage
                ? `${environment.urlApiImg}/${value.partnerImage}`
                : `${environment.urlBaseApp}/profile.jpeg`,
            } as PlaylistMusicItem;
          });

          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async getAll(
      page: number = 0,
      size: number = 15,
      sort: string = "updatedAt",
      order: string = "desc",
    ) {
      this.isLoading = true;
      await playlistPageService
        .getAll(page, size, sort, order)
        .then((value) => {
          if (value.adsAboveFooter != null) {
            this.adsAboveFooter = {
              id: value.adsAboveFooter.id,
              url: value.adsAboveFooter.url,
              imageDesktopPath: `${environment.urlApiImg}/${value.adsAboveFooter.imageDesktopPath}`,
              imageMobilePath: `${environment.urlApiImg}/${value.adsAboveFooter.imageMobilePath}`,
            } as AdsFooter;
          }

          this.playlistItemList = value.playlists.map((value) => {
            return {
              title: value.name,
              description: value.description,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
              link: `/playlist/${value.slug}`,
              id: value.id,
            } as SquareCardItem;
          });

          this.isLoading = false;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async getPlaylistFavorite() {
      this.isShowFavorite = false;
      const isAuthenticated = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
      if (isAuthenticated.value) {
        this.isShowFavorite = true;
        await playlistPageService.getFavorite().then((value) => {
          this.playlistFavorite = value.map((value) => {
            this.isLoading = true;
            return {
              id: value.id,
              title: value.name,
              description: value.description,
              imageURL: `${environment.urlApiImg}/${value.image}`,
              imageName: value.name,
              link: `/playlist/${value.slug}`,
            } as SquareCardItem;
          });
        });
      }
    },

    async addFavorite(val: string) {
      this.isLoading = true;
      await playlistPageService
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
      await playlistPageService
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
