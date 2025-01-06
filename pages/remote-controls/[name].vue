<script setup lang="ts">
import { onMounted, ref } from "vue";
import { debounce } from "@antfu/utils";
import { useKaraokeStore } from "~/store/useKaraokeStore";
import { useSearchStore } from "~/store/useSearchStore";
import { environment } from "~/services/environments";
import { useRemoteStore } from "~/store/useRemoteStore";
import { showSweetAlert } from "~/utils/showSweetAlert";

definePageMeta({
  layout: false,
});

const route = useRoute();
const querySlugParam = route.params.name.toString();

const karaokeStore = useKaraokeStore();
const searchStore = useSearchStore();
const remoteStore = useRemoteStore();

await useAsyncData(() => karaokeStore.get());
await useAsyncData(() => searchStore.getForKaraoke("-"));

const dropdownStates = ref<Record<number, boolean>>({});

let socket: any = null;
const isShowSearch = ref(false);
const isMute = ref<boolean>(false);
const isSong = ref(false);
const isPlay = ref(false);
const isFullscreen = ref(false);
const isSkipAds = ref(false);

onMounted(() => {
  // SOCKET
  remoteStore.createUser();
  const user = remoteStore.user;

  socket = io(environment.urlSocket, {
    query: {
      userId: user,
      roomName: querySlugParam,
    },
  });

  socket.on("connect", () => {
    socket.emit("joinRoom", querySlugParam);
  });

  socket.emit("sendMessage", "joined_room");

  socket.on("message", (message: string) => {
    const data = message.split("_")[0];
    const volumesHtml = document.getElementById("volume") as HTMLInputElement;
    switch (data) {
      case "playing":
        if (message.split("_")[1] !== "no") {
          karaokeStore.playVideo(message.split("_")[1]);
          if (JSON.parse(message.split("_")[2]).length !== 0) {
            karaokeStore.queues = JSON.parse(message.split("_")[2]);
          } else {
            karaokeStore.queues = [];
          }

          if (message.split("_")[3] === "true") {
            isPlay.value = true;
          } else {
            isPlay.value = false;
          }

          volumesHtml.value = parseInt(message.split("_")[5]);
          volumesHtml.style = " --percent: " + volumesHtml.value + "%";

          if (message.split("_")[6] === "true") {
            isFullscreen.value = true;
          } else {
            isFullscreen.value = false;
          }

          if (message.split("_")[7] === "false@false@true") {
            isSkipAds.value = true;
          } else {
            isSkipAds.value = false;
          }
        } else {
          karaokeStore.playing = null;
          karaokeStore.queues.splice(0, karaokeStore.queues.length);
        }
        break;

      case "playingNow":
        karaokeStore.playVideo(message.split("_")[1]);
        break;

      case "addQueue":
        karaokeStore.nextVideoRe(message.split("_")[1], false);

        if (message.split("_")[3] === "true") {
          isPlay.value = true;
        } else {
          isPlay.value = false;
        }
        break;

      case "removeAll":
        karaokeStore.queues.splice(0, karaokeStore.queues.length);
        break;

      case "nextVideo":
        karaokeStore.nextVideo();
        break;

      case "removeVideoPlaying":
        karaokeStore.removeVideoPlaying();
        break;

      case "queue":
        karaokeStore.nextVideoRe(message.split("_")[1], false);
        break;

      case "removeQueueByIndex":
        karaokeStore.removeQueueForRemote(parseInt(message.split("_")[1]));
        break;

      case "moveUpQueueIndex":
        karaokeStore.moveUpQueue(parseInt(message.split("_")[1]));
        break;

      case "moveQueuePlayNext":
        karaokeStore.nextVideoRe(message.split("_")[1], true);
        break;

      case "currentAudioTrack":
        if (message.split("_")[1] === "false") {
          isSong.value = true;
        } else {
          isSong.value = false;
        }

        break;

      case "onplay":
        if (parseInt(message.split("_")[1]) === 1) {
          isPlay.value = true;
        } else {
          isPlay.value = false;
        }
        break;

      case "volume":
        volumesHtml.value = parseInt(message.split("_")[1]);
        volumesHtml.style = " --percent: " + volumesHtml.value + "%";

        if (parseInt(message.split("_")[1]) === 0) {
          isMute.value = true;
        } else {
          isMute.value = false;
        }
        break;

      case "leaveRoom":
        karaokeStore.playing = null;
        karaokeStore.queues = [];
        break;

      case "nextSongNow":
        karaokeStore.nextVideo();
        break;

      case "nextAdsNow":
        if (message.split("_")[1] === "true") {
          isSkipAds.value = true;
        } else {
          isSkipAds.value = false;
        }

        break;

      default:
    }
  });

  // END-SOCKET

  window.addEventListener("click", closeDropdown);

  const volume = document.getElementById("volume") as HTMLInputElement;
  volume.style = " --percent: 100%";
});

