import type { KetubeError } from "~/interfaces/KetubeError";
import { videoPartnersService } from "~/services/partner/videoPartnerService";
import type {
  Video,
  VideoPagination,
  VideoViewerStats,
} from "~/interfaces/responses/partner/video/Video";

interface State {
  video: Video | null;
  videoList: VideoPagination | null;
  view: VideoViewerStats[] | [];
  error: KetubeError | null;
  isLoading: boolean;
}

export const useVideoPartnerStore = defineStore("useVideoPartnerStore", {
  state: (): State => {
    return {
      video: null,
      videoList: null,
      view: [],
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async createVideo(formData: FormData) {
      this.isLoading = true;
      await videoPartnersService
        .createVideo(formData)
        .then((_) => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async updateVideo(formData: FormData) {
      this.isLoading = true;
      await videoPartnersService
        .updateVideo(formData)
        .then((_) => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getById(id: string) {
      this.isLoading = true;
      await videoPartnersService
        .getById(id)
        .then((value) => {
          this.video = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async get(
      page: number = 0,
      size: number = 30,
      sort: string = "updatedAt",
      order: string = "desc",
      keyword?: string,
      status?: boolean,
      startDate?: string,
      endDate?: string,
      keyNameCreated?: string,
      keyNameUpdated?: string,
    ) {
      this.isLoading = true;
      await videoPartnersService
        .get(
          page,
          size,
          sort,
          order,
          keyword,
          status,
          startDate,
          endDate,
          keyNameCreated,
          keyNameUpdated,
        )
        .then((value) => {
          this.videoList = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getStats(start: string = "", end: string = "") {
      this.isLoading = true;
      await videoPartnersService
        .getStats(start, end)
        .then((value) => {
          this.view = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getStatsById(id: string, start: string = "", end: string = "") {
      this.isLoading = true;
      await videoPartnersService
        .getStatsById(id, start, end)
        .then((value) => {
          this.view = value;
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
