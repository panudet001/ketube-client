import type { KetubeError } from "~/interfaces/KetubeError";
import type { Search } from "~/interfaces/responses/search/Search";
import { searchService } from "~/services/searchService";
import type {
  PlaylistMusicItem,
  Result,
} from "~/interfaces/responses/search/Result";
import { environment } from "~/services/environments";
import { formatTime } from "~/utils/formatTime";

interface State {
  searchResult: Search | null;
  searchKaraokeResult: Search | null;
  videos: PlaylistMusicItem[] | [];
  artists: Result[] | [];
  albums: Result[] | [];
  playlists: Result[] | [];
  error: KetubeError | null;
  isLoading: boolean;
  idAdsSearch: string;
  searchHistory: string[];
  filterHistory: string[];
}

export const useSearchStore = defineStore("useSearchStore", {
  state: (): State => {
    return {
      searchResult: null,
      searchKaraokeResult: null,
      videos: [],
      artists: [],
      albums: [],
      playlists: [],
      error: null,
      isLoading: false,
      idAdsSearch: "",
      searchHistory: [],
      filterHistory: [],
    };
  },
  actions: {
    async getForKaraoke(q: string) {
      await searchService
        .search(q)
        .then((value) => {
          this.searchKaraokeResult = value;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async get(q: string) {
      this.isLoading = true;
      await searchService
        .search(q)
        .then((value) => {
          if (value.adsSearch != null) {
            this.searchResult = value;
            this.idAdsSearch = value.adsSearch.id;

            if (value.adsSearch && value.results.length > 0) {
              const adsSearch = {
                slug: value.adsSearch.url,
                name: value.adsSearch.name,
                type: "ads",
                imagePath: value.adsSearch.imageMobilePath,
              } as Result;
              this.searchResult.results = [
                ...this.searchResult.results.slice(0, 4),
                adsSearch,
              ];
            }
          } else {
            this.searchResult = value;
          }
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getImag(imagePath: string) {
      return `${environment.urlApiImg}/${imagePath}`;
    },

    async getBySlug(q: string) {
      this.isLoading = true;
      await searchService
        .searchAll(q)
        .then((value) => {
          this.videos = value?.videos.map((value) => {
            return {
              id: value.id,
              slug: value.slug,
              link: `/karaoke?v=${value.slug}`,
              name: value.name,
              artist: value.artists?.map((value) => `${value.name}`).join(),
              artistSlug: `${value.artists?.map((value) => `${value.slug}`).join()}`,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              album: value.albums?.name,
              albumSlug: value.albums?.slug,
              duration: formatTime(Number(value.duration)),
              artists: value.artists,
              partnerName: value.partnerName,
              partnerImage: value.partnerImage
                ? `${environment.urlApiImg}/${value.partnerImage}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              videoSlug: value.slug,
            } as PlaylistMusicItem;
          });

          this.artists = value?.artists.map((value) => {
            return {
              title: value.name,
              name: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imagePath: value.imagePath,
              imageName: value.name,
              link: `/artist/${value.slug}`,
              type: value.type,
              slug: value.slug,
              partnerName: value.partnerName,
            } as Result;
          });

          this.albums = value?.albums.map((value) => {
            return {
              title: value.name,
              name: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imagePath: value.imagePath,
              imageName: value.name,
              link: `/album/${value.slug}`,
              type: value.type,
              slug: value.slug,
              albumSlug: value.slug,
              artistLink: value.artist?.slug,
              description: value.artist?.name,
            } as Result;
          });

          this.playlists = value?.playlists.map((value) => {
            return {
              title: value.name,
              name: value.name,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              imagePath: value.imagePath,
              imageName: value.name,
              link: `/playlist/${value.slug}`,
              type: value.type,
              slug: value.slug,
              artistLink: value.artists?.map((value) => `${value.slug}`).join(),
              partnerName: value.partnerName,
              id: value.id,
            } as Result;
          });
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    setHistory(val: string) {
      const searchHistory = useCookie("searchHistory");
      let dataList: string[] = [];
      if (dataList.length === 0 && searchHistory.value) {
        dataList = this.getDataHistory();
      }
      const list = dataList?.find((item) => item === val);
      if (!list) {
        dataList.push(val);
      }
      searchHistory.value = dataList.toString();
      this.searchHistory = dataList;
    },

    getDataHistory() {
      let dataList: string[] = [];
      const searchHistory = useCookie("searchHistory");
      if (searchHistory.value) {
        const item = searchHistory.value;
        dataList = item.split(",");
      }
      return dataList;
    },

    getHistory(val: string = "") {
      if (this.searchHistory) {
        this.searchHistory = this.getDataHistory();
      }
      let results;
      if (val) {
        results = this.searchHistory.filter((value) =>
          value.toLowerCase().startsWith(val.toLowerCase()),
        );
      } else {
        results = this.getDataHistory();
      }
      const sort = results
        .map((value, index) => ({ value, index })) // สร้างอาร์เรย์ของวัตถุที่ประกอบด้วยค่าและ index
        .sort((a, b) => b.index - a.index) // เรียงลำดับตาม index ใหม่สุดไปเก่าสุด
        .map((item) => item.value); // กลับมาเป็นอาร์เรย์ของค่าเท่านั้น
      this.filterHistory = sort.slice(0, 3);
    },

    delHistory(key: string, val: string) {
      const searchHistory = useCookie("searchHistory");
      if (this.searchHistory) {
        this.searchHistory = this.getDataHistory();
      }
      const results = this.searchHistory.findIndex((item) => item === val);
      this.searchHistory.splice(results, 1);
      searchHistory.value = this.searchHistory.toString();

      const filter = this.searchHistory.filter((value) =>
        value.toLowerCase().startsWith(key.toLowerCase()),
      );
      const sort = filter
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.index - a.index)
        .map((item) => item.value);
      this.filterHistory = sort.slice(0, 3);
    },
  },
});
