<script setup lang="ts">
import "video.js/dist/video-js.css";
import "global/window.js";
import * as CryptoJS from "crypto-js";
import { debounce } from "@antfu/utils";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { defineProps, ref } from "vue";
import uuid4 from "uuid4";
import type { LocationQueryValue } from "vue-router";
import { useKaraokeStore, type Video } from "~/store/useKaraokeStore";
import { useVideoStore } from "~/store/useVideoStore";
import { environment } from "~/services/environments";
import { useAdsStore } from "~/store/useAdsStore";
import QrcodeModal from "~/components/modal/qrcode/qrcodeModal.vue";
import { useRemoteStore } from "~/store/useRemoteStore";

// Store
const karaokeStore = useKaraokeStore();
const htmlVideo = ref<HTMLElement>();
const videoStore = useVideoStore();
const videoAdsStore = useAdsStore();

const remoteStore = useRemoteStore();
let jwPlayer: any = null;
let socketIo: any = null;

// VideoConfig
const isStartPage = ref<boolean>(false);
const isPlayingVideo = ref<boolean>(false);
const isHideControlBar = ref<boolean>(false);
const isHideVolumeControl = ref<boolean>(true);
const isMusicOnly = ref<boolean>(false);
const isFullScreen = ref<boolean>(false);
const indexSelect = ref<number>(0);
const isCinema = ref<boolean>(false);
const htmlPlayerContainer = ref<any>(null);
const htmlProgress = ref<any>(null);
const htmlProgressAds = ref<any>(null);
const videoCurrentTiming = ref<string>("00:00");
const videoDurationTotal = ref<string>("00:00");
const isVideoNearEnding = ref<boolean>(false);
const isShowSpinner = ref<string>("");
const volume = ref<any>();
const isMute = ref<boolean>(false);
const isHideAlert = ref<boolean>(true);
const isOpen = ref<boolean>(false);
const textAlert = ref<string>("");
const { isWindows, isMacOS } = useDevice();

const uuid = uuid4();

const bufferPercent = ref<number>(0);
const duration = ref<number>(0);
const timePlay = ref<number>(0);
const timeSeek = ref<number>(0);

const isShowSearchFullScreen = ref<boolean>(false);
const searchVideo = ref("");
const htmlInputShowSearch = ref<HTMLInputElement>();
const counting = ref(false);
const isCounting = ref(true);

const isClickAd = ref(false);
const isVideoAd = ref(true);
const isPlayAd = ref(true);
const isLoadVideo = ref(false);
const isHideInfo = ref(false);
const totalTimeWatched = ref(0);
const previousPosition = ref(0);
const timeAds = ref(0);
const timeString = ref("1");
const urlRemote = ref("");

const isRenderFinish = ref(false);
const isSeeMore = ref(false);
const props = defineProps<{
  queryVideoParam: string | LocationQueryValue[];
  timeCounting: number;
  slugNextQueueSocket: string;
  slugPlayNowSocket: string;
  removeQueueAllSocket: string;
  removeVideoPlayingSocket: string;
  removeQueueByIndexSocket: string;
  moveQueueByIndexSocket: string;
  moveQueuePlayNextSocket: string;
  timeContinue: number;
  progress: (event: any) => void;
  displayCinema: (event: any) => void;
}>();