onUnmounted(() => {
  socket.close();
  window.removeEventListener("click", closeDropdown);
});

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".setting")) {
    dropdownStates.value = {};
  }
};

const searchVideo = ref();

const getSearch = debounce(300, (value: string) => {
  searchStore.getForKaraoke(value);
});

watch(searchVideo, (value) => {
  getSearch(value);
});

watch(searchVideo, () => {
  if (searchVideo.value === "") {
    isShowSearch.value = false;
    getSearch("-");
  } else {
    isShowSearch.value = true;
  }
});

const onAddToQueue = (slug: string, isRe: boolean) => {
  if (isRe) {
    socket.emit("sendMessage", "moveQueuePlayNext_" + slug);
  } else {
    socket.emit("sendMessage", "queue_" + slug);
  }

  karaokeStore.nextVideoRe(slug, isRe);
};

const onPlayNow = (slug: string) => {
  socket.emit("sendMessage", "playingNow_" + slug);
  showSweetAlert("กำลังเล่นเพลงนี้", "info", 1000, false, "top-end");
  karaokeStore.playVideo(slug);
};

const removeQueue = () => {
  socket.emit("sendMessage", "removeAll_" + remoteStore.generateRandomText(5));
};

const removeVideoPlaying = () => {
  socket.emit(
    "sendMessage",
    "removeVideoPlaying_" + remoteStore.generateRandomText(5),
  );
};

const removeQueueByIndex = (index: number) => {
  socket.emit("sendMessage", "removeQueueByIndex_" + index);
};

const moveUpQueueIndex = (index: number) => {
  socket.emit("sendMessage", "moveUpQueueIndex_" + index);
};

const onGetArtist = (slug: string) => {
  karaokeStore.getArtist(slug);
};
const onGetPlayLists = (slug: string) => {
  karaokeStore.getPlayLists(slug);
};

const goBack = () => {
  karaokeStore.goBack();
};

const clearInput = () => {
  searchVideo.value = "";
  isShowSearch.value = false;
  searchStore.getForKaraoke("-");
};

const onSong = () => {
  isSong.value = !isSong.value;
  if (isSong.value) {
    socket.emit("sendMessage", "currentAudioTrack_false");
  } else {
    socket.emit("sendMessage", "currentAudioTrack_true");
  }
};
const videoPlayerVolume = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  const volume = document.getElementById("volume") as HTMLInputElement;
  volume.style = " --percent: " + inputElement.value + "%";
  socket.emit("sendMessage", "volume_" + inputElement.value);
  if (inputElement.value === 0) {
    isMute.value = true;
  } else {
    isMute.value = false;
  }
};

const volumeMute = () => {
  const volume = document.getElementById("volume") as HTMLInputElement;
  isMute.value = !isMute.value;

  if (isMute.value) {
    socket.emit("sendMessage", "volume_0");
    volume.value = "0";
    volume.style = " --percent: 0%";
  } else {
    socket.emit("sendMessage", "volume_50");
    volume.value = "50";
    volume.style = " --percent: 50%";
  }
};

const playSong = () => {
  isPlay.value = !isPlay.value;
  if (isPlay.value) {
    socket.emit("sendMessage", "onplay_1");
  } else {
    socket.emit("sendMessage", "onplay_0");
  }
};

const nextSongNow = () => {
  karaokeStore.nextVideo();
  socket.emit("sendMessage", "nextSongNow");
};

const fullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  socket.emit("sendMessage", "fullscreen_" + isFullscreen.value);
};

