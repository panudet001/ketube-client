import type { KetubeError } from "~/interfaces/KetubeError";
import type { Option } from "~/interfaces/responses/partner/option/Option";
import type { Pagination } from "~/interfaces/responses/partner/video/Video";
import { optionPartnersService } from "~/services/partner/optionsPartnerService";

interface State {
  optionArtists: Option[] | [];
  optionStyles: Option[] | [];
  optionVideosList: Option[] | [];
  pagination: Pagination | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useOptionPartnerStore = defineStore("useOptionPartnerStore", {
  state: (): State => {
    return {
      optionArtists: [],
      optionStyles: [],
      optionVideosList: [],
      pagination: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async getArtists() {
      this.isLoading = true;
      await optionPartnersService
        .getArtists()
        .then((value) => {
          this.optionArtists = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getArtistById(
      id: string,
      page: number = 0,
      size: number = 10,
      sort: string = "",
      order: string = "desc",
      keyword?: string,
    ) {
      this.isLoading = true;
      await optionPartnersService
        .getArtistById(id, page, size, sort, order, keyword)
        .then((value) => {
          this.optionVideosList = value.videos.map((value) => {
            return {
              id: value.id,
              name: value.name,
              image: value.image,
              description: value.description,
              duration: value.duration,
            } as Option;
          });

          this.pagination = value.pagination;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getStyles() {
      this.isLoading = true;
      await optionPartnersService
        .getStyles()
        .then((value) => {
          this.optionStyles = value;
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
