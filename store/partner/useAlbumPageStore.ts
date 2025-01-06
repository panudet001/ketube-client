import type { KetubeError } from "~/interfaces/KetubeError";
import type {
  Album,
  AlbumPagination,
  AlbumViewerStats,
} from "~/interfaces/responses/partner/album/Album";
import { albumPartnerPageService } from "~/services/partner/albumPartnerPageService";

interface State {
  album: Album | null;
  albumList: AlbumPagination | null;
  view: AlbumViewerStats | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useAlbumPartnerPageStore = defineStore(
  "useAlbumPartnerPageStore",
  {
    state: (): State => {
      return {
        album: null,
        albumList: null,
        view: null,
        error: null,
        isLoading: false,
      };
    },
    actions: {
      async createAlbum(formData: FormData) {
        this.isLoading = true;
        await albumPartnerPageService
          .createAlbum(formData)
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
      async updateAlbum(formData: FormData) {
        this.isLoading = true;
        await albumPartnerPageService
          .updateAlbum(formData)
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
        await albumPartnerPageService
          .getById(id)
          .then((value) => {
            this.album = value;
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
      ) {
        this.isLoading = true;
        await albumPartnerPageService
          .get(page, size, sort, order, keyword)
          .then((value) => {
            this.albumList = value;
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
        await albumPartnerPageService
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
        await albumPartnerPageService
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
      async deleteAlbumById(id: string) {
        this.isLoading = true;
        await albumPartnerPageService
          .deleteAlbumById(id)
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
  },
);
