import type { KetubeError } from "~/interfaces/KetubeError";
import { explorePageService } from "~/services/page/explorePageService";
import type { Explore } from "~/interfaces/responses/pages/explore/Explore";
import type { Item as SquareCarouselItem } from "~/components/carousel/SquareCarousel.vue";
import type { Item as CircleCarouselItem } from "~/components/carousel/CircleCarousel.vue";
import { environment } from "~/services/environments";

interface State {
  exploreData: Explore | null;
  recommendedVideos: SquareCarouselItem[] | [];
  videoNewReleases: SquareCarouselItem[] | [];
  recommendedPlaylists: SquareCarouselItem[] | [];
  artists: CircleCarouselItem[] | [];
  error: KetubeError | null;
  isLoading: boolean;
  idAdsBetween: string;
}

export const useExplorePageStore = defineStore("useExplorePageStore", {
  state: (): State => {
    return {
      artists: [],
      videoNewReleases: [],
      recommendedVideos: [],
      recommendedPlaylists: [],
      exploreData: null,
      error: null,
      isLoading: false,
      idAdsBetween: "",
    };
  },
  actions: {
    async getByStyle(slug: string) {
      this.isLoading = true;
      await explorePageService
        .getByStyle(slug)
        .then((value) => {
          this.exploreData = value;
          this.artists = value.artists.map((value) => {
            return {
              link: `/artist/${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
            } as CircleCarouselItem;
          });

          this.recommendedPlaylists = value.recommendedPlaylists.map(
            (value) => {
              return {
                link: `/playlist/${value.slug}`,
                title: value.name,
                imageURL: `${environment.urlApiImg}/${value.imagePath}`,
                imageName: value.name,
                description: "",
                partnerName: value.partnerName,
              } as SquareCarouselItem;
            },
          );

          this.recommendedVideos = value.recommendedVideos.map((value) => {
            return {
              link: `/karaoke?v=${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
              description: value.artists.map((value) => `${value.name}`).join(),
              artistLink: value.artists.map((value) => `${value.slug}`).join(),
              ads: false,
              partnerName: value.partnerName,
            } as SquareCarouselItem;
          });
          if (value.adsBetweenVideo != null) {
            this.idAdsBetween = value.adsBetweenVideo.id;
            const adsBetweenVideo = {
              link: value.adsBetweenVideo.url,
              title: value.adsBetweenVideo.name,
              imageURL: `${environment.urlApiImg}/${value.adsBetweenVideo.imageDesktopPath}`,
              imageName: value.adsBetweenVideo.name,
              description: value.adsBetweenVideo.name,
              ads: true,
            } as SquareCarouselItem;
            this.recommendedVideos = [
              adsBetweenVideo,
              ...this.recommendedVideos,
            ];
          }

          this.videoNewReleases = value.videoNewReleases.map((value) => {
            return {
              link: `/karaoke?v=${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
              description: value.artists.map((value) => `${value.name}`).join(),
              ads: false,
              artistLink: value.artists.map((value) => `${value.slug}`).join(),
              partnerName: value.partnerName,
            } as SquareCarouselItem;
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
  },
});
