import type { KetubeError } from "~/interfaces/KetubeError";
import type { Artist } from "~/interfaces/responses/pages/artist/Artist";
import type { Item as SquareCarouselItem } from "~/components/carousel/SquareCarousel.vue";
import type { Item as PlaylistMusicItem } from "~/components/playlist/PlaylistMusic.vue";
import type { Item as CircleCarouselItem } from "~/components/carousel/CircleCarousel.vue";
import { environment } from "~/services/environments";
import { formatTime } from "~/utils/formatTime";
import type { Artists } from "~/interfaces/responses/pages/artists/Artists";
import { artistPageService } from "~/services/page/artistPageService";
import type { AdsFooter } from "~/interfaces/responses/pages/artists/AdsFooter";

interface State {
  artistData: Artist | null;
  newReleaseVideo: PlaylistMusicItem[];
  videos: PlaylistMusicItem[];
  similarArtists: CircleCarouselItem[];
  featuringArtists: CircleCarouselItem[];
  albums: SquareCarouselItem[];
  error: KetubeError | null;
  isLoading: boolean;
  artistsPageData: Artists | null;
  adsAboveFooter: AdsFooter | null;
}

export const useArtistPageStore = defineStore("useArtistPageStore", {
  state: (): State => {
    return {
      artistData: null,
      videos: [],
      newReleaseVideo: [],
      similarArtists: [],
      featuringArtists: [],
      artistsPageData: null,
      albums: [],
      error: null,
      isLoading: false,
      adsAboveFooter: null,
    };
  },
  actions: {
    async getBySlug(slug: string) {
      this.isLoading = true;
      await artistPageService
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
              artist: "",
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              album: value.album?.name ?? "-",
              albumSlug: value.album?.slug ?? null,
              duration: formatTime(value.duration),
              partnerName: value.partnerName,
              partnerImage: value.partnerImage
                ? `${environment.urlApiImg}/${value.partnerImage}`
                : `${environment.urlBaseApp}/profile.jpeg`,
            } as PlaylistMusicItem;
          });

          this.newReleaseVideo = value.newReleaseVideo.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              link: `/karaoke?v=${value.slug}`,
              name: value.name,
              artist: "",
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              album: value.album?.name,
              albumSlug: value.album?.slug ?? null,
              duration: formatTime(value.duration),
            } as PlaylistMusicItem;
          });

          this.featuringArtists = value.featuringArtists.map((value) => {
            return {
              link: `/artist/${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
            } as CircleCarouselItem;
          });

          this.similarArtists = value.similarArtists.map((value) => {
            return {
              link: `/artist/${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
            } as CircleCarouselItem;
          });

          this.albums = value.albums.map((value) => {
            return {
              link: `/album/${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
              description: "",
              albumSlug: value.slug,
            } as SquareCarouselItem;
          });

          this.artistData = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async getAllByStyle(slug: string) {
      this.isLoading = true;
      await artistPageService
        .getAllByStyle(slug)
        .then((value) => {
          if (value.adsAboveFooter != null) {
            this.adsAboveFooter = {
              id: value.adsAboveFooter.id,
              url: value.adsAboveFooter.url,
              imageDesktopPath: `${environment.urlApiImg}/${value.adsAboveFooter.imageDesktopPath}`,
              imageMobilePath: `${environment.urlApiImg}/${value.adsAboveFooter.imageMobilePath}`,
            } as AdsFooter;
          }
          this.artistsPageData = value;
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
