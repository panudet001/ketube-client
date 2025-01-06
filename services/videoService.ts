import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Search } from "~/interfaces/responses/video/Search";
import type { Video } from "~/interfaces/responses/video/Video";
import { transformError } from "~/utils/transformError";
import type { VideoArtist } from "~/interfaces/responses/video/VideoArtist";

export const videoService = {
  async search(q: string): Promise<Search> {
    return await fetch
      .get(`/videos/search/?q=${q}`)
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

  async getBySlug(slug: string): Promise<Video> {
    return await fetch
      .get(`/videos/${slug}`)
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
  async getArtisBySlug(slug: string): Promise<VideoArtist> {
    return await fetch
      .get(`/videos/artist/${slug}`)
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

  async getFavorite(): Promise<Video[]> {
    return await fetch
      .get(`/videos/favorites`)
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

  async saveFavorite(val: string): Promise<void> {
    return await fetch
      .post(`/videos/favorites`, { body: { id: val } })
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

  async deleteFavorite(val: string): Promise<void> {
    return await fetch
      .del(`/videos/favorites/${val}`)
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
