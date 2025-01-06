import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";
import type {
  Video,
  VideoPagination,
  VideoViewerStats,
} from "~/interfaces/responses/partner/video/Video";

export const videoPartnersService = {
  async createVideo(formData: FormData): Promise<void> {
    return await fetch
      .post("/partner/videos", { body: formData })
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
  async updateVideo(formData: FormData): Promise<void> {
    return await fetch
      .put("/partner/videos", { body: formData })
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
      .get(`/partner/videos/${val}`)
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
    size = 0,
    sort = "updatedAt",
    order = "desc",
    keyword = "",
    status = true,
    startDate = "",
    endDate = "",
    keyNameCreated = "",
    keyNameUpdated = "",
  ): Promise<VideoPagination> {
    return await fetch
      .get(`/partner/videos`, {
        params: {
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
  async getStats(startDate = "", endDate = ""): Promise<VideoViewerStats[]> {
    return await fetch
      .get(`/partner/videos/viewer-stats`, {
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
  ): Promise<VideoViewerStats[]> {
    return await fetch
      .get(`/partner/videos/viewer-stats/${id}`, {
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
};
