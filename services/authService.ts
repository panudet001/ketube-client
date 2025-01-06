import { environment } from "./environments";
import fetch from "~/http/fetch";
import type { Token } from "~/interfaces/responses/auth/Token";
import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";

export const authService = {
  async loginByGoogle(token: string): Promise<Token> {
    return await fetch
      .post(`/google/login`, { body: { token } })
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

  async registerByGoogle(token: string): Promise<Token> {
    return await fetch
      .post(`/google`, {
        baseURL: environment.urlApiGoogle,
        body: { token },
      })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: reason.data.message,
        };
        throw ketubeError;
      });
  },
};
