import type { KetubeError } from "~/interfaces/KetubeError";
import { aboutUsPageService } from "~/services/page/aboutUsPageService";
import { environment } from "~/services/environments";
import type { AboutUs } from "~/interfaces/responses/pages/about-us/AboutUs";

interface State {
  aboutUsData: AboutUs | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useAboutUsPageStore = defineStore("useAboutUsPageStore", {
  state: (): State => {
    return {
      aboutUsData: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async get() {
      this.isLoading = true;
      await aboutUsPageService
        .get()
        .then((value) => {
          this.aboutUsData = {
            title_1: value.title_1,
            content_1: value.content_1,
            title_2: value.title_2,
            content_2: value.content_2,
            title_3: value.title_3,
            content_3: value.content_3,
            title_4: value.title_4,
            content_4: value.content_4,
            imagePath: `${environment.urlApiImg}/${value.imagePath}`,
            partners: value.partners?.map((value) => {
              return {
                name: value.name,
                image: `${environment.urlApiImg}/${value.image}`,
              };
            }),
          } as AboutUs;
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
