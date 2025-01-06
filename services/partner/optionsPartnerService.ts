import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";
import type {
  Option,
  OptionArtist,
} from "~/interfaces/responses/partner/option/Option";

export const optionPartnersService = {
  async getStyles(): Promise<Option[]> {
    return await fetch
      .get(`/partner/options/styles`)
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
  async getArtists(): Promise<Option[]> {
    return await fetch
      .get(`/partner/options/artists`)
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
  async getArtistById(
    id: string,
    page: number = 0,
    size: number = 10,
    sort: string = "",
    order: string = "desc",
    keyword?: string,
  ): Promise<OptionArtist> {
    return await fetch
      .get(`/partner/options/artist/${id}`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
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
};
