import type { KetubeError } from "~/interfaces/KetubeError";
import { videoService } from "~/services/videoService";
import { environment } from "~/services/environments";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { karaokePageService } from "~/services/page/karaokePageService";
import type { AdsFooter } from "~/interfaces/responses/pages/karaoke/AdsFooter";

import type { PlaylistMusicItem } from "~/interfaces/responses/search/Result";
import { playlistPageService } from "~/services/page/playlistPageService";
import type { Playlist } from "~/interfaces/responses/pages/playlist/Playlist";
import { useRemoteStore } from "~/store/useRemoteStore";

export interface Video {
  id: string;
  idQueue: string;
  idAd: string;
  slug: string;
  name: string;
  imageURL: string;
  artists: string;
  artistSlug: string;
  albumSlug?: string;
  adsPath: string;
  playingURL?: string;
  adsLink: string;
  adsName: string;
  adsImage: string;
  artistsImage: string;
  partnerImg: string;
  partnerName: string;
  view: number;
  description: string;
  date: string;
  isActive: boolean;
}

interface State {
  defaultVideoURL: string;
  tokenOtt: string;
  adsPath: string;
  adsLink: string;
  adsFooter: string;
  playing: Video | null;
  queues: Video[];
  recommendedVideos: Video[] | [];
  adsAboveFooter: AdsFooter | null;
  error: KetubeError | null;
  isLoading: boolean;
  isAds: boolean;
  newReleaseVideo: PlaylistMusicItem[];
  nameArtis: string | null;
  isArtist: boolean;
  isAlbum: boolean;
  isPlaylist: boolean;
  isSeeMore: boolean;
  isActiveArtists: boolean;
  isActiveRecommended: boolean;
  isRoom: boolean;
  isRandom: boolean;
  roomName: string;
  playlistData: Playlist | null;
  artisVideos: Video[] | [];
}

