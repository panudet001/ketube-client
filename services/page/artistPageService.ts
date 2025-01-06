import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Artist } from "~/interfaces/responses/pages/artist/Artist";
import type { Artists } from "~/interfaces/responses/pages/artists/Artists";
import { transformError } from "~/utils/transformError";

export const artistPageService = {
  async getBySlug(slug: string): Promise<Artist> {
    return await fetch
      .get(`/page/artist/${slug}`)
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

  async getAllByStyle(slug: string): Promise<Artists> {
    let url = "";
    if (slug && slug !== "undefined") {
      url = `/page/artists?style=${slug}`;
    } else {
      url = "/page/artists";
    }

    return await fetch
      .get(url)
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