onMounted(() => {
  window.addEventListener("click", closeDropdown);
  remoteStore.createRoom();
  // SOCKET

  socketIo = io(environment.urlSocket, {
    query: {
      userId: "owner-room", // Replace 'user123' with the actual user ID
      roomName: remoteStore.room,
    },
  });
  urlRemote.value =
    environment.urlBaseApp + "/remote-controls/" + remoteStore.room;

  socketIo.on("connect", () => {
    socketIo.emit("joinRoom", remoteStore.room);
  });
  if (karaokeStore.playing) {
    socketIo.emit(
      "sendMessage",
      "playing_" +
        karaokeStore.playing.slug +
        "_" +
        JSON.stringify(karaokeStore.queues ?? []) +
        "_" +
        isPlayingVideo.value +
        "_" +
        isMusicOnly.value +
        "_100_" +
        isCinema.value +
        "_" +
        isCounting.value +
        "@" +
        karaokeStore.isAds +
        "@" +
        isVideoAd.value,
    );
  } else {
    socketIo.emit("sendMessage", "playing_no");
  }
  if (isMusicOnly.value) {
    socketIo.emit("sendMessage", "currentAudioTrack_true");
  } else {
    socketIo.emit("sendMessage", "currentAudioTrack_false");
  }

  timeAds.value = props.timeCounting;
  let file;
  if (karaokeStore.playing?.adsPath) {
    file = karaokeStore.playing?.adsPath;
  } else if (karaokeStore.playing?.playingURL) {
    file = karaokeStore.playing?.playingURL;
  } else {
    file = karaokeStore.defaultVideoURL;
  }
  jwPlayer = jwplayer(htmlVideo.value).setup({
    file: file.toString(),
    autostart: true,
    allowFullscreen: true,
    controls: false,
    floating: {
      dismissible: true,
    },
  });
  jwPlayer.resize("100%", 647);
  jwPlayer.setVolume(100);
  duration.value = jwPlayer.getDuration();

  socketIo.on("message", (message: string) => {
    const data = message.split("_")[0];
    switch (data) {
      case "queue":
        karaokeStore.nextVideoRe(message.split("_")[1], false);
        break;
      case "joined":
        if (karaokeStore.playing) {
          socketIo.emit(
            "sendMessage",
            "playing_" +
              karaokeStore.playing.slug +
              "_" +
              JSON.stringify(karaokeStore.queues ?? []) +
              "_" +
              isPlayingVideo.value +
              "_" +
              isMusicOnly.value +
              "_" +
              jwPlayer.getVolume() +
              "_" +
              isCinema.value +
              "_" +
              isCounting.value +
              "@" +
              karaokeStore.isAds +
              "@" +
              isVideoAd.value,
          );
        } else {
          socketIo.emit("sendMessage", "playing_no");
        }
        if (isMusicOnly.value) {
          socketIo.emit("sendMessage", "currentAudioTrack_true");
        } else {
          socketIo.emit("sendMessage", "currentAudioTrack_false");
        }
        break;

      case "playingNow":
        karaokeStore.playVideo(message.split("_")[1]);
        break;

      case "removeAll":
        karaokeStore.queues.splice(0, karaokeStore.queues.length);
        break;

      case "removeVideoPlaying":
        karaokeStore.removeVideoPlaying();
        break;

      case "removeQueueByIndex":
        karaokeStore.removeQueue(parseInt(message.split("_")[1]));
        break;

      case "onplay":
        if (parseInt(message.split("_")[1]) === 1) {
          handlePlayVideo(true);
        } else {
          handlePlayVideo(false);
        }
        break;

      case "volume":
        jwPlayer.setVolume(parseInt(message.split("_")[1]));
        volume.value.value = parseInt(message.split("_")[1]);
        if (parseInt(message.split("_")[1]) === 0) {
          isMute.value = true;
        } else {
          isMute.value = false;
        }
        break;

      case "moveUpQueueIndex":
        karaokeStore.moveUpQueue(parseInt(message.split("_")[1]));

        break;

      case "currentAudioTrack":
        if (message.split("_")[1] === "false") {
          isMusicOnly.value = false;
          jwPlayer.setCurrentAudioTrack(0);
        } else {
          isMusicOnly.value = true;
          jwPlayer.setCurrentAudioTrack(2);
        }

        break;

      case "nextSongNow":
        karaokeStore.nextVideo();

        break;

      case "fullscreen":
        openCinema();
        break;

      case "moveQueuePlayNext":
        karaokeStore.nextVideoRe(message.split("_")[1], true);
        break;

      case "nextAdsNow":
        playVideo();
        break;

      default:
    }
  });

  if (karaokeStore.playing === null) {
    jwPlayer.load({
      file: environment.urlVideoTempNoSongs,
    });
  }

  if (karaokeStore.isAds) {
    isVideoAd.value = true;
  } else {
    isVideoAd.value = false;
  }

  jwPlayer.on("ready", function () {});

  jwPlayer.on("meta", function () {
    jwPlayer.setFloating(false);

    isRenderFinish.value = true;
    isLoadVideo.value = true;
  });

  jwPlayer.on("play", function () {
    duration.value = jwPlayer.getDuration();
    isPlayingVideo.value = true;
    socketIo.emit("sendMessage", "onplay_1");
    if (isVideoAd.value === true) {
      const adsDetail = document.getElementById(
        "ads-detail",
      ) as HTMLInputElement;
      adsDetail.style.display = "block";
      isPlayAd.value = false;
      if (karaokeStore.playing != null) {
        counting.value = true;
      }
    }

    if (isMusicOnly.value) {
      jwPlayer.setCurrentAudioTrack(2);
    } else {
      jwPlayer.setCurrentAudioTrack(0);
    }
  });

  jwPlayer.on("seek", function (e) {
    previousPosition.value = e.offset;
    isShowSpinner.value = "block";
  });

  jwPlayer.on("seeked", function () {
    isShowSpinner.value = "none";
    jwPlayer.play();
  });

  jwPlayer.on("displayClick", function () {
    if (isPlayingVideo.value) {
      handlePlayVideo(false);
    } else {
      handlePlayVideo(true);
    }
  });
  jwPlayer.on("bufferChange", function (e) {
    bufferPercent.value = e.bufferPercent;
  });

  jwPlayer.on("time", async function (e) {
    const { position } = e;
    timePlay.value = position;

    totalTimeWatched.value += position - previousPosition.value;
    previousPosition.value = position;
    if (timeString.value !== totalTimeWatched.value.toString().split(".")[0]) {
      timeString.value = totalTimeWatched.value.toString().split(".")[0];
      if (timeString.value === "60") {
        if (isVideoAd.value === false) {
          const id = uuid4();
          await karaokeStore.postViewVideo(
            CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
          );
        }
      }
    }
    await updateProgress();
  });

  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
      exitFullScreen();
    }
  });

  document.addEventListener("keyup", function (e) {
    if (isFullScreen.value) {
      switch (e.key) {
        case "F1":
          isHideInfo.value = !isHideInfo.value;

          break;

        case " ":
          isPlayingVideo.value = !isPlayingVideo.value;
          handlePlayVideo(isPlayingVideo.value);
          isPlayingVideo.value ? textAlertShow("เล่น") : textAlertShow("หยุด");

          break;

        case "-":
          jwPlayer.setVolume(jwPlayer.getVolume() - 5);
          volume.value.value = jwPlayer.getVolume();
          textAlertShow("ลดเสียง " + jwPlayer.getVolume());

          break;

        case "+":
          jwPlayer.setVolume(jwPlayer.getVolume() + 5);
          volume.value.value = jwPlayer.getVolume();
          textAlertShow("เพิ่มเสียง " + jwPlayer.getVolume());

          break;

        case "_":
          jwPlayer.setVolume(jwPlayer.getVolume() - 5);
          volume.value.value = jwPlayer.getVolume();
          textAlertShow("ลดเสียง " + jwPlayer.getVolume());
          socketIo.emit("sendMessage", "volume_" + jwPlayer.getVolume());
          break;

        case "=":
          jwPlayer.setVolume(jwPlayer.getVolume() + 5);
          volume.value.value = jwPlayer.getVolume();
          textAlertShow("เพิ่มเสียง " + jwPlayer.getVolume());
          socketIo.emit("sendMessage", "volume_" + jwPlayer.getVolume());

          break;

        case "ข":
          jwPlayer.setVolume(jwPlayer.getVolume() - 5);
          volume.value.value = jwPlayer.getVolume();
          textAlertShow("ลดเสียง " + jwPlayer.getVolume());
          socketIo.emit("sendMessage", "volume_" + jwPlayer.getVolume());
          break;

        case "ช":
          jwPlayer.setVolume(jwPlayer.getVolume() + 5);
          volume.value.value = jwPlayer.getVolume();
          textAlertShow("เพิ่มเสียง " + jwPlayer.getVolume());
          socketIo.emit("sendMessage", "volume_" + jwPlayer.getVolume());

          break;

        case "F10":
          isMusicOnly.value = !isMusicOnly.value;
          if (isMusicOnly.value) {
            jwPlayer.setCurrentAudioTrack(2);
            textAlertShow("ปิดเสียงร้อง");
            socketIo.emit("sendMessage", "currentAudioTrack_true");
          } else {
            jwPlayer.setCurrentAudioTrack(0);
            textAlertShow("เปิดเสียงร้อง");
            socketIo.emit("sendMessage", "currentAudioTrack_false");
          }

          break;

        case "F2":
          isShowSearchFullScreen.value = true;

          setTimeout(() => {
            htmlInputShowSearch.value?.focus();
          }, 500);

          break;

        case "ArrowUp":
          if (indexSelect.value > 1) {
            if (indexSelect.value !== 0) {
              indexSelect.value = indexSelect.value - 1;
            }
          }

          break;

        case "ArrowDown":
          if (indexSelect.value < videoStore.searchResult.length - 1) {
            indexSelect.value = indexSelect.value + 1;
          }
          break;

        case "ArrowRight":
          karaokeStore.nextVideo();
          textAlertShow("กำลังเล่นเพลงถัดไป");
          socketIo.emit(
            "sendMessage",
            "nextVideo_" + remoteStore.generateRandomText(3),
          );
          break;

        case "Enter":
          if (isFullScreen.value) {
            karaokeStore.playVideo(
              videoStore.searchResult[indexSelect.value].slug,
            );
            isShowSearchFullScreen.value = false;
            textAlertShow("กำลังเล่นเพลงนี้");
          }

          break;

        default:
      }
    }
  });
});

