import type { KetubeError } from "~/interfaces/KetubeError";
import { termsOfUsePageService } from "~/services/page/termsOfUsePageService";
import type { TermsOfUse } from "~/interfaces/responses/pages/terms-of-use/TermsOfUse";

interface State {
  termsOfUseData: TermsOfUse | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useTermsOfUsePageStore = defineStore("useTermsOfUsePageStore", {
  state: (): State => {
    return {
      termsOfUseData: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async getTermsOfUse() {
      this.isLoading = true;
      await termsOfUsePageService
        .getTermsOfUse()
        .then((value) => {
          this.termsOfUseData = value;
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
});
