import type { KetubeError } from "~/interfaces/KetubeError";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";
import { musicPageService } from "~/services/page/musicPageService";
import { environment } from "~/services/environments";
import type { PlaylistMusicItem } from "~/interfaces/responses/search/Result";

interface State {
  recent: PlaylistMusicItem[] | [];
  error: KetubeError | null;
  isLoading: boolean;
}

export const useMusicStore = defineStore("useMusicStore", {
  state: (): State => {
    return {
      recent: [],
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async get() {
      this.isLoading = true;
      await musicPageService
        .get()
        .then((value) => {
          this.recent = value.videos.map((value) => {
            return {
              id: value.id,
              link: `/karaoke?v=${value.slug}`,
              name: value.name,
              artist: value.artists.map((value) => `${value.name}`).join(),
              slug: value.artists.map((value) => `${value.slug}`).join(),
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              artists: value.artists,
              album: value.album?.name ?? "-",
              albumSlug: value.album?.slug ?? null,
              duration: formatTime(value.duration),
              partnerName: value.partnerName,
              partnerImage: value.partnerImage
                ? `${environment.urlApiImg}/${value.partnerImage}`
                : `${environment.urlBaseApp}/profile.jpeg`,
            } as PlaylistMusicItem;
          });
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
          if (reason.exception === "UNAUTHORIZED") {
            const token = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
            token.value = null;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