function toggleDropdown() {
  const dropdownMobile = document.getElementById(
    "dropdown-mobile",
  ) as HTMLInputElement;

  dropdownMobile.style.display = "block";
}

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".control-end-mobile-container")) {
    const dropdownMobile = document.getElementById(
      "dropdown-mobile",
    ) as HTMLInputElement;

    dropdownMobile.style.display = "none";
  }
}

onBeforeUnmount(() => {
  jwPlayer.stop();
  jwPlayer.remove();
});
onUnmounted(() => {
  karaokeStore.playing = null;
  isClickAd.value = false;
  karaokeStore.queues = [];
  totalTimeWatched.value = 0;
  previousPosition.value = 0;
  socketIo.emit("sendMessage", "leaveRoom");
  socketIo.close();
});

// Watch
watch(
  () => timeSeek.value,
  () => {
    jwPlayer.seek(timeSeek.value);
  },
);

watch(
  () => props.slugNextQueueSocket,
  () => {
    socketIo.emit(
      "sendMessage",
      "addQueue_" + props.slugNextQueueSocket + "_" + isPlayingVideo.value,
    );
  },
);

watch(
  () => props.slugPlayNowSocket,
  () => {
    socketIo.emit("sendMessage", "playingNow_" + props.slugPlayNowSocket);
  },
);

watch(
  () => props.removeQueueAllSocket,
  () => {
    socketIo.emit("sendMessage", props.removeQueueAllSocket);
  },
);

watch(
  () => props.removeQueueByIndexSocket,
  () => {
    socketIo.emit("sendMessage", props.removeQueueByIndexSocket);
  },
);

watch(
  () => props.moveQueueByIndexSocket,
  () => {
    socketIo.emit("sendMessage", props.moveQueueByIndexSocket);
  },
);

watch(
  () => props.removeVideoPlayingSocket,
  () => {
    socketIo.emit("sendMessage", props.removeVideoPlayingSocket);
  },
);

watch(
  () => props.moveQueuePlayNextSocket,
  () => {
    socketIo.emit("sendMessage", props.moveQueuePlayNextSocket);
  },
);

