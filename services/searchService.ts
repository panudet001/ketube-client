import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Search, SearchAll } from "~/interfaces/responses/search/Search";
import { transformError } from "~/utils/transformError";

export const searchService = {
  async search(q: string): Promise<Search> {
    return await fetch
      .get(`/search/?q=${q}`)
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
  async searchAll(q: string): Promise<SearchAll> {
    return await fetch
      .get(`/page/search/?q=${q}`)
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
