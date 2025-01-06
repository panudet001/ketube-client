import fetch from "~/http/fetch";
import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";
import type { Recent } from "~/interfaces/responses/pages/music/Video";

export const musicPageService = {
  async get(): Promise<Recent> {
    return await fetch
      .get(`/page/recents`)
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
