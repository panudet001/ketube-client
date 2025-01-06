import type { KetubeError } from "~/interfaces/KetubeError";
import { homePageService } from "~/services/page/homePageService";
import type { Item as SquareCarouselItem } from "~/components/carousel/SquareCarousel.vue";
import { environment } from "~/services/environments";
import type { Item as ImageCarouselItem } from "~/components/carousel/ImageCarousel.vue";
import type { Item as CircleCarouselItem } from "~/components/carousel/CircleCarousel.vue";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";
export interface DropdownItem {
  title: string;
  status: boolean;
}
interface State {
  banners: ImageCarouselItem[] | [];
  recommendedVideos: SquareCarouselItem[] | [];
  videoNewReleases: SquareCarouselItem[] | [];
  recommendedPlaylists: SquareCarouselItem[] | [];
  recents: SquareCarouselItem[] | [];
  artists: CircleCarouselItem[] | [];
  error: KetubeError | null;
  isLoading: boolean;
  adsAboveFooter: AdsFooter | null;
  idAdsBanner: string;
  idAdsBetween: string;
  dropdownData: DropdownItem[] | [];
}

export const useHomePageStore = defineStore("useHomePageStore", {
  state: (): State => {
    return {
      banners: [],
      recommendedVideos: [],
      videoNewReleases: [],
      recommendedPlaylists: [],
      recents: [],
      artists: [],
      error: null,
      isLoading: false,
      adsAboveFooter: null,
      idAdsBanner: "",
      idAdsBetween: "",
      dropdownData: [],
    };
  },
  actions: {
    async get() {
      this.isLoading = true;
      await homePageService
        .get()
        .then((value) => {
          if (value.adsAboveFooter != null) {
            this.adsAboveFooter = {
              id: value.adsAboveFooter.id,
              imageDesktopPath: `${environment.urlApiImg}/${value.adsAboveFooter.imageDesktopPath}`,
              imageMobilePath: `${environment.urlApiImg}/${value.adsAboveFooter.imageMobilePath}`,
              url: value.adsAboveFooter.url,
            } as AdsFooter;
          }

          this.banners = value.banners.map((value) => {
            return {
              link: value.url,
              name: value.name,
              imageDesktopURL: `${environment.urlApiImg}/${value.imageDesktopPath}`,
              imageMobile: `${environment.urlApiImg}/${value.imageMobilePath}`,
              imageIPadURL: `${environment.urlApiImg}/${value.imageIPadPath}`,
            } as ImageCarouselItem;
          });
          if (value.adsBanner != null) {
            const adsBanner = {
              link: value.adsBanner.url,
              name: value.adsBanner.name,
              imageDesktopURL: `${environment.urlApiImg}/${value.adsBanner.imageDesktopPath}`,
              imageMobile: `${environment.urlApiImg}/${value.adsBanner.imageDesktopPath}`,
              imageIPadURL: `${environment.urlApiImg}/${value.adsBanner.imageMobilePath}`,
            } as ImageCarouselItem;
            this.idAdsBanner = value.adsBanner.id;
            this.banners = [adsBanner, ...this.banners];
          }

          this.recommendedVideos = value.recommendedVideos.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              link: `/karaoke?v=${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
              description: value.artists.map((value) => `${value.name}`).join(),
              artistLink: value.artists.map((value) => `${value.slug}`).join(),
              partnerName: value.partnerName,
              partnerImage: value.partnerImage
                ? `${environment.urlApiImg}/${value.partnerImage}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              artists: value.artists,
            } as SquareCarouselItem;
          });

          this.videoNewReleases = value.videoNewReleases.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              link: `/karaoke?v=${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
              description: value.artists.map((value) => `${value.name}`).join(),
              artistLink: value.artists.map((value) => `${value.slug}`).join(),
              partnerName: value.partnerName,
              partnerImage: value.partnerImage
                ? `${environment.urlApiImg}/${value.partnerImage}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              artists: value.artists,
            } as SquareCarouselItem;
          });
          if (value.adsBetweenVideo != null) {
            const adsBetweenVideo = {
              link: value.adsBetweenVideo.url,
              title: value.adsBetweenVideo.name,
              imageURL: `${environment.urlApiImg}/${value.adsBetweenVideo.imageDesktopPath}`,
              imageName: value.adsBetweenVideo.name,
              description: value.adsBetweenVideo.name,
              ads: true,
            } as SquareCarouselItem;
            this.idAdsBetween = value.adsBetweenVideo.id;
            this.videoNewReleases = [adsBetweenVideo, ...this.videoNewReleases];
          }

          this.recommendedPlaylists = value.recommendedPlaylists.map(
            (value) => {
              return {
                link: `/playlist/${value.slug}`,
                title: value.name,
                imageURL: `${environment.urlApiImg}/${value.imagePath}`,
                imageName: value.name,
                description: value.description,
                partnerName: value.partnerName,
                partnerImage: value.partnerImage
                  ? `${environment.urlApiImg}/${value.partnerImage}`
                  : `${environment.urlBaseApp}/profile.jpeg`,
                id: value.id,
              } as SquareCarouselItem;
            },
          );

          this.artists = value.artists.map((value) => {
            return {
              link: `/artist/${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
            } as CircleCarouselItem;
          });

          this.recents = value.recents.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              link: `/karaoke?v=${value.slug}`,
              title: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imageName: value.name,
              description: value.artists.map((value) => `${value.name}`).join(),
              artistLink: value.artists.map((value) => `${value.slug}`).join(),
              partnerName: value.partnerName,
              partnerImage: value.partnerImage
                ? `${environment.urlApiImg}/${value.partnerImage}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              artists: value.artists,
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
    addDropdown(index: number, status: boolean, title: string) {
      this.dropdownData[index] = { title, status };
    },
    delDropdown() {
      this.dropdownData = [];
    },
  },
});
