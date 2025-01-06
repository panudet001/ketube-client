import type { KetubeError } from "~/interfaces/KetubeError";
import { karaokePageService } from "~/services/page/karaokePageService";
import type { Video } from "~/interfaces/responses/pages/karaoke/Video";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";

interface State {
  recommendedVideos: Video[] | [];
  adsAboveFooter: AdsFooter | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useKaraokePageStore = defineStore("useKaraokePageStore", {
  state: (): State => {
    return {
      recommendedVideos: [],
      adsAboveFooter: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async get() {
      this.isLoading = true;
      await karaokePageService
        .get()
        .then((value) => {
          this.recommendedVideos = value.recommendedVideos;
          this.adsAboveFooter = value.adsAboveFooter;
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
