import type { KetubeError } from "~/interfaces/KetubeError";
import type {
  Playlist,
  PlaylistPagination,
  PlaylistViewerStats,
} from "~/interfaces/responses/partner/playlist/Playlist";
import { playlistPartnerPageService } from "~/services/partner/playlistPartnerPageService";

interface State {
  playlist: Playlist | null;
  playlistList: PlaylistPagination | null;
  view: PlaylistViewerStats | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const usePlaylistPartnerPageStore = defineStore(
  "usePlaylistPartnerPageStore",
  {
    state: (): State => {
      return {
        playlist: null,
        playlistList: null,
        view: null,
        error: null,
        isLoading: false,
      };
    },
    actions: {
      async createPlaylist(formData: FormData) {
        this.isLoading = true;
        await playlistPartnerPageService
          .createPlaylist(formData)
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
      async updatePlaylist(formData: FormData) {
        this.isLoading = true;
        await playlistPartnerPageService
          .updatePlaylist(formData)
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
        await playlistPartnerPageService
          .getById(id)
          .then((value) => {
            this.playlist = value;
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
        await playlistPartnerPageService
          .get(page, size, sort, order, keyword)
          .then((value) => {
            this.playlistList = value;
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
        await playlistPartnerPageService
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
      async getStatsById(
        id: string = "",
        start: string = "",
        end: string = "",
      ) {
        this.isLoading = true;
        await playlistPartnerPageService
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
      async deletePlaylistById(id: string) {
        this.isLoading = true;
        await playlistPartnerPageService
          .deletePlaylistById(id)
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
