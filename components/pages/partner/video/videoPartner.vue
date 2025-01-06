<script setup lang="ts">
import "video.js/dist/video-js.css";
import "global/window.js";
import { debounce } from "@antfu/utils";
import { useKaraokeStore, type Video } from "~/store/useKaraokeStore";
import { useVideoStore } from "~/store/useVideoStore";

// Store
const karaokeStore = useKaraokeStore();
const htmlVideo = ref<HTMLElement>();
const videoStore = useVideoStore();

let jwPlayer: any = null;

// VideoConfig
const isStartPage = ref<boolean>(false);
const isPlayingVideo = ref<boolean>(false);
const isHideControlBar = ref<boolean>(false);
const isHideVolumeControl = ref<boolean>(true);
const isMusicOnly = ref<boolean>(false);
const isFullScreen = ref<boolean>(false);
const htmlPlayerContainer = ref<any>(null);
const htmlProgress = ref<any>(null);
const videoCurrentTiming = ref<string>("00:00");
const videoDurationTotal = ref<string>("00:00");
const isVideoNearEnding = ref<boolean>(false);
const isShowSpinner = ref<string>("");
const isShowSearchFullScreen = ref<boolean>(false);
const searchVideo = ref("");
const htmlInputShowSearch = ref<HTMLInputElement>();

onMounted(() => {
  jwPlayer = jwplayer(htmlVideo.value).setup({
    file: karaokeStore.defaultVideoURL,
    width: "100%",
    height: 650,
    autostart: false,
    allowFullscreen: false,
    controls: false,
    floating: {
      dismissible: true,
    },
  });

  jwPlayer.on("meta", function () {
    jwPlayer.setFloating(false);
    if (isMusicOnly.value) {
      jwPlayer.setCurrentAudioTrack(2);
    } else {
      jwPlayer.setCurrentAudioTrack(0);
    }
  });

  jwPlayer.on("play", function () {
    if (isMusicOnly.value) {
      jwPlayer.setCurrentAudioTrack(2);
    } else {
      jwPlayer.setCurrentAudioTrack(0);
    }
  });

  jwPlayer.on("seek", function () {
    isShowSpinner.value = "block";
  });

  jwPlayer.on("seeked", function () {
    isShowSpinner.value = "none";
  });

  jwPlayer.on("displayClick", function () {
    if (isPlayingVideo.value) {
      handlePlayVideo(false);
    } else {
      handlePlayVideo(true);
    }
  });

  jwPlayer.on("time", function () {
    updateProgress();
  });

  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
      exitFullScreen();
    }
  });

  document.addEventListener("keyup", function (e) {
    if (isFullScreen.value) {
      isShowSearchFullScreen.value = true;
      htmlInputShowSearch.value?.focus();
      if (e.key === "Enter") {
        isShowSearchFullScreen.value = false;
        searchVideo.value = "";
      }
    }
  });
});

onBeforeUnmount(() => {
  jwPlayer.stop();
  jwPlayer.remove();
});

// Watch
watch(
  () => karaokeStore.playing,
  () => {
    jwPlayer.load({
      file: karaokeStore.playing?.playingURL ?? karaokeStore.defaultVideoURL,
    });

    if (isStartPage.value) {
      handlePlayVideo(true);
    } else {
      handlePlayVideo(false);
      isStartPage.value = true;
    }
  },
  {
    deep: true,
  },
);

watch(searchVideo, (value) => {
  getSearch(value);
});

const getSearch = debounce(300, (value: string) => {
  videoStore.get(value);
});

const handlePlayVideo = (isPlay: boolean) => {
  if (isPlay) {
    jwPlayer.play();
    isPlayingVideo.value = true;
    isHideControlBar.value = true;
  } else {
    jwPlayer.pause();
    isPlayingVideo.value = false;
    isHideControlBar.value = false;
  }
};

const onFullScreen = () => {
  const refHtml = htmlPlayerContainer.value;
  if (refHtml) {
    if (!refHtml.fullscreenElement && !refHtml.webkitFullscreenElement) {
      isFullScreen.value = true;
      if (refHtml.requestFullscreen) {
        refHtml.requestFullscreen();
      } else if (refHtml.webkitRequestFullscreen) {
        refHtml.webkitRequestFullscreen();
      }
    }
  }
};

const exitFullScreen = () => {
  isFullScreen.value = false;
  isShowSearchFullScreen.value = false;
  searchVideo.value = "";
  document.exitFullscreen();
};

const setTimeoutHideVolumeControl = () => {
  setTimeout(() => {
    isHideVolumeControl.value = true;
  }, 5000);
};