const nextAdsNow = () => {
  socket.emit("sendMessage", "nextAdsNow_true");
  socket.emit("sendMessage", "nextAdsNow_false");
  isSkipAds.value = false;
};
</script>
<template>
  <div class="karaoke-container">
    <div class="section-play-container">
      <div class="room-number">
        <img
          src="assets/images/icons/door_remote.svg"
          class="img-door"
          alt="detail"
        />
        <p class="number">KETUBE / {{ querySlugParam }}</p>
      </div>

      <div class="control-room">
        <div class="control-remote">
          <div class="control-start">
            <img
              v-if="!isPlay"
              src="assets/images/icons/pause-remote.svg"
              class="img-mic cursor"
              alt="detail"
              @click="playSong"
            />
            <img
              v-if="isPlay"
              src="assets/images/icons/play_remote.svg"
              class="img-mic cursor"
              alt="detail"
              @click="playSong"
            />
            <img
              src="assets/images/icons/next_yes_queue.svg"
              class="img-mic cursor"
              alt="detail"
              @click="nextSongNow"
            />
            <button v-if="isSkipAds" class="skip-ad" @click="nextAdsNow">
              Skip Ads
              <img
                src="assets/images/icons/skip_next_remote.svg"
                class="img-mic cursor"
                alt="detail"
                @click="nextSongNow"
              />
            </button>
          </div>

          <div class="control-end">
            <div v-if="isSong" class="mic" @click="onSong">
              <img
                src="assets/images/icons/mic_remote.svg"
                class="img-mic"
                alt="detail"
              />
            </div>
            <div v-if="!isSong" class="mic-d" @click="onSong">
              <img
                src="assets/images/icons/mic_remote.svg"
                class="img-mic cursor"
                alt="detail"
              />
            </div>
            <img
              v-if="isFullscreen"
              src="assets/images/icons/close_cinema.svg"
              class="img-mic cursor"
              alt="detail"
              @click="fullscreen"
            />
            <img
              v-if="!isFullscreen"
              src="assets/images/icons/cinema.svg"
              class="img-mic cursor"
              alt="detail"
              @click="fullscreen"
            />
          </div>
        </div>
        <div class="control-song">
          <img
            v-if="!isMute"
            src="assets/images/icons/vocal_remote.svg"
            class="img-mic cursor"
            alt="detail"
            @click="volumeMute"
          />
          <img
            v-if="isMute"
            src="assets/images/icons/volume_off.svg"
            class="img-mic cursor"
            alt="detail"
            @click="volumeMute"
          />
          <input
            id="volume"
            type="range"
            value="100"
            min="0"
            max="100"
            step="1"
            class="volume"
            @change="videoPlayerVolume($event)"
          />
        </div>
      </div>

      <div id="section-play-list" class="section-play-list">
        <div class="scroll-tab">
          <ul id="pills-tab" class="nav nav-pills" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                id="pills-que-tab"
                class="nav-link active"
                data-bs-toggle="pill"
                data-bs-target="#pills-que"
                type="button"
                role="tab"
                aria-controls="pills-que"
                aria-selected="true"
              >
                คิวเพลง
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                id="pills-que-tab"
                class="nav-link"
                data-bs-toggle="pill"
                data-bs-target="#pills-search"
                type="button"
                role="tab"
                aria-controls="pills-search"
                aria-selected="true"
              >
                ค้นหา
              </button>
            </li>
          </ul>
        </div>

        <div id="pills-tabContent" class="tab-content">
          <!-- Start Que -->
          <div
            id="pills-que"
            class="tab-pane fade show active"
            role="tabpanel"
            aria-labelledby="pills-que-tab"
          >
            <QueueList
              :move-up-queue-index="moveUpQueueIndex"
              :remove-queue-by-index="removeQueueByIndex"
              :style-add="'338px'"
              :remove-queue="
                () => {
                  removeQueue();
                }
              "
              :remove-video-playing="removeVideoPlaying"
              :class="[!karaokeStore.playing ? 'd-none' : 'd-block']"
            ></QueueList>

            <div v-if="!karaokeStore.playing" class="section-recommended-video">
              <div class="que-not">
                <p class="title-que-not">
                  <span class="material-symbols-outlined me-1">
                    format_list_bulleted </span
                  >ไม่มีคิวเพลง
                </p>
                <img
                  src="../../assets/images/icons/music-folder.png"
                  class="img"
                  alt="music-folder"
                />
              </div>
            </div>
          </div>

          <div
            id="pills-search"
            class="tab-pane fade"
            role="tabpanel"
            aria-labelledby="pills-list-tab"
          >
            <div v-if="!karaokeStore.isSeeMore" class="input-group">
              <input
                v-model="searchVideo"
                class="form-control"
                type="text"
                placeholder="ค้นหา"
              />

              <span class="input-group-text">
                <i
                  v-if="isShowSearch"
                  class="las la-times close-icon"
                  @click="clearInput"
                ></i>
                <span class="material-symbols-outlined icon-search">
                  search
                </span>
                <!-- <i class="las la-search icon-search"></i> -->
              </span>
            </div>
            <SearchList
              :playlist="karaokeStore.playlistData"
              :search-karaoke-result="searchStore.searchKaraokeResult"
              :on-add-to-queue="onAddToQueue"
              :get-artist="onGetArtist"
              :get-play-list="onGetPlayLists"
              :name="karaokeStore.nameArtis"
              :is-artist="karaokeStore.isArtist"
              :is-playlist="karaokeStore.isPlaylist"
              :new-release-video="karaokeStore.newReleaseVideo"
              :is-see-more="karaokeStore.isSeeMore"
              :go-back="goBack"
              :on-play-now="onPlayNow"
              :style-add="'460px'"
            >
            </SearchList>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/remote-controls/remote.scss"
  lang="scss"
  scoped
></style>
