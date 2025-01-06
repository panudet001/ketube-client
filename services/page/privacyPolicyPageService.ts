import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { TermsOfUse } from "~/interfaces/responses/pages/terms-of-use/TermsOfUse";
import { transformError } from "~/utils/transformError";

export const privacyPolicyPageService = {
  async getPrivacyPolicy(): Promise<TermsOfUse> {
    return await fetch
      .get(`/contents/privacy-policy`)
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