const seekVideo = (event: MouseEvent) => {
  const progressBar = htmlProgress.value;
  const pokemonPikachu =
    (event.clientX - progressBar.getBoundingClientRect().left) /
    progressBar.offsetWidth;
  const time = pokemonPikachu * jwPlayer.getDuration();
  jwPlayer.seek(time);
  handlePlayVideo(true);
};

const updateProgress = async () => {
  const currentTime = jwPlayer.getPosition();
  const duration = jwPlayer.getDuration();
  const progress = (currentTime / duration) * 100;

  videoCurrentTiming.value = convertMinutesToTime(currentTime);
  htmlProgress.value.value = progress;

  const htmlSeekVideo = document.getElementById(
    "seek-video",
  ) as HTMLInputElement;
  const minValue = parseFloat(htmlSeekVideo.min);
  const maxValue = parseFloat(htmlSeekVideo.max);
  const currentValue = parseFloat(htmlSeekVideo.value);

  const pokemonPichu =
    ((currentValue - minValue) / (maxValue - minValue)) * 100;
  htmlSeekVideo.style.background =
    "linear-gradient(to right, #a30000 0%, #a30000 " +
    pokemonPichu +
    "%, gray " +
    pokemonPichu +
    "%, gray 100%)";

  isVideoNearEnding.value = progress >= 95;
  videoDurationTotal.value = convertMinutesToTime(jwPlayer.getDuration());
  if (jwPlayer.getPosition() >= jwPlayer.getDuration()) {
    await karaokeStore.nextVideo();
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
  jwPlayer.setVolume(parseFloat(inputElement.value) * 100);
};
</script>

<template>
  <div class="container-video">
    <div ref="htmlPlayerContainer" class="player">
      <div ref="htmlVideo"></div>
      <img
        src="../../../../assets/images/icons/logo/logo.png"
        alt="Image"
        class="image"
      />
      <div class="loading-spinner" :style="{ display: isShowSpinner }"></div>
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
            >
              <div class="item-card">
                <i
                  class="las la-plus icon"
                  @click="
                    karaokeStore.addVideo({
                      name: item.title,
                      artists: item.description,
                      slug: item.slug,
                      imageURL: item.imageURL,
                    } as Video)
                  "
                ></i>
                <img :src="item.imageURL" alt="Image" class="img-music" />
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
        v-if="isVideoNearEnding && karaokeStore.queues.length > 0"
        class="next-container"
      >
        <div class="next-card">
          <p class="title">เพลงถัดไป</p>
          <div class="next-item">
            <div class="item-card">
              <div class="item-content">
                <img
                  :src="karaokeStore.queues[0].imageURL"
                  alt="Image"
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
            <button class="btn btn-play" @click="karaokeStore.nextVideo()">
              เล่น
            </button>
          </div>
        </div>
      </div>
      <div
        class="control-main"
        :class="{ 'control-main-hid': isHideControlBar }"
      >
        <div class="control">
          <div class="control-start">
            <img
              v-if="!isPlayingVideo"
              class="play-icon cursor"
              src="../../../../assets/images/icons/play-circle.png"
              alt="Image"
              @click="handlePlayVideo(true)"
            />

            <img
              v-if="isPlayingVideo"
              class="on-icon cursor"
              src="../../../../assets/images/icons/on-music.png"
              alt="Image"
              @click="handlePlayVideo(false)"
            />

            <img
              alt="Image"
              src="../../../../assets/images/icons/volume_up.png"
              class="cursor shuffle-icon volume-size"
              @mouseover="
                () => {
                  isHideVolumeControl = false;
                }
              "
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :class="{ 'control-volume-hid': isHideVolumeControl }"
              @mouseleave="setTimeoutHideVolumeControl"
              @mouseover="
                () => {
                  isHideVolumeControl = false;
                }
              "
              @change="videoPlayerVolume($event)"
            />
          </div>

          <div class="control-end">
            <img
              v-if="!isFullScreen"
              src="../../../../assets/images/icons/ico-fullscreen.png"
              class="cursor shuffle-icon"
              height="18px"
              width="18px"
              alt="Image"
              @click="onFullScreen"
            />

            <img
              v-if="isFullScreen"
              src="../../../../assets/images/icons/close-full.png"
              class="tune-icon cursor shuffle-icon"
              height="18px"
              width="18px"
              alt="Image"
              @click="exitFullScreen"
            />
          </div>
        </div>
      </div>
      <input
        id="seek-video"
        ref="htmlProgress"
        value="0"
        type="range"
        class="progress"
        :class="{ 'control-main-hid': isHideControlBar }"
        min="0"
        max="100"
        @click="seekVideo"
      />
    </div>
  </div>
</template>

<style
  src="/components/pages/partner/video/videoPartner.scss"
  lang="scss"
  scoped
></style>
