import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Album } from "~/interfaces/responses/pages/album/Album";
import { transformError } from "~/utils/transformError";

export const albumPageService = {
  async getBySlug(slug: string): Promise<Album> {
    return await fetch
      .get(`/page/album/${slug}`)
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
