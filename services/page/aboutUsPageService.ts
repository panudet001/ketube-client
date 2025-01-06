import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { AboutUs } from "~/interfaces/responses/pages/about-us/AboutUs";
import { transformError } from "~/utils/transformError";

export const aboutUsPageService = {
  async get(): Promise<AboutUs> {
    return await fetch
      .get("/page/about-us")
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
