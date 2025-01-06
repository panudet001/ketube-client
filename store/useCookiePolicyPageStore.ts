import type { KetubeError } from "~/interfaces/KetubeError";
import { cookiePolicyPageService } from "~/services/page/cookiePolicyPageService";
import type { CookiePolicy } from "~/interfaces/responses/pages/cookie-policy/CookiePolicy";

interface State {
  cookiePolicyData: CookiePolicy | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useCookiePolicyPageStore = defineStore(
  "useCookiePolicyPageStore",
  {
    state: (): State => {
      return {
        cookiePolicyData: null,
        error: null,
        isLoading: false,
      };
    },
    actions: {
      async getCookiePolicy() {
        this.isLoading = true;
        await cookiePolicyPageService
          .getCookiePolicy()
          .then((value) => {
            this.cookiePolicyData = value;
            this.error = null;
          })
          .catch((reason) => {
            this.error = reason;
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    },
  },
);
