import type {
  PlaylistPagination,
  PlaylistViewerStats,
} from "~/interfaces/responses/partner/playlist/Playlist";
import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";
import type { Video } from "~/store/useKaraokeStore";

export const playlistPartnerPageService = {
  async createPlaylist(formData: FormData): Promise<void> {
    return await fetch
      .post("/partner/playlists", { body: formData })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async updatePlaylist(formData: FormData): Promise<void> {
    return await fetch
      .put("/partner/playlists", { body: formData })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async getById(val: string): Promise<Video> {
    return await fetch
      .get(`/partner/playlists/${val}`)
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async get(
    page = 0,
    size = 10,
    sort = "updatedAt",
    order = "desc",
    keyword = "",
    startDate = "",
    endDate = "",
    keyNameCreated = "",
    keyNameUpdated = "",
  ): Promise<PlaylistPagination> {
    return await fetch
      .get(`/partner/playlists`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
          startDate,
          endDate,
          keyNameCreated,
          keyNameUpdated,
        },
      })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async getStats(startDate = "", endDate = ""): Promise<PlaylistViewerStats> {
    return await fetch
      .get(`/partner/playlists/viewer-stats`, {
        params: {
          startDate,
          endDate,
        },
      })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async getStatsById(
    id = "",
    startDate = "",
    endDate = "",
  ): Promise<PlaylistViewerStats> {
    return await fetch
      .get(`/partner/playlists/viewer-stats/${id}`, {
        params: {
          startDate,
          endDate,
        },
      })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async deletePlaylistById(id: string): Promise<void> {
    return await fetch
      .del(`/partner/playlists/${id}`)
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
};
