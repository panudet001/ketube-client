import type {
  Album,
  AlbumPagination,
  AlbumViewerStats,
} from "~/interfaces/responses/partner/album/Album";
import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";

export const albumPartnerPageService = {
  async createAlbum(formData: FormData): Promise<void> {
    return await fetch
      .post("/partner/albums", { body: formData })
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
  async updateAlbum(formData: FormData): Promise<void> {
    return await fetch
      .put("/partner/albums", { body: formData })
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
  async getById(val: string): Promise<Album> {
    return await fetch
      .get(`/partner/albums/${val}`)
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
  ): Promise<AlbumPagination> {
    return await fetch
      .get(`/partner/albums`, {
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
  async getStats(startDate = "", endDate = ""): Promise<AlbumViewerStats> {
    return await fetch
      .get(`/partner/albums/viewer-stats`, {
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
    id: string,
    startDate = "",
    endDate = "",
  ): Promise<AlbumViewerStats> {
    return await fetch
      .get(`/partner/albums/viewer-stats/${id}`, {
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
  async deleteAlbumById(id: string): Promise<void> {
    return await fetch
      .del(`/partner/albums/${id}`)
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
