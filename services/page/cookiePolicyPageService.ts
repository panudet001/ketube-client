import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { CookiePolicy } from "~/interfaces/responses/pages/cookie-policy/CookiePolicy";
import { transformError } from "~/utils/transformError";

export const cookiePolicyPageService = {
  async getCookiePolicy(): Promise<CookiePolicy> {
    return await fetch
      .get(`/contents/cookies-policy`)
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
