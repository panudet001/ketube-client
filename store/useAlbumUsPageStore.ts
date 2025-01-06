import type { KetubeError } from "~/interfaces/KetubeError";
import { albumPageService } from "~/services/page/albumPageService";
import type { Album } from "~/interfaces/responses/pages/album/Album";
import type { RecommendedAlbums } from "~/interfaces/responses/pages/album/RecommendedAlbum";
import type { Item as PlaylistMusicItem } from "~/components/playlist/PlaylistMusic.vue";
import { environment } from "~/services/environments";
import { formatTime } from "~/utils/formatTime";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";

interface State {
  albumData: Album | null;
  videos: PlaylistMusicItem[];
  recommendedAlbums: RecommendedAlbums[] | null;
  error: KetubeError | null;
  isLoading: boolean;
  adsAboveFooter: AdsFooter | null;
}

export const useAlbumPageStore = defineStore("useAlbumPageStore", {
  state: (): State => {
    return {
      albumData: null,
      videos: [],
      recommendedAlbums: [],
      error: null,
      isLoading: false,
      adsAboveFooter: null,
    };
  },
  actions: {
    async getBySlug(slug: string) {
      this.isLoading = true;
      await albumPageService
        .getBySlug(slug)
        .then((value) => {
          if (value.adsAboveFooter != null) {
            this.adsAboveFooter = {
              id: value.adsAboveFooter.id,
              url: value.adsAboveFooter.url,
              imageDesktopPath: `${environment.urlApiImg}/${value.adsAboveFooter.imageDesktopPath}`,
              imageMobilePath: `${environment.urlApiImg}/${value.adsAboveFooter.imageMobilePath}`,
            } as AdsFooter;
          }

          this.videos = value.videos.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              link: `/karaoke?v=${value.slug}`,
              name: value.name,
              artist: value.artists.map((value) => `${value.name}`).join(),
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              album: "-",
              duration: formatTime(value.duration),
            } as PlaylistMusicItem;
          });

          this.recommendedAlbums = value.recommendedAlbums.map((value) => {
            return {
              link: `/album/${value.slug}`,
              name: value.name,
              slug: value.slug,
              imagePath: `${environment.urlApiImg}/${value.imagePath}`,
              description: value.description,
            } as RecommendedAlbums;
          });

          this.albumData = value;
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