watch(
  () => karaokeStore.playing,
  () => {
    if (karaokeStore.playing === null) {
      isPlayAd.value = false;

      setTimeout(() => {
        jwPlayer.load({
          file: karaokeStore.defaultVideoURL,
        });
        jwPlayer.play();
      }, 500);
      jwPlayer.play();
    }

    isHideControlBar.value = true;

    if (isMusicOnly.value) {
      socketIo.emit("sendMessage", "currentAudioTrack_true");
    } else {
      socketIo.emit("sendMessage", "currentAudioTrack_false");
    }

    if (karaokeStore.isAds) {
      isVideoAd.value = true;
      isCounting.value = true;
      timeAds.value = 10000;
      if (isMute.value) {
        isMute.value = !isMute.value;
        jwPlayer.setVolume(50);
        volume.value.value = 50;
      }

      if (props.queryVideoParam === "") {
        handlePlayVideoAd(true);
        isPlayAd.value = false;
      }
      if (karaokeStore.queues.length !== 0) {
        handlePlayVideoAd(true);
      }
    } else if (props.queryVideoParam === "") {
      isPlayingVideo.value = true;
    }
    totalTimeWatched.value = 0;
    previousPosition.value = 0;
    if (karaokeStore.isAds) {
      jwPlayer.load({
        file: karaokeStore.playing?.adsPath ?? karaokeStore.playing?.playingURL,
      });
    } else if (karaokeStore.playing) {
      jwPlayer.load({
        file: karaokeStore.playing?.playingURL,
      });
    }

    if (isRenderFinish.value) {
      jwPlayer.play();
    }
  },
  {
    deep: true,
  },
);

watch(searchVideo, (value) => {
  getSearch(value);
  indexSelect.value = 0;

  if (value === "") {
    isShowSearchFullScreen.value = false;
  }
});

const getSearch = debounce(300, (value: string) => {
  videoStore.get(value);
});
const playVideo = async () => {
  if (isClickAd.value === false) {
    const id = uuid4();
    await karaokeStore.posView(
      CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
    );
  }
  const adsDetail = document.getElementById("ads-detail") as HTMLInputElement;
  adsDetail.style.display = "none";
  jwPlayer.load({
    file: karaokeStore.playing?.playingURL,
  });
  isVideoAd.value = false;
  counting.value = false;
  isStartPage.value = true;
  isClickAd.value = false;
  if (isStartPage.value) {
    handlePlayVideo(true);
  } else {
    handlePlayVideo(false);
    isStartPage.value = true;
  }
};

const handleMusicOnly = () => {
  if (isMusicOnly.value) {
    jwPlayer.setCurrentAudioTrack(0);
    socketIo.emit("sendMessage", "currentAudioTrack_false");
    isMusicOnly.value = false;
  } else {
    jwPlayer.setCurrentAudioTrack(2);
    socketIo.emit("sendMessage", "currentAudioTrack_true");
    isMusicOnly.value = true;
  }
};

const handlePlayVideo = (isPlay: boolean) => {
  if (isPlay) {
    jwPlayer.play();
    isPlayingVideo.value = true;
    isHideControlBar.value = true;
    counting.value = true;
    socketIo.emit("sendMessage", "onplay_1");
  } else {
    jwPlayer.pause();
    isPlayingVideo.value = false;
    counting.value = false;
    isHideControlBar.value = false;
    socketIo.emit("sendMessage", "onplay_0");
  }
};

const handlePlayVideoAd = (isPlay: boolean) => {
  if (karaokeStore.playing != null) {
    isVideoAd.value = true;
  }

  if (isPlay) {
    jwPlayer.play();
  } else {
    jwPlayer.pause();
    if (karaokeStore.playing != null) {
      counting.value = false;
    }
  }
  if (props.queryVideoParam === "") {
    if (karaokeStore.playing != null) {
      counting.value = true;
    }
  }
};

