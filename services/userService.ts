import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { User, UserFavorites } from "~/interfaces/responses/user/User";
import type { Result } from "~/interfaces/responses/user/Result";
import { transformError } from "~/utils/transformError";
import { objectToFormData } from "~/utils/objectToFormData";

export const userService = {
  async get(): Promise<Result> {
    return await fetch
      .get(`/users/me`)
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
  async updateProfile(formUser: User): Promise<User> {
    const formProfile = objectToFormData(formUser);

    return await fetch
      .put(`/users`, { body: formProfile })
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
  async getFavorites(): Promise<UserFavorites> {
    return await fetch
      .get(`/users/my-favorites`)
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
