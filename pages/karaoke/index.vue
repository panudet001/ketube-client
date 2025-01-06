<script lang="ts" setup>
import { debounce } from "@antfu/utils";
import * as CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import { onMounted, ref } from "vue";
import { useKaraokeStore } from "~/store/useKaraokeStore";
import { environment } from "~/services/environments";
import { useSearchStore } from "~/store/useSearchStore";
import { useAdsStore } from "~/store/useAdsStore";
import { useRemoteStore } from "~/store/useRemoteStore";
import { useUserStore } from "~/store/useUserStore";
import { transformError } from "~/utils/transformError";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { useVideoStore } from "~/store/useVideoStore";

const route = useRoute();
const queryVideoParam = route.query.v ?? "";
const timeCounting = ref(10000);
// Store
const karaokeStore = useKaraokeStore();
const searchStore = useSearchStore();
const videoAdsStore = useAdsStore();
const remoteStore = useRemoteStore();
const userStore = useUserStore();
const videoStore = useVideoStore();

const dropdownStates = ref<Record<number, boolean>>({});
const uuid = uuid4();
if (queryVideoParam) {
  await useAsyncData(() => karaokeStore.playVideo(`${queryVideoParam}`));
}

// SSR CALL API
await useAsyncData(() => karaokeStore.get());
await useAsyncData(() => searchStore.getForKaraoke("-"));

const searchVideo = ref("");
const slugNextQueueSocket = ref("");
const slugPlayNowSocket = ref("");
const removeQueueAllSocket = ref("");
const removeVideoPlayingSocket = ref("");
const removeQueueByIndexSocket = ref("");
const moveQueueByIndexSocket = ref("");
const moveQueuePlayNext = ref("");
const timeContinue = ref(10000);
const isSeeMore = ref(false);
const isCinemas = ref<boolean>(false);

const isShowSearch = ref(false);

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

watch(
  () => karaokeStore.queues.length,
  (newVal, oldVal) => {
    if (newVal === 0 && oldVal === 1) {
      karaokeStore.isRandom = true;
      karaokeStore.get();
    }
  },
  { deep: true },
);

onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  timeCounting.value = 10000;
  window.removeEventListener("click", closeDropdown);
});

watch(
  () => karaokeStore.playing,
  () => {
    timeCounting.value = 10000;
    timeContinue.value = 10000;
  },
  { deep: true },
);

function toggleDropdown(index: number) {
  const check = dropdownStates.value[index];
  dropdownStates.value = {};
  dropdownStates.value[index] = !check;
  if (userStore.isShowFavorite) {
    userStore.getFavoritesCookie();
  }
}

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".section-dropdown")) {
    dropdownStates.value = {};
  }
}

const convertToK = (number: number) => {
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number;
  }
};

const clearInput = () => {
  searchVideo.value = "";
  isShowSearch.value = false;
  searchStore.getForKaraoke("-");
};

const path = environment.urlBaseApp + route.fullPath;
useHead({
  htmlAttrs: { lang: "th" },
  title: `เพลง ${karaokeStore.playing?.name ?? ""}  🎶 | ร้องเพลงออนไลน์ 🎤`,
  meta: [
    {
      name: "description",
      content: "",
    },
    {
      name: "keywords",
      content: [
        "ketube , ร้องเพลง, karaoke, คาราโอเกะ, เพลง, ร้องเพลงออนไลน์, เพลงออนไลน์, เพลงใหม่, music, เพลงใหม่, ศิลปิน, artist, อัลบั้ม, album, playlist, เพลย์ลิสต์ม, คาราโอเกะออนไลน์, ร้องคาราโอเกะ, โปรแกรมร้องเพลงคาราโอเกะ, เว็บคาราโอเกะ ออนไลน์, youtube, คาราโอเกะพกพา, ดนตรี",
      ],
    },
    { name: "robots", content: "index, follow" },

    // facebook
    {
      property: "og:title",
      name: "og:title",
      content: `เพลง ${karaokeStore.playing?.name ?? ""}`,
    },
    {
      property: "og:description",
      name: "og:description",
      content: "",
    },
    { property: "og:url", name: "og:url", content: path },
    { property: "og:site:name", name: "og:site:name", content: path },
    {
      property: "og:image",
      name: "og:image",
      content: `${karaokeStore.playing?.imageURL}`,
    },

    // twitter
    {
      property: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:title",
      name: "twitter:title",
      content: `เพลง ${karaokeStore.playing?.name ?? ""}`,
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content: "",
    },
    {
      property: "twitter:image",
      name: "twitter:image",
      content: `${karaokeStore.playing?.imageURL}`,
    },
    { property: "twitter:site", name: "twitter:site", content: "@ketube" },
  ],
  link: [{ rel: "canonical", href: path }],
});

