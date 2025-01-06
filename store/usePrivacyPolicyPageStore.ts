import type { KetubeError } from "~/interfaces/KetubeError";
import { privacyPolicyPageService } from "~/services/page/privacyPolicyPageService";
import type { TermsOfUse } from "~/interfaces/responses/pages/terms-of-use/TermsOfUse";

interface State {
  privacyPolicyData: TermsOfUse | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const usePrivacyPolicyPageStore = defineStore(
  "usePrivacyPolicyPageStore",
  {
    state: (): State => {
      return {
        privacyPolicyData: null,
        error: null,
        isLoading: false,
      };
    },
    actions: {
      async getPrivacyPolicy() {
        this.isLoading = true;
        await privacyPolicyPageService
          .getPrivacyPolicy()
          .then((value) => {
            this.privacyPolicyData = value;
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
