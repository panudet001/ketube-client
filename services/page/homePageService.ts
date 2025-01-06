import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Home } from "~/interfaces/responses/pages/home/Home";
import { transformError } from "~/utils/transformError";

export const homePageService = {
  async get(): Promise<Home> {
    return await fetch
      .get("/page/home")
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