const handleGoToAds = async () => {
  if (isVideoAd.value === true) {
    await navigateTo(karaokeStore.playing?.adsLink, {
      open: {
        target: "_blank",
      },
    });
    if (isClickAd.value === false && counting.value === true) {
      isClickAd.value = true;
      const id = uuid4();
      await karaokeStore.postClick(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
      await karaokeStore.posView(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
    } else if (isClickAd.value === false && counting.value === false) {
      isClickAd.value = true;
      const id = uuid4();
      await karaokeStore.postClick(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
    } else {
      const id = uuid4();
      await karaokeStore.postClick(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
    }
  }
};

const handleGoToAdsOnBroad = async () => {
  await navigateTo(karaokeStore.playing?.adsLink, {
    open: {
      target: "_blank",
    },
  });
  if (isVideoAd.value === true) {
    if (isClickAd.value === false && counting.value === true) {
      isClickAd.value = true;
      const id = uuid4();
      await karaokeStore.postClick(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
      await karaokeStore.posView(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
    } else if (isClickAd.value === false && counting.value === false) {
      isClickAd.value = true;
      const id = uuid4();
      await karaokeStore.postClick(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
    } else {
      const id = uuid4();
      await karaokeStore.postClick(
        CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
      );
    }
  } else {
    const id = uuid4();
    await karaokeStore.postClick(
      CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
    );
  }
};

const onFullScreen = () => {
  const refHtml = htmlPlayerContainer.value;
  if (refHtml) {
    if (!refHtml.fullscreenElement && !refHtml.webkitFullscreenElement) {
      isFullScreen.value = true;
      if (refHtml.requestFullscreen) {
        jwPlayer.resize("100%", "100%");
        refHtml.requestFullscreen();
      } else if (refHtml.webkitRequestFullscreen) {
        jwPlayer.resize("100%", "100%");
        refHtml.webkitRequestFullscreen();
      }
    }
  }
  setTimeout(() => {
    isHideInfo.value = true;
  }, 5000);
};

const exitFullScreen = () => {
  isFullScreen.value = false;
  isHideInfo.value = false;
  isShowSearchFullScreen.value = false;
  searchVideo.value = "";
  document.exitFullscreen();
};

const setTimeoutHideVolumeControl = () => {
  setTimeout(() => {
    isHideVolumeControl.value = true;
  }, 5000);
};

const handleSeek = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  timeSeek.value = parseFloat(inputElement.value);
};

const updateProgress = async () => {
  const currentTime = jwPlayer.getPosition();
  const duration = jwPlayer.getDuration();
  const progress = (currentTime / duration) * 100;

  videoCurrentTiming.value = convertMinutesToTime(currentTime);
  const htmlSeekbarVideo = document.getElementById(
    "seek-video",
  ) as HTMLInputElement;
  const minValue = parseFloat(htmlSeekbarVideo.min);
  const maxValue = parseFloat(htmlSeekbarVideo.max);
  const currentValue = parseFloat(htmlSeekbarVideo.value);

  const pokemonPichu =
    ((currentValue - minValue) / (maxValue - minValue)) * 100;
  htmlSeekbarVideo.value = String(pokemonPichu);
  const htmlProgressAds = document.getElementById(
    "htmlProgressAds",
  ) as HTMLInputElement;
  htmlProgressAds.value = String(pokemonPichu);
  if (isVideoAd.value) {
    htmlSeekbarVideo.style =
      "--load-progress-percent:" +
      bufferPercent.value +
      "%; --percent: " +
      pokemonPichu +
      "%; display:none";

    htmlProgressAds.style.display = "block";
  } else {
    htmlSeekbarVideo.style =
      "--load-progress-percent:" +
      bufferPercent.value +
      "%; --percent: " +
      pokemonPichu +
      "%; display:block;";
    htmlProgressAds.style.display = "none";
  }

  isVideoNearEnding.value = progress >= 95;
  videoDurationTotal.value = convertMinutesToTime(jwPlayer.getDuration());

  if (jwPlayer.getPosition() >= jwPlayer.getDuration()) {
    const htmlControlMain = document.getElementById(
      "control-main",
    ) as HTMLInputElement;
    const htmlSeekVideo = document.getElementById(
      "seek-video",
    ) as HTMLInputElement;
    htmlSeekVideo.style.display = "block";
    htmlControlMain.style.display = "block";

    if (isVideoAd.value === true) {
      setTimeout(() => {
        jwPlayer.load({
          file: karaokeStore.playing?.playingURL,
        });
        jwPlayer.play();
        isPlayingVideo.value = true;
      }, 500);
      isVideoAd.value = false;
      const adsDetail = document.getElementById(
        "ads-detail",
      ) as HTMLInputElement;
      adsDetail.style.display = "none";
    } else {
      await karaokeStore.nextVideo().then((e) => {
        socketIo.emit(
          "sendMessage",
          "nextVideo_" + remoteStore.generateRandomText(3),
        );
        if (karaokeStore.isAds) {
          isVideoAd.value = true;
          if (e !== null) {
            totalTimeWatched.value = 0;
            previousPosition.value = 0;
            timeString.value = "";
          } else {
            isClickAd.value = false;
            const htmlAdPlayStart = document.getElementById(
              "ad-player-start",
            ) as HTMLInputElement;
            htmlAdPlayStart.style.display = "none";
            const adsDetail = document.getElementById(
              "ads-detail",
            ) as HTMLInputElement;
            adsDetail.style.display = "none";
          }
        }
      });
    }
  }
};
const convertMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.ceil(minutes % 60);
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes =
    remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
  return `${formattedHours}:${formattedMinutes}`;
};

const videoPlayerVolume = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  jwPlayer.setVolume(parseFloat(inputElement.value));
  socketIo.emit("sendMessage", "volume_" + inputElement.value);
  if (parseFloat(inputElement.value) > 0) {
    isMute.value = false;
  } else {
    isMute.value = true;
  }
};

const onCountdownEnd = async () => {
  const id = uuid4();
  counting.value = false;
  isCounting.value = false;
  karaokeStore.isAds = false;
  if (isClickAd.value === false) {
    isClickAd.value = true;
    await karaokeStore.posView(
      CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
    );
  }
  socketIo.emit("sendMessage", "nextAdsNow_true");
};

const convertToK = (number: number) => {
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number;
  }
};

const volumeMute = () => {
  isMute.value = !isMute.value;
  jwPlayer.setVolume(0);
  volume.value.value = 0;
  if (!isMute.value) {
    jwPlayer.setVolume(50);
    volume.value.value = 50;
  }
};

const seeMore = () => {
  const infoDescription = document.getElementById("info-p") as HTMLInputElement;
  isSeeMore.value = !isSeeMore.value;

  if (isSeeMore.value) {
    infoDescription.style =
      "    display: -webkit-box;\n" +
      "    -webkit-line-clamp: unset;\n" +
      "    -webkit-box-orient: vertical;\n" +
      "    overflow: hidden;" +
      "height: 100%";
  } else {
    infoDescription.style =
      "    display: -webkit-box;\n" +
      "    -webkit-line-clamp: 3;\n" +
      "    -webkit-box-orient: vertical;\n" +
      "    overflow: hidden;" +
      "height: 54px";
  }
};

const openCinema = () => {
  isCinema.value = !isCinema.value;
  props.displayCinema(isCinema.value);
};

const openInfo = () => {
  isHideInfo.value = !isHideInfo.value;
};

const onImgError = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  inputElement.src = "../../../../assets/images/icons/profile/profile.jpeg";
};

const textAlertShow = (text: string) => {
  textAlert.value = text;
  isHideAlert.value = false;

  setTimeout(() => {
    isHideAlert.value = true;
  }, 500);
  if (jwPlayer.getVolume() > 0) {
    isMute.value = false;
  } else {
    isMute.value = true;
  }
};
</script>

<template>
  <div class="container-video">
    <div id="htmlPlayerContainer" ref="htmlPlayerContainer" class="player">
      <div ref="htmlVideo"></div>
      <div v-if="isWindows || (isMacOS && isOpen)">
        <QueueuListFullscreen
          v-if="isFullScreen && isVideoNearEnding"
        ></QueueuListFullscreen>
      </div>

      <div v-if="isWindows || (isMacOS && isOpen)">
        <RecommendedSongs
          v-if="isFullScreen && isVideoNearEnding"
          :add-queue="
            (slug: string) => {
              textAlertShow('บันทึกไปที่คิวแล้ว' + slug);
              socketIo.emit(
                'sendMessage',
                'addQueue_' + slug + '_' + isPlayingVideo,
              );
            }
          "
        ></RecommendedSongs>
      </div>
      <div v-if="isWindows || (isMacOS && isOpen)">
        <Help
          v-if="isFullScreen"
          :is-hide-info="isHideInfo"
          :open-info="openInfo"
        ></Help>
      </div>
      <AlertFullscreen
        :is-hide-alert="isHideAlert"
        :text="textAlert"
      ></AlertFullscreen>

      <div v-if="karaokeStore.playing" id="ads-detail" style="display: none">
        <div class="ads-detail">
          <img
            :src="karaokeStore.playing.adsImage"
            class="ads-detail-pro-image"
            alt="pro-image"
          />
          <div>
            <p class="ads-detail-title">{{ karaokeStore.playing?.adsName }}</p>
            <p class="ads-detail-link">{{ karaokeStore.playing?.adsLink }}</p>
          </div>
          <button class="ads-click" @click="handleGoToAds">Open</button>
        </div>
      </div>

      <img
        v-if="isLoadVideo"
        src="../../../../assets/images/icons/logo/logo.png"
        alt="Image"
        class="image"
      />
      <div
        v-if="isPlayAd && karaokeStore.playing?.adsPath"
        id="ad-player-start"
        class="ad-player-start"
      >
        <img
          class="play-icon cursor"
          src="../../../../assets/images/icons/play-circle.png"
          alt="Image"
          @click="handlePlayVideoAd(true)"
        />
      </div>
      <div
        v-if="isVideoAd && !isPlayAd && karaokeStore.playing?.adsPath"
        class="ad-player-skip"
      >
        <div v-if="!isCounting">
          <button class="btn ad-btn-skip" @click="playVideo()">
            <span class="font-subtitle-3 skip-text">ข้ามโฆษณา</span>
            <img
              src="assets/images/icons/next.png"
              alt="icon-verified"
              class="icon-verified"
            />
          </button>
        </div>
        <div v-if="isCounting">
          <button class="btn ad-btn-skip font-subtitle-3" disabled>
            ข้ามโฆษณา
            <vue-countdown
              v-if="counting"
              v-slot="{ totalSeconds }"
              :time="
                timeCounting != props.timeContinue
                  ? props.timeContinue * 1000
                  : timeCounting
              "
              @end="onCountdownEnd"
              @progress="props.progress"
            >
              {{ totalSeconds }}
            </vue-countdown>
            <div v-if="!counting">
              {{
                timeCounting != props.timeContinue
                  ? props.timeContinue
                  : timeCounting / 1000
              }}
            </div>
          </button>
        </div>
      </div>
      <div class="loading-center">
        <div class="loading-spinner" :style="{ display: isShowSpinner }"></div>
      </div>

      <div
        v-if="isFullScreen && isShowSearchFullScreen"
        class="search-card group-search"
      >
        <div class="icon-input">
          <input
            id="inputField"
            ref="htmlInputShowSearch"
            v-model="searchVideo"
            class="form-control"
            placeholder="Search playlists"
          />
          <span class="icon-suffix">
            <i class="las la-search icon"></i>
          </span>
        </div>
        <div
          v-if="videoStore.searchResult && videoStore.searchResult.length > 0"
          class="list-card"
        >
          <div class="search-list">
            <div
              v-for="(item, index) in videoStore.searchResult"
              :key="index"
              class="list-item"
              :class="{ 'list-active': indexSelect == index }"
            >
              <div v-if="!item.ads" class="item-card">
                <i
                  class="las la-plus icon"
                  @click="
                    () => {
                      karaokeStore.addVideoForScreen({
                        name: item.title,
                        artists: item.description,
                        slug: item.slug,
                        imageURL: item.imageURL,
                      } as Video);
                      textAlertShow('บันทึกไปที่คิวแล้ว');
                      socketIo.emit(
                        'sendMessage',
                        'addQueue_' + item.slug + '_' + isPlayingVideo,
                      );
                      isShowSearchFullScreen = false;
                    }
                  "
                ></i>
                <img :src="item.imageURL" alt="img-music" class="img-music" />
                <div class="text-music">
                  <p class="title">{{ item.title }}</p>
                  <p class="detail">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="
          isVideoNearEnding &&
          karaokeStore.queues.length > 0 &&
          isVideoAd != true
        "
        class="next-container"
      >
        <div class="next-card">
          <p class="font-subtitle-3">เพลงถัดไป</p>
          <div class="next-item">
            <div class="item-card">
              <div class="item-content">
                <img
                  :src="karaokeStore.queues[0].imageURL"
                  alt="img-music"
                  class="img-music"
                />
                <div class="item-title">
                  <p class="title">{{ karaokeStore.queues[0].name }}</p>
                  <p class="detail">
                    {{ karaokeStore.queues[0].artists }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="next-button">
            <button
              class="btn btn-play"
              @click="
                () => {
                  if (karaokeStore.isAds) {
                    (isVideoAd = true), (isClickAd = false);
                  }
                  socketIo.emit(
                    'sendMessage',
                    'nextVideo_' + remoteStore.generateRandomText(3),
                  );
                  karaokeStore.nextVideo();
                }
              "
            >
              เล่น
            </button>
          </div>
        </div>
      </div>
      <div
        id="control-main"
        class="control-main"
        :class="{ 'control-main-hid': isHideControlBar }"
      >
        <div class="control">
          <div class="control-start">
            <img
              v-if="!isPlayingVideo"
              class="play-icon cursor"
              src="../../../../assets/images/icons/play-circle.png"
              alt="play-icon"
              @click="handlePlayVideo(true)"
            />

            <img
              v-if="isPlayingVideo"
              class="on-icon cursor"
              src="../../../../assets/images/icons/on-music.png"
              alt="on-icon"
              @click="handlePlayVideo(false)"
            />

            <img
              src="../../../../assets/images/icons/skip_next.png"
              alt="next-icon"
              class="next-icon cursor"
              @click="
                () => {
                  socketIo.emit(
                    'sendMessage',
                    'nextVideo_' + remoteStore.generateRandomText(3),
                  );
                  karaokeStore.nextVideo();
                }
              "
            />

            <img
              v-if="!isMute"
              alt="shuffle-icon"
              src="../../../../assets/images/icons/volume_up.svg"
              class="cursor shuffle-icon"
              width="18"
              height="18"
              @click="volumeMute"
              @mouseover="
                () => {
                  isHideVolumeControl = false;
                }
              "
            />
            <img
              v-if="isMute"
              alt="shuffle-icon"
              src="../../../../assets/images/icons/volume_off.svg"
              class="cursor shuffle-icon"
              width="18"
              height="18"
              @click="volumeMute"
              @mouseover="
                () => {
                  isHideVolumeControl = false;
                }
              "
            />
            <input
              ref="volume"
              type="range"
              value="100"
              min="0"
              max="100"
              step="1"
              :class="{ 'control-volume-hid': isHideVolumeControl }"
              @mouseleave="setTimeoutHideVolumeControl"
              @mouseover="
                () => {
                  isHideVolumeControl = false;
                }
              "
              @change="videoPlayerVolume($event)"
            />
            <div class="control-title">
              <div>
                <p class="time">
                  {{ videoCurrentTiming }} / {{ videoDurationTotal }}
                </p>
              </div>
            </div>
          </div>
          <div class="control-end-mobile-container" @click="toggleDropdown()">
            <img
              src="assets/images/icons/drop_left.svg"
              alt="icon-verified"
              class="img cursor"
            />

            <div id="dropdown-mobile" class="control-end-mobile">
              <ul class="dropdown">
                <li>
                  <label for="checkbox">
                    <input
                      id="checkbox"
                      type="checkbox"
                      :checked="!isMusicOnly"
                      @input="handleMusicOnly()"
                    />
                    <div class="toggle">
                      <div class="star1"></div>
                      <div class="star2"></div>
                    </div>
                  </label>
                </li>
                <li v-if="!isFullScreen">
                  <img
                    src="assets/images/icons/settings_remote.svg"
                    alt="icon-verified"
                    class="img cursor"
                    data-bs-toggle="modal"
                    data-bs-target="#qe-code-modal"
                  />
                </li>
                <li v-if="!isFullScreen">
                  <img
                    v-if="!isCinema"
                    src="assets/images/icons/cinema.svg"
                    alt="icon-verified"
                    class="img cursor"
                    @click="openCinema"
                  />
                  <img
                    v-if="isCinema"
                    src="assets/images/icons/close_cinema.svg"
                    alt="icon-verified"
                    class="img cursor"
                    @click="openCinema"
                  />
                </li>
                <li>
                  <img
                    v-if="!isFullScreen"
                    src="../../../../assets/images/icons/ico-fullscreen.png"
                    class="cursor shuffle-icon"
                    alt="Image"
                    width="24"
                    @click="onFullScreen"
                  />
                  <img
                    v-if="isFullScreen"
                    src="../../../../assets/images/icons/close-full.png"
                    class="tune-icon cursor shuffle-icon"
                    alt="Image"
                    @click="exitFullScreen"
                  />
                </li>
              </ul>
            </div>
          </div>
          <div class="control-end">
            <label for="checkbox">
              <input
                id="checkbox"
                type="checkbox"
                :checked="!isMusicOnly"
                @input="handleMusicOnly()"
              />
              <div class="toggle">
                <div class="star1"></div>
                <div class="star2"></div>
              </div>
            </label>

            <img
              v-if="!isFullScreen"
              src="assets/images/icons/settings_remote.svg"
              alt="icon-verified"
              class="img cursor"
              data-bs-toggle="modal"
              data-bs-target="#qe-code-modal"
            />

            <img
              v-if="!isCinema && !isFullScreen"
              src="assets/images/icons/cinema.svg"
              alt="icon-verified"
              class="img cursor"
              @click="openCinema"
            />
            <img
              v-if="isCinema && !isFullScreen"
              src="assets/images/icons/close_cinema.svg"
              alt="icon-verified"
              class="img cursor"
              @click="openCinema"
            />

            <img
              v-if="!isFullScreen"
              src="../../../../assets/images/icons/ico-fullscreen.png"
              class="cursor shuffle-icon"
              alt="Image"
              width="24"
              @click="onFullScreen"
            />

            <img
              v-if="isFullScreen"
              src="../../../../assets/images/icons/close-full.png"
              class="tune-icon cursor shuffle-icon"
              alt="Image"
              @click="exitFullScreen"
            />
          </div>
        </div>
      </div>
      <progress
        id="htmlProgressAds"
        ref="htmlProgressAds"
        class="seekbar pink"
        :max="100"
        :class="{ 'control-main-hid': isHideControlBar }"
      ></progress>
      <input
        id="seek-video"
        ref="htmlProgress"
        type="range"
        class="seekbar"
        :max="duration"
        min="0"
        step="1"
        :value="timePlay"
        :class="{ 'control-main-hid': isHideControlBar }"
        @input="handleSeek"
      />
    </div>
    <div
      v-if="karaokeStore.playing?.adsLink"
      id="ads-detail-mobile"
      class="ads-detail-container"
    >
      <div class="ads-detail-mobile">
        <img
          :src="karaokeStore.playing.adsImage"
          class="pro-image"
          alt="pro-image"
        />
        <div>
          <p class="ads-title">{{ karaokeStore.playing?.adsName }}</p>
          <p class="ads-link">{{ karaokeStore.playing?.adsLink }}</p>
        </div>
      </div>
      <button class="ads-click" @click="handleGoToAdsOnBroad">Open</button>
    </div>

    <div
      v-if="karaokeStore.playing && !isCinema"
      id="info-container-video"
      class="info-container"
    >
      <p class="info-title font-subtitle-1">
        {{ karaokeStore.playing.name }}
      </p>
      <div class="info-detail">
        <div class="info-artist">
          <img
            class="artists-image"
            :src="karaokeStore.playing?.artistsImage"
            alt="artists-image"
          />
          <div class="info-item">
            <p class="info-artists h8">
              <NuxtLink
                target="_blank"
                :to="'artist/' + karaokeStore.playing?.artistSlug"
              >
                {{ karaokeStore.playing.artists }}
              </NuxtLink>
            </p>

            <div class="info-row">
              <img
                src="assets/images/icons/verified.png"
                alt="icon-verified"
                class="icon-verified"
              />

              <div class="tooltips-container">
                <div class="d-flex">
                  <span class="text-partner font-body-3">
                    {{ karaokeStore.playing.partnerName }}</span
                  >
                </div>
                <span class="tooltips font-body-3">
                  <img
                    :src="karaokeStore.playing.partnerImg"
                    class="image-partner"
                    :alt="karaokeStore.playing.partnerName"
                    @error="onImgError($event)"
                  />
                  {{ karaokeStore.playing.partnerName }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="info-view">
          <span class="material-symbols-outlined icon-verified">
            visibility
          </span>
          <p class="font-body-2">
            {{ convertToK(karaokeStore.playing.view) }} view
          </p>
        </div>
      </div>
      <div class="info-description">
        <div
          id="info-p"
          class="info-p font-body-2"
          v-html="karaokeStore.playing.description"
        ></div>
        <div v-if="karaokeStore.playing.description.trim().length > 100">
          <div
            v-if="!isSeeMore"
            class="info-more font-body-2"
            @click="seeMore()"
          >
            ...ดูเพิ่มเติม
          </div>
          <div
            v-if="isSeeMore"
            class="info-more font-body-2"
            @click="seeMore()"
          >
            แสดงน้อยลง
          </div>
        </div>
      </div>
      <div v-if="karaokeStore.adsAboveFooter" class="banner-footer">
        <a :href="karaokeStore.adsAboveFooter?.url" target="_blank">
          <img
            :src="karaokeStore.adsAboveFooter?.imageDesktopPath"
            alt="banners"
            class="image-banner"
            @click="
              videoAdsStore.postClick(
                karaokeStore.adsAboveFooter?.id!,
                CryptoJS.AES.encrypt(uuid, environment.tokenOtt).toString(),
              )
            "
          />
        </a>
      </div>
    </div>
    <div class="card-remote">
      <QrcodeModal
        id="1uwokdq2lt"
        :url="remoteStore.urlRemote"
        :url-remote="remoteStore.room"
        :reset-room="remoteStore.resetRoom"
        :size="150"
      ></QrcodeModal>
    </div>
  </div>
</template>

<style
  src="/components/pages/karaoke/video-play/VideoPlay.scss"
  lang="scss"
  scoped
></style>