watch(karaokeStore, (value) => {
  const path = environment.urlBaseApp + "/karaoke?v=" + value.playing?.slug;
  useHead({
    title: `เพลง ${value.playing?.name ?? ""}  🎶 | ร้องเพลงออนไลน์ 🎤`,
    link: [{ rel: "canonical", href: path }],
    meta: [
      // facebook
      {
        property: "og:title",
        name: "og:title",
        content: `เพลง ${value.playing?.name ?? ""}`,
      },
      { property: "og:url", name: "og:url", content: path },
      { property: "og:site:name", name: "og:site:name", content: path },
      {
        property: "og:image",
        name: "og:image",
        content: `${value.playing?.imageURL}`,
      },

      // twitter
      {
        property: "twitter:title",
        name: "twitter:title",
        content: `เพลง ${value.playing?.name ?? ""}`,
      },
      { property: "twitter:url", name: "twitter:url", content: path },
      {
        property: "twitter:image",
        name: "twitter:image",
        content: `${value.playing?.imageURL}`,
      },
    ],
  });
});
const onAddToQueue = (slug: string, isRe: boolean) => {
  slugNextQueueSocket.value = slug + "_" + remoteStore.generateRandomText(5);
  karaokeStore.nextVideoRe(slug, isRe);
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
const addQueue = (slug: string) => {
  slugNextQueueSocket.value = slug + "_" + remoteStore.generateRandomText(5);
};

const onPlayNow = (slug: string) => {
  slugPlayNowSocket.value = slug + "_" + remoteStore.generateRandomText(5);
  karaokeStore.playVideo(slug);
};

const removeQueue = () => {
  removeQueueAllSocket.value = "removeAll_" + remoteStore.generateRandomText(5);
};

const removeQueueByIndex = (index: number) => {
  removeQueueByIndexSocket.value =
    "removeQueueByIndex_" + index + "_" + remoteStore.generateRandomText(5);
};

const moveQueueByIndex = (index: number) => {
  moveQueueByIndexSocket.value =
    "moveUpQueueIndex_" + index + "_" + remoteStore.generateRandomText(5);
};

const removeVideoPlaying = () => {
  removeVideoPlayingSocket.value =
    "removeVideoPlaying_" + remoteStore.generateRandomText(5);
};

const moveQueuePlayNextPlaying = (slug: string) => {
  moveQueuePlayNext.value =
    "moveQueuePlayNext_" + slug + "_" + remoteStore.generateRandomText(5);
};

const progress = (e: any) => {
  timeContinue.value = e.seconds;
};
const displayCinema = (e: boolean) => {
  isCinemas.value = e;
  const karaokeContainer = document.getElementById(
    "karaoke-container-cinema",
  ) as HTMLInputElement;
  const sectionPlayContainer = document.getElementById(
    "section-play-container",
  ) as HTMLInputElement;

  if (!e) {
    karaokeContainer.style.display = "flex";
  } else {
    karaokeContainer.style.display = "block";
    sectionPlayContainer.style.marginTop = "20px";
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
function saveFavoriteVideo(val: string) {
  videoStore.addFavorite(val);
  if (videoStore.error) {
    const errMsg = transformError(videoStore.error.message);
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
  } else {
    userStore.addFavorites("videos", val);
    showSweetAlert(
      "บันทึกไปที่เพลงที่ถูกใจของฉัน",
      "info",
      1000,
      false,
      "top-end",
    );
  }
}
function delFavoriteVideo(val: string) {
  videoStore.delFavorite(val);
  if (videoStore.error) {
    const errMsg = transformError(videoStore.error.message);
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
  } else {
    showSweetAlert(
      "ลบออกจากเพลงที่ถูกใจของฉัน",
      "info",
      1000,
      false,
      "top-end",
    );
    const index = userStore.videos.indexOf(val);
    userStore.delFavorites("videos", index);
  }
}
</script>

<template>
  <div class="karaoke-warp">
    <div class="karaoke-song-page">
      <div id="karaoke-container-cinema" class="karaoke-container karaoke-main">
        <VideoPlay
          :move-queue-by-index-socket="moveQueueByIndexSocket"
          :remove-queue-by-index-socket="removeQueueByIndexSocket"
          :remove-queue-all-socket="removeQueueAllSocket"
          :remove-video-playing-socket="removeVideoPlayingSocket"
          :slug-next-queue-socket="slugNextQueueSocket"
          :move-queue-play-next-socket="moveQueuePlayNext"
          :query-video-param="queryVideoParam"
          :time-counting="timeCounting"
          :slug-play-now-socket="slugPlayNowSocket"
          :progress="progress"
          :time-continue="timeContinue"
          :display-cinema="displayCinema"
        ></VideoPlay>

        <div v-if="karaokeStore.playing && isCinemas" class="info-container">
          <div class="info-detail">
            <h2 class="info-title">
              {{ karaokeStore.playing.name }}
            </h2>
            <div class="info-detail">
              <div class="info-artist">
                <img
                  class="artists-image"
                  :src="karaokeStore.playing?.artistsImage"
                  alt="artists-image"
                />
                <div class="info-item">
                  <p class="info-artists">
                    <NuxtLink
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
                <p class="info-view-text">
                  {{ convertToK(karaokeStore.playing.view) }} view
                </p>
              </div>
            </div>
            <div class="info-description">
              <div
                id="info-p"
                class="info-p"
                v-html="karaokeStore.playing.description"
              ></div>
              <div v-if="karaokeStore.playing.description.trim().length > 100">
                <div v-if="!isSeeMore" class="info-more" @click="seeMore()">
                  ...ดูเพิ่มเติม
                </div>
                <div v-if="isSeeMore" class="info-more" @click="seeMore()">
                  แสดงน้อยลง
                </div>
              </div>
            </div>
            <div v-if="karaokeStore.adsAboveFooter" class="banner-footer">
              <a :href="karaokeStore.adsAboveFooter?.url" target="_blank">
                <img
                  :src="karaokeStore.adsAboveFooter?.imageDesktopPath"
                  alt="banners"
                  class="image-banner-cinema"
                  @click="
                    videoAdsStore.postClick(
                      karaokeStore.adsAboveFooter?.id!,
                      CryptoJS.AES.encrypt(
                        uuid,
                        environment.tokenOtt,
                      ).toString(),
                    )
                  "
                />
              </a>
            </div>
          </div>
          <div class="info-queue">
            <div id="section-play-container" class="section-play-container">
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
                      :move-up-queue-index="moveQueueByIndex"
                      :remove-queue-by-index="removeQueueByIndex"
                      :remove-video-playing="removeVideoPlaying"
                      :remove-queue="removeQueue"
                      :class="[!karaokeStore.playing ? 'd-none' : 'd-block']"
                    ></QueueList>

                    <div
                      v-if="!karaokeStore.playing"
                      class="section-recommended-video"
                    >
                      <div class="que-not">
                        <p class="title-que-not">
                          <span class="material-symbols-outlined me-1">
                            format_list_bulleted
                          </span>
                          ไม่มีคิวเพลง
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
                      :style-add="'451px'"
                    >
                    </SearchList>
                  </div>
                </div>
              </div>
              <div class="section-recommended-video">
                <div class="section-header-item">
                  <button
                    class="btn btn-recommended"
                    :class="{ 'btn-active': karaokeStore.isActiveArtists }"
                    @click="karaokeStore.getVideoArtisList(true)"
                  >
                    <p class="song-artist font-button-2">
                      From {{ karaokeStore.playing?.artists }}
                    </p>
                  </button>
                  <button
                    class="btn btn-recommended font-button-2"
                    :class="{ 'btn-active': karaokeStore.isActiveRecommended }"
                    @click="karaokeStore.getVideoRecommendedList(true)"
                  >
                    Recommended
                  </button>
                </div>

                <div class="section-item">
                  <div v-if="karaokeStore.isActiveArtists">
                    <div
                      v-for="(item, index) in karaokeStore.artisVideos"
                      :key="index"
                      class="item-container"
                    >
                      <div class="music">
                        <div>
                          <i
                            class="las la-plus icon-up"
                            @click="
                              () => {
                                timeCounting = 10000;
                                karaokeStore.addVideo(item);
                                addQueue(item.slug);
                              }
                            "
                          ></i>
                        </div>
                        <NuxtLink
                          class="section-link"
                          @click="
                            () => {
                              karaokeStore.playVideo(item.slug);
                              onPlayNow(item.slug);
                            }
                          "
                        >
                          <img
                            :src="item.imageURL"
                            :alt="item.name"
                            class="cover-music"
                          />
                          <div class="group-music">
                            <p class="text-music font-body-2">
                              {{ item.name }}
                            </p>
                            <p class="text-artist font-body-4">
                              {{ item.artists }}
                            </p>
                            <div class="text-artist-view">
                              <img
                                src="assets/images/icons/eye.png"
                                alt="icon-view"
                                class="icon-view"
                              />
                              <p class="text-view">
                                {{ convertToK(item.view) }} view
                              </p>
                            </div>
                          </div>
                        </NuxtLink>
                      </div>
                      <div
                        class="section-dropdown"
                        @click="toggleDropdown(index)"
                      >
                        <img
                          src="assets/images/icons/detail.svg"
                          class="icon-w i"
                          alt="detail"
                        />
                        <ul v-if="dropdownStates[index]" class="dropdown">
                          <li>
                            <NuxtLink
                              class="dropdown-item"
                              @click="
                                () => {
                                  karaokeStore.nextVideoRe(item.slug, true);
                                  moveQueuePlayNextPlaying(item.slug);
                                }
                              "
                            >
                              <img
                                src="assets/images/icons/play-next.svg"
                                alt="icon-item"
                                class="icon-item"
                              />เล่นเพลงถัดไป
                            </NuxtLink>
                          </li>
                          <li v-if="item.albumSlug">
                            <NuxtLink
                              target="_blank"
                              class="dropdown-item"
                              :href="`/album/${item.albumSlug}`"
                            >
                              <img
                                src="assets/images/icons/album.svg"
                                alt="play-next"
                                class="icon-item"
                              />ไปที่อัลบั้ม
                            </NuxtLink>
                          </li>
                          <li v-if="item.artistSlug">
                            <NuxtLink
                              target="_blank"
                              class="dropdown-item"
                              :href="`/artist/${item.artistSlug}`"
                            >
                              <img
                                src="assets/images/icons/artist.svg"
                                alt="play-next"
                                class="icon-item"
                              />ไปที่ศิลปิน
                            </NuxtLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div v-if="karaokeStore.isActiveRecommended">
                    <div
                      v-for="(item, index) in karaokeStore.recommendedVideos"
                      :key="index"
                      class="item-container"
                    >
                      <div class="music">
                        <div>
                          <i
                            class="las la-plus icon-up"
                            @click="
                              () => {
                                timeCounting = 10000;
                                karaokeStore.addVideo(item);
                                addQueue(item.slug);
                              }
                            "
                          ></i>
                        </div>
                        <NuxtLink
                          class="section-link"
                          @click="
                            () => {
                              karaokeStore.playVideo(item.slug);
                              onPlayNow(item.slug);
                            }
                          "
                        >
                          <img
                            :src="item.imageURL"
                            :alt="item.name"
                            class="cover-music"
                          />
                          <div class="group-music">
                            <p class="text-music font-body-2">
                              {{ item.name }}
                            </p>
                            <p class="text-artist font-body-4">
                              {{ item.artists }}
                            </p>
                            <div class="text-artist-view">
                              <img
                                src="assets/images/icons/eye.png"
                                alt="icon-view"
                                class="icon-view"
                              />
                              <p class="text-view">
                                {{ convertToK(item.view) }} view
                              </p>
                            </div>
                          </div>
                        </NuxtLink>
                      </div>
                      <div
                        class="section-dropdown"
                        @click="toggleDropdown(index)"
                      >
                        <img
                          src="assets/images/icons/detail.svg"
                          class="icon-w i"
                          alt="detail"
                        />
                        <ul v-if="dropdownStates[index]" class="dropdown">
                          <li>
                            <NuxtLink
                              class="dropdown-item"
                              @click="karaokeStore.nextVideoRe(item.slug, true)"
                            >
                              <img
                                src="assets/images/icons/play-next.svg"
                                alt="icon-item"
                                class="icon-item"
                              />เล่นเพลงถัดไป
                            </NuxtLink>
                          </li>
                          <li v-if="item.albumSlug">
                            <NuxtLink
                              target="_blank"
                              class="dropdown-item"
                              :href="`/album/${item.albumSlug}`"
                            >
                              <img
                                src="assets/images/icons/album.svg"
                                alt="play-next"
                                class="icon-item"
                              />ไปที่อัลบั้ม
                            </NuxtLink>
                          </li>
                          <li v-if="item.artistSlug">
                            <NuxtLink
                              target="_blank"
                              class="dropdown-item"
                              :href="`/artist/${item.artistSlug}`"
                            >
                              <img
                                src="assets/images/icons/artist.svg"
                                alt="play-next"
                                class="icon-item"
                              />ไปที่ศิลปิน
                            </NuxtLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!isCinemas"
          id="section-play-container"
          class="section-play-container"
        >
          <div id="section-play-list" class="section-play-list">
            <div class="scroll-tab">
              <ul id="pills-tab" class="nav nav-pills" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    id="pills-que-tab"
                    class="nav-link active font-button-2"
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
                    class="nav-link font-button-2"
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
                  :move-up-queue-index="moveQueueByIndex"
                  :remove-queue-by-index="removeQueueByIndex"
                  :remove-video-playing="removeVideoPlaying"
                  :remove-queue="removeQueue"
                  :class="[!karaokeStore.playing ? 'd-none' : 'd-block']"
                ></QueueList>

                <div
                  v-if="!karaokeStore.playing"
                  class="section-recommended-video"
                >
                  <div class="que-not">
                    <p class="title-que-not">
                      <span class="material-symbols-outlined me-1">
                        format_list_bulleted
                      </span>
                      ไม่มีคิวเพลง
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
                  :style-add="'451px'"
                >
                </SearchList>
              </div>
            </div>
          </div>
          <div class="section-recommended-video">
            <div class="section-header-item">
              <button
                v-if="karaokeStore.playing"
                class="btn btn-recommended"
                :class="{ 'btn-active': karaokeStore.isActiveArtists }"
                @click="karaokeStore.getVideoArtisList(true)"
              >
                <p class="song-artist font-button-2">
                  From {{ karaokeStore.playing?.artists }}
                </p>
              </button>
              <button
                class="btn btn-recommended"
                :class="{ 'btn-active': karaokeStore.isActiveRecommended }"
                @click="karaokeStore.getVideoRecommendedList(true)"
              >
                <p class="song-artist font-button-2">Recommended</p>
              </button>
            </div>

            <div class="section-item">
              <div v-if="karaokeStore.isActiveArtists">
                <div
                  v-for="(item, index) in karaokeStore.artisVideos"
                  :key="index"
                  class="item-container"
                >
                  <div class="music">
                    <div>
                      <i
                        class="las la-plus icon-up"
                        @click="
                          () => {
                            timeCounting = 10000;
                            karaokeStore.addVideo(item);
                            addQueue(item.slug);
                          }
                        "
                      ></i>
                    </div>
                    <NuxtLink
                      class="section-link"
                      @click="
                        () => {
                          karaokeStore.playVideo(item.slug);
                          onPlayNow(item.slug);
                        }
                      "
                    >
                      <img
                        :src="item.imageURL"
                        :alt="item.name"
                        class="cover-music"
                      />
                      <div class="group-music">
                        <p class="text-music font-body-2">{{ item.name }}</p>
                        <p class="text-artist font-body-4">
                          {{ item.artists }}
                        </p>
                        <div class="text-artist-view">
                          <img
                            src="assets/images/icons/eye.png"
                            alt="icon-view"
                            class="icon-view"
                          />
                          <p class="text-view font-body-4">
                            {{ convertToK(item.view) }} view
                          </p>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="section-dropdown" @click="toggleDropdown(index)">
                    <img
                      src="assets/images/icons/detail.svg"
                      class="icon-w i"
                      alt="detail"
                    />
                    <ul v-if="dropdownStates[index]" class="dropdown">
                      <li>
                        <NuxtLink
                          class="dropdown-item"
                          @click="
                            () => {
                              karaokeStore.nextVideoRe(item.slug, true);
                              moveQueuePlayNextPlaying(item.slug);
                            }
                          "
                        >
                          <img
                            src="assets/images/icons/play-next.svg"
                            alt="icon-item"
                            class="icon-item"
                          />เล่นเพลงถัดไป
                        </NuxtLink>
                      </li>
                      <li v-if="item.id && userStore.isShowFavorite">
                        <button
                          v-if="userStore.videos.includes(item.id) === false"
                          class="dropdown-item icon-card"
                          @click="saveFavoriteVideo(item.id)"
                        >
                          <span class="material-symbols-outlined icon-menu">
                            add_box
                          </span>
                          บันทึกเพลงที่ถูกใจ
                        </button>
                        <button
                          v-if="userStore.videos.includes(item.id) === true"
                          class="dropdown-item icon-card"
                          @click="delFavoriteVideo(item.id)"
                        >
                          <span class="material-symbols-outlined icon-menu">
                            disabled_by_default
                          </span>
                          ลบเพลงที่ถูกใจ
                        </button>
                      </li>
                      <li v-if="item.albumSlug">
                        <NuxtLink
                          target="_blank"
                          class="dropdown-item"
                          :href="`/album/${item.albumSlug}`"
                        >
                          <img
                            src="assets/images/icons/album.svg"
                            alt="play-next"
                            class="icon-item"
                          />ไปที่อัลบั้ม
                        </NuxtLink>
                      </li>
                      <li v-if="item.artistSlug">
                        <NuxtLink
                          target="_blank"
                          class="dropdown-item"
                          :href="`/artist/${item.artistSlug}`"
                        >
                          <img
                            src="assets/images/icons/artist.svg"
                            alt="play-next"
                            class="icon-item"
                          />ไปที่ศิลปิน
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div v-if="karaokeStore.isActiveRecommended">
                <div
                  v-for="(item, index) in karaokeStore.recommendedVideos"
                  :key="index"
                  class="item-container"
                >
                  <div class="music">
                    <div>
                      <i
                        class="las la-plus icon-up"
                        @click="
                          () => {
                            timeCounting = 10000;
                            karaokeStore.addVideo(item);
                            addQueue(item.slug);
                          }
                        "
                      ></i>
                    </div>
                    <NuxtLink
                      class="section-link"
                      @click="
                        () => {
                          karaokeStore.playVideo(item.slug);
                          onPlayNow(item.slug);
                        }
                      "
                    >
                      <img
                        :src="item.imageURL"
                        :alt="item.name"
                        class="cover-music"
                      />
                      <div class="group-music">
                        <p class="text-music font-body-2">{{ item.name }}</p>
                        <p class="text-artist font-body-4">
                          {{ item.artists }}
                        </p>
                        <div class="text-artist-view">
                          <img
                            src="assets/images/icons/eye.png"
                            alt="icon-view"
                            class="icon-view"
                          />
                          <p class="text-view font-body-4">
                            {{ convertToK(item.view) }} view
                          </p>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                  <div class="section-dropdown" @click="toggleDropdown(index)">
                    <img
                      src="assets/images/icons/detail.svg"
                      class="icon-w i"
                      alt="detail"
                    />
                    <ul v-if="dropdownStates[index]" class="dropdown">
                      <li>
                        <NuxtLink
                          class="dropdown-item"
                          @click="karaokeStore.nextVideoRe(item.slug, true)"
                        >
                          <img
                            src="assets/images/icons/play-next.svg"
                            alt="icon-item"
                            class="icon-item"
                          />เล่นเพลงถัดไป
                        </NuxtLink>
                      </li>
                      <li v-if="item.id && userStore.isShowFavorite">
                        <button
                          v-if="userStore.videos.includes(item.id) === false"
                          class="dropdown-item icon-card"
                          @click="saveFavoriteVideo(item.id)"
                        >
                          <span class="material-symbols-outlined icon-menu">
                            add_box
                          </span>
                          บันทึกเพลงที่ถูกใจ
                        </button>
                        <button
                          v-if="userStore.videos.includes(item.id) === true"
                          class="dropdown-item icon-card"
                          @click="delFavoriteVideo(item.id)"
                        >
                          <span class="material-symbols-outlined icon-menu">
                            disabled_by_default
                          </span>
                          ลบเพลงที่ถูกใจ
                        </button>
                      </li>
                      <li v-if="item.albumSlug">
                        <NuxtLink
                          target="_blank"
                          class="dropdown-item"
                          :href="`/album/${item.albumSlug}`"
                        >
                          <img
                            src="assets/images/icons/album.svg"
                            alt="play-next"
                            class="icon-item"
                          />ไปที่อัลบั้ม
                        </NuxtLink>
                      </li>
                      <li v-if="item.artistSlug">
                        <NuxtLink
                          target="_blank"
                          class="dropdown-item"
                          :href="`/artist/${item.artistSlug}`"
                        >
                          <img
                            src="assets/images/icons/artist.svg"
                            alt="play-next"
                            class="icon-item"
                          />ไปที่ศิลปิน
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section-recommended-container">
        <div class="section-recommended-info">
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
        <div class="section-recommended"></div>
      </div>
    </div>
  </div>
</template>
<style src="assets/scss/pages/karaoke/karaoke.scss" lang="scss" scoped></style>
