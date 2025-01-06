import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";

export const publishService = {
  async postAds(id: string, token: string): Promise<void> {
    return await fetch
      .post(`/ads-images/click`, { body: { id, token } })
      .then((_) => {})
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
