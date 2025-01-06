import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Playlist } from "~/interfaces/responses/pages/playlist/Playlist";
import type { Playlists } from "~/interfaces/responses/pages/playlists/Playlists";
import { transformError } from "~/utils/transformError";

export const playlistPageService = {
  async getBySlug(slug: string): Promise<Playlist> {
    return await fetch
      .get(`/page/playlist/${slug}`)
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

  async getAll(page = 0, size = 15, sort = "", order = ""): Promise<Playlists> {
    return await fetch
      .get("/page/playlists", {
        params: {
          page,
          size,
          sort,
          order,
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

  async getFavorite(): Promise<Playlist[]> {
    return await fetch
      .get(`/playlists/favorite`)
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
      .post(`/playlists/favorite`, { body: { id: val } })
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
      .del(`/playlists/favorite/${val}`)
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