export const useKaraokeStore = defineStore("useKaraokeStore", {
  state: (): State => {
    return {
      adsPath: "",
      adsFooter: "",
      tokenOtt: "",
      defaultVideoURL: environment.urlVideoTempNoSongs,
      playing: null,
      adsLink: "",
      queues: [],
      recommendedVideos: [],
      adsAboveFooter: null,
      isLoading: false,
      error: null,
      isAds: false,
      newReleaseVideo: [],
      nameArtis: null,
      isArtist: false,
      isAlbum: false,
      isPlaylist: false,
      isSeeMore: false,
      playlistData: null,
      artisVideos: [],
      isActiveArtists: true,
      isActiveRecommended: true,
      isRoom: false,
      roomName: "",
      isRandom: false,
    };
  },

  actions: {
    async get() {
      this.isLoading = true;
      const remoteStore = useRemoteStore();
      await karaokePageService
        .get()
        .then((value) => {
          if (value.adsAboveFooter != null) {
            this.adsAboveFooter = {
              id: value.adsAboveFooter.id,
              url: value.adsAboveFooter.url,
              imageDesktopPath: `${environment.urlApiImg}/${value.adsAboveFooter.imageDesktopPath}`,
              imageMobilePath: `${environment.urlApiImg}/${value.adsAboveFooter.imageMobilePath}`,
            } as AdsFooter;
          }

          this.recommendedVideos = value.recommendedVideos.map((value) => {
            return {
              id: value.id,
              name: value.name,
              slug: value.slug,
              artists: value.artists?.map((value) => `${value.name}`).join(),
              artistSlug: value.artists[0].slug,
              albumSlug: value.album?.slug,
              view: value.view,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              date: new Date().getTime().toString(),
            } as Video;
          });

          if (value.room != null && process.client && !this.isRandom) {
            this.isRoom = true;
            value.room.queues.forEach((e) => {
              this.queues.push({
                id: e.video.id,
                idQueue: e.id,
                idAd: "",
                name: e.video.name,
                slug: e.video.slug,
                artists: e.video.artists
                  ?.map((value) => `${value.name}`)
                  .join(),
                imageURL: `${environment.urlApiImg}/${e.video.imagePath}`,
                artistSlug: "",
                albumSlug: "",
                adsPath: "",
                playingURL: "",
                adsLink: "",
                adsName: "",
                adsImage: "",
                artistsImage: "",
                partnerImg: "",
                partnerName: "",
                view: 0,
                description: "",
                isActive: true,
                date: new Date().getTime().toString(),
              });
            });
            this.roomName = value.room.roomNumber;
            remoteStore.getRoom();
          }

          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async posView(token: string) {
      this.tokenOtt = token;
      await karaokePageService.postView(this.playing!.idAd, this.tokenOtt);
    },

    async postClick(token: string) {
      this.tokenOtt = token;
      await karaokePageService.postClick(this.playing!.idAd, this.tokenOtt);
    },
    async postViewVideo(token: string) {
      this.tokenOtt = token;
      await karaokePageService.postViewVideo(this.playing!.slug, this.tokenOtt);
    },
    async playVideo(slug: string) {
      await videoService
        .getBySlug(slug)
        .then((value) => {
          let ads = null;
          if (value.ads != null) {
            this.isAds = true;
            ads = `${environment.urlNimbleAds}/${value.ads?.videoPath}`;
          }
          if (value.artists) {
            this.playing = {
              id: value.id,
              idAd: value.ads?.id,
              name: value.name,
              slug: value.slug,
              artists: value.artists?.map((value) => `${value.name}`).join(),
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              adsPath: ads,
              adsName: value.ads?.name,
              partnerImg: value.partnerImg
                ? `${environment.urlApiImg}/${value.partnerImg}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              partnerName: value.partnerName,
              artistsImage: `${environment.urlApiImg}/${value.artists[0].imagePath}`,
              adsLink: value.ads?.url,
              adsImage: value.ads?.adsImages
                ? `${environment.urlApiImg}/${value.ads?.adsImages}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              artistSlug: value.artists[0].slug,
              albumSlug: value.album?.slug,
              view: value.view,
              description: value.description,
              playingURL: `${environment.urlNimbleVideo}/${value.video}`,
              date: new Date().getTime().toString(),
            } as Video;
          }
          this.artisVideos = value.videosByArtist.map((value) => {
            return {
              id: value.id,
              name: value.name,
              slug: value.slug,
              artists: value.artists?.map((value) => `${value.name}`).join(),
              albumSlug: value.album?.slug,
              view: value.view,
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              date: new Date().getTime().toString(),
            } as Video;
          });
          this.isActiveRecommended = false;
          this.isActiveArtists = true;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async addQueue(val: string) {
      await karaokePageService
        .addQueueToRoom(val)
        .then(() => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async addVideo(video: Video) {
      video.description = "";
      if (this.isRoom) {
        try {
          const idQueue = await karaokePageService.addQueueToRoom(video.id);
          this.queues.push({
            id: video.id,
            idQueue: idQueue.id,
            idAd: "",
            name: video.name,
            slug: video.slug,
            artists: video.artists,
            imageURL: video.imageURL,
            artistSlug: "",
            albumSlug: "",
            adsPath: "",
            playingURL: "",
            adsLink: "",
            adsName: "",
            adsImage: "",
            artistsImage: "",
            partnerImg: "",
            partnerName: "",
            view: 0,
            description: "",
            isActive: true,
            date: new Date().getTime().toString(),
          });
        } catch (error) {
          console.error("Error adding video to screen:", error);
        }
      } else {
        this.queues.push(video);
      }
      if (this.playing == null) {
        this.nextVideo();
      }
      showSweetAlert("บันทึกไปที่คิวแล้ว", "info", 1000, false, "top-end");
    },
    async addVideoForScreen(video: Video) {
      if (this.isRoom) {
        await videoService.getBySlug(video.slug).then(async (value) => {
          const idQueue = await karaokePageService.addQueueToRoom(value.id!);
          this.queues.push({
            id: video.id,
            idQueue: idQueue.id,
            idAd: "",
            name: video.name,
            slug: video.slug,
            artists: video.artists,
            imageURL: video.imageURL,
            artistSlug: "",
            albumSlug: "",
            adsPath: "",
            playingURL: "",
            adsLink: "",
            adsName: "",
            adsImage: "",
            artistsImage: "",
            partnerImg: "",
            partnerName: "",
            view: 0,
            description: "",
            isActive: true,
            date: new Date().getTime().toString(),
          });
        });
      } else {
        this.queues.push(video);
      }

      if (this.playing == null) {
        this.nextVideo();
      }
      showSweetAlert("บันทึกไปที่คิวแล้ว", "info", 1000, false, "top-end");
    },
    async nextVideoRe(videoSlug: string, isRe: boolean) {
      await videoService.getBySlug(videoSlug).then(async (value) => {
        if (value.artists) {
          let ads = null;
          if (value.ads != null) {
            this.isAds = true;
            ads = `${environment.urlNimbleAds}/${value.ads?.videoPath}`;
          }
          const video = {
            id: value.id,
            idAd: value.ads?.id,
            name: value.name,
            slug: value.slug,
            artists: value.artists?.map((value) => `${value.name}`).join(),
            imageURL: `${environment.urlApiImg}/${value.imagePath}`,
            adsPath: ads,
            adsName: value.ads?.name,
            partnerImg: value.partnerImg
              ? `${environment.urlApiImg}/${value.partnerImg}`
              : `${environment.urlBaseApp}/profile.jpeg`,
            partnerName: value.partnerName,
            artistsImage: `${environment.urlApiImg}/${value.artists[0].imagePath}`,
            adsImage: value.ads?.adsImages
              ? `${environment.urlApiImg}/${value.ads?.adsImages}`
              : `${environment.urlBaseApp}/profile.jpeg`,
            adsLink: value.ads?.url,
            view: value.view,
            artistSlug: value.artists[0].slug,
            albumSlug: value.album?.slug,
            description: "",
            playingURL: `${environment.urlNimbleVideo}/${value.video}`,
            date: new Date().getTime().toString(),
          } as Video;

          if (isRe) {
            this.queues.unshift(video);
            if (this.isRoom) {
              const videoId: string[] = [];
              const idQueue = await karaokePageService.addQueueToRoom(
                this.queues[0].id,
              );
              this.queues[0].idQueue = idQueue.id;
              this.queues.forEach((e) => {
                videoId.push(e.id);
              });
              const queue = await karaokePageService.updateQueue(videoId);
              queue.ids.forEach((e, index) => {
                this.queues[index].idQueue = e;
              });
            }
          } else if (this.isRoom) {
            const idQueue = await karaokePageService.addQueueToRoom(video.id);
            video.idQueue = idQueue.id;
            this.queues.push(video);
          } else {
            this.queues.push(video);
          }
        }
      });

      if (this.playing == null) {
        this.nextVideo();
        this.isActiveRecommended = true;
      }
      showSweetAlert("บันทึกไปที่คิวแล้ว", "info", 1000, false, "top-end");
    },

    async nextVideo() {
      if (this.queues.length > 0) {
        await videoService.getBySlug(this.queues[0].slug).then((value) => {
          let ads = null;
          if (value.ads != null) {
            this.isAds = true;
            ads = `${environment.urlNimbleAds}/${value.ads?.videoPath}`;
          }
          if (value.artists) {
            this.playing = {
              id: value.id,
              idAd: value.ads?.id,
              name: value.name,
              slug: value.slug,
              artists: value.artists?.map((value) => `${value.name}`).join(),
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
              adsPath: ads,
              adsName: value.ads?.name,
              partnerImg: value.partnerImg
                ? `${environment.urlApiImg}/${value.partnerImg}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              partnerName: value.partnerName,
              artistsImage: `${environment.urlApiImg}/${value.artists[0].imagePath}`,
              adsImage: value.ads?.adsImages
                ? `${environment.urlApiImg}/${value.ads?.adsImages}`
                : `${environment.urlBaseApp}/profile.jpeg`,
              artistSlug: value.artists[0].slug,
              adsLink: value.ads?.url,
              description: value.description,
              view: value.view,
              playingURL: `${environment.urlNimbleVideo}/${value.video}`,
              date: new Date().getTime().toString(),
            } as Video;

            this.artisVideos = value.videosByArtist.map((value) => {
              return {
                id: value.id,
                name: value.name,
                slug: value.slug,
                artists: value.artists?.map((value) => `${value.name}`).join(),
                albumSlug: value.album?.slug,
                view: value.view,
                imageURL: `${environment.urlApiImg}/${value.imagePath}`,
                date: new Date().getTime().toString(),
              } as Video;
            });
          }
          this.error = null;
        });
        this.isActiveRecommended = false;
        this.isActiveArtists = true;
        if (this.isRoom) {
          await karaokePageService.deleteQueue(this.queues[0].idQueue);
        }
        this.queues.shift();
      } else {
        this.isAds = false;
        this.playing = null;
        this.isActiveRecommended = true;
      }
      return this.playing;
    },

    async removeQueue(index: number) {
      if (this.isRoom) {
        await karaokePageService.deleteQueue(this.queues[index].idQueue);
        this.queues.splice(index, 1);
      } else {
        this.queues.splice(index, 1);
      }

      showSweetAlert("ลบออกจากคิว", "info", 1000, false, "top-end");
    },
    removeQueueForRemote(index: number) {
      this.queues.splice(index, 1);

      showSweetAlert("ลบออกจากคิว", "info", 1000, false, "top-end");
    },

    async clearQueues() {
      this.queues.splice(0, this.queues.length);
      showSweetAlert(
        "ลบเพลงออกจากคิวทั้งหมดแล้ว",
        "info",
        1000,
        false,
        "top-end",
      );
      if (this.isRoom) {
        await karaokePageService.deleteQueueAll();
      }
    },

    async removeVideoPlaying() {
      if (this.isAds === true && this.playing === null) {
        this.isAds = false;
      }
      await this.nextVideo();
      showSweetAlert("ลบเพลงออกจากการเล่น", "info", 1000, false, "top-end");
    },

    async moveUpQueue(index: number) {
      if (index > 0) {
        const f = this.queues.splice(index, 1)[0];
        this.queues.splice(index - 1, 0, f);
      }

      if (this.isRoom) {
        const videoId: string[] = [];
        this.queues.forEach((e) => {
          videoId.push(e.id);
        });

        const queue = await karaokePageService.updateQueue(videoId);
        queue.ids.forEach((e, index) => {
          this.queues[index].idQueue = e;
        });
      }
    },
    goBack() {
      this.isSeeMore = false;
      this.isArtist = false;
      this.isLoading = false;
      this.isPlaylist = false;
    },
    async getPlayLists(slug: string) {
      await playlistPageService.getBySlug(slug).then((value) => {
        this.nameArtis = value.name;
        this.isPlaylist = true;
        this.isSeeMore = true;
        this.playlistData = value;
      });
    },
    getVideoArtisList(val: boolean) {
      this.isActiveArtists = val;
      this.isActiveRecommended = false;
    },
    getVideoRecommendedList(val: boolean) {
      this.isActiveArtists = false;
      this.isActiveRecommended = val;
    },
    async getArtist(slug: string) {
      this.isLoading = true;
      this.isSeeMore = true;
      await videoService
        .getArtisBySlug(slug)
        .then((value) => {
          this.isArtist = true;
          this.newReleaseVideo = value.results.map((value) => {
            this.nameArtis = value.artists![0].name;
            return {
              id: value.id,
              link: value.slug,
              name: value.name,
              artist: "",
              imageURL: `${environment.urlApiImg}/${value.imagePath}`,
            } as PlaylistMusicItem;
          });

          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    generateRandomText(length: number) {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    },
  },
});
