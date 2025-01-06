import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Explore } from "~/interfaces/responses/pages/explore/Explore";
import { transformError } from "~/utils/transformError";

export const explorePageService = {
  async getByStyle(slug: string): Promise<Explore> {
    if (slug && slug === "undefined") {
      slug = "all";
    }
    return await fetch
      .get(`/page/explore/${slug}`)
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
