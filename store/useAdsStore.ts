import { publishService } from "~/services/publishService";

interface State {
  id: string | null;
  token: string | null;
}

export const useAdsStore = defineStore("useAdsStore", {
  state: (): State => {
    return {
      id: "",
      token: "",
    };
  },
  actions: {
    async postClick(id: string, token: string) {
      await publishService.postAds(id, token);
    },
  },
});
