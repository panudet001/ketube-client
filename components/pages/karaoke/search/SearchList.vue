<script lang="ts" setup>
import { defineProps, ref } from "vue";
import type { Search } from "~/interfaces/responses/search/Search";
import { useSearchStore } from "~/store/useSearchStore";
import type { PlaylistMusicItem } from "~/interfaces/responses/search/Result";
import type { Playlist } from "~/interfaces/responses/pages/playlist/Playlist";
import { useUserStore } from "~/store/useUserStore";
import { useVideoStore } from "~/store/useVideoStore";
import { transformError } from "~/utils/transformError";
import { showSweetAlert } from "~/utils/showSweetAlert";

const props = defineProps<{
  searchKaraokeResult: Search | null;
  newReleaseVideo: PlaylistMusicItem[] | [];
  playlist: Playlist | null;
  onAddToQueue: (slug: string, isRe: boolean) => void;
  getArtist: (slug: string) => void;
  getPlayList: (slug: string) => void;
  name: string | null;
  isArtist: boolean;
  isPlaylist: boolean;
  isSeeMore: boolean;
  goBack: () => void;
  onPlayNow: (slug: string) => void;
  styleAdd: string;
}>();

const searchStore = useSearchStore();
const userStore = useUserStore();
const videoStore = useVideoStore();
const dropdownStates = ref<Record<number, boolean>>({});
const searchGroupMenu = ref([
  {
    name: "ทั้งหมด",
    isActive: true,
    isSelect: true,
  },
  {
    name: "เพลง",
    isActive: false,
    isSelect: true,
  },
  {
    name: "ศิลปิน",
    isActive: false,
    isSelect: true,
  },
  {
    name: "เพลย์ลิสต์",
    isActive: false,
    isSelect: true,
  },
]);
// hook
onMounted(() => {
  window.addEventListener("click", closeDropdown);

  window.addEventListener("resize", function () {
    const width = window.innerWidth;
    const adsDetail = document.getElementById(
      "karaoke-container",
    ) as HTMLInputElement;
    if (adsDetail) {
      if (width > 800 && props.isArtist) {
        adsDetail.style.height = "495px";
      } else if (width > 800 && props.isPlaylist) {
        adsDetail.style.height = "495px";
      } else {
        adsDetail.style.height = "451px";
        adsDetail.style.minHeight = "451px";
      }
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("click", closeDropdown);
});

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
  if (target && !target.closest(".karaoke-setting")) {
    dropdownStates.value = {};
  }
}

watch(
  () => props.isArtist,

  () => {
    const adsDetail = document.getElementById(
      "karaoke-container",
    ) as HTMLInputElement;

    if (adsDetail) {
      if (props.isArtist) {
        adsDetail.style.minHeight = "495px";
      } else {
        adsDetail.style.minHeight = "451px";
      }
    }
  },
);

watch(
  () => props.isPlaylist,

  () => {
    const adsDetail = document.getElementById(
      "karaoke-container",
    ) as HTMLInputElement;
    if (props.isPlaylist) {
      adsDetail.style.minHeight = "495px";
    } else {
      adsDetail.style.minHeight = "451px";
    }
  },
);

const onSelectType = (index: number) => {
  searchGroupMenu.value.forEach((e, i) => {
    if (i !== index) {
      e.isActive = false;
      e.isSelect = false;
    } else {
      e.isActive = true;
      e.isSelect = true;
    }
  });

  if (index === 0) {
    searchGroupMenu.value.forEach((e) => {
      e.isSelect = true;
    });
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
  <div class="karaoke-search">
    <div v-if="!isSeeMore" class="group-search">
      <button
        v-for="(item, index) in searchGroupMenu"
        :key="index"
        class="group-button"
        :class="{ 'group-active': item.isActive }"
        @click="onSelectType(index)"
      >
        {{ item.name }}
      </button>
    </div>
    <div
      v-if="isSeeMore"
      class="navigator-container"
      @click="
        () => {
          goBack();
        }
      "
    >
      <img
        src="assets/images/icons/back_right.svg"
        class="icon-w i"
        alt="detail"
      />
      {{ props.name }}
    </div>
    <div
      id="karaoke-container"
      class="karaoke-container"
      :style="{ height: props.styleAdd }"
    >
      <div
        v-if="
          !props.searchKaraokeResult ||
          props.searchKaraokeResult?.results.length === 0
        "
        class="que-not"
      >
        <img
          src="../../../../assets/images/icons/music-folder.png"
          class="img"
          alt="music-folder"
        />

        <p>ไม่พบเพลงที่ค้นหา</p>
      </div>

      <div v-if="props.isArtist">
        <div
          v-for="(item, index) in props.newReleaseVideo"
          :key="index"
          class="karaoke-item"
        >
          <i
            class="las la-plus icon-up"
            @click="onAddToQueue(item.link, false)"
          ></i>
          <NuxtLink class="karaoke-link" @click="onPlayNow(item.link)">
            <img class="karaoke-image" :src="item.imageURL" :alt="item.name" />
          </NuxtLink>
          <div class="karaoke-warp">
            <div class="karaoke-detail">
              <NuxtLink class="karaoke-link" @click="onPlayNow(item.link)">
                <p class="karaoke-name">{{ item.name }}</p>
                <p class="karaoke-artists">
                  {{ item.artists?.map((value) => `${value.name}`).join() }}
                </p>
              </NuxtLink>
            </div>
            <div class="karaoke-setting">
              <img
                src="assets/images/icons/detail.svg"
                class="icon-w i"
                alt="detail"
                @click="toggleDropdown(index)"
              />
              <ul v-if="dropdownStates[index]" class="dropdown">
                <li>
                  <NuxtLink
                    class="dropdown-item"
                    @click="
                      () => {
                        onAddToQueue(item.link, true);
                        dropdownStates = {};
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
                <!--                <li>-->
                <!--                  <NuxtLink-->
                <!--                      target="_blank"-->
                <!--                      class="dropdown-item"-->
                <!--                      :to="item.artist"-->
                <!--                     -->
                <!--                  >-->
                <!--                    <img-->
                <!--                        src="assets/images/icons/artist.svg"-->
                <!--                        alt="play-next"-->
                <!--                        class="icon-item"-->
                <!--                    />ไปที่ศิลปิน-->
                <!--                  </NuxtLink>-->
                <!--                </li>-->
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-if="props.isPlaylist">
        <div
          v-for="(item, index) in props.playlist!.videos"
          :key="index"
          class="karaoke-item"
        >
          <i
            class="las la-plus icon-up"
            @click="onAddToQueue(item.slug, false)"
          ></i>
          <NuxtLink class="karaoke-link" @click="onPlayNow(item.slug)">
            <img
              class="karaoke-image"
              :src="searchStore.getImag(item.imagePath)"
              :alt="item.name"
            />
          </NuxtLink>
          <div class="karaoke-warp">
            <div class="karaoke-detail">
              <NuxtLink class="karaoke-link" @click="onPlayNow(item.slug)">
                <p class="karaoke-name">{{ item.name }}</p>
                <p class="karaoke-artists">
                  {{ item.artists?.map((value) => `${value.name}`).join() }}
                </p>
              </NuxtLink>
            </div>
            <div class="karaoke-setting">
              <img
                src="assets/images/icons/detail.svg"
                class="icon-w i"
                alt="detail"
                @click="toggleDropdown(index)"
              />
              <ul v-if="dropdownStates[index]" class="dropdown">
                <li>
                  <NuxtLink
                    class="dropdown-item"
                    @click="
                      () => {
                        onAddToQueue(item.slug, true);
                        dropdownStates = {};
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
                <li>
                  <NuxtLink
                    target="_blank"
                    class="dropdown-item"
                    :to="'/artist/' + item.artists[0].slug"
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

      <div v-if="!props.isSeeMore">
        <p
          v-if="
            props.searchKaraokeResult?.results.filter((e) => e.type == 'video')
              .length! > 0 && searchGroupMenu[1].isSelect === true
          "
        >
          เพลง
        </p>
        <div v-if="searchGroupMenu[1].isSelect === true">
          <div
            v-for="(item, index) in props.searchKaraokeResult?.results.filter(
              (e) => e.type == 'video',
            )"
            :key="index"
            class="karaoke-item"
          >
            <i
              class="las la-plus icon-up"
              @click="onAddToQueue(item.slug, false)"
            ></i>
            <NuxtLink class="karaoke-link" @click="onPlayNow(item.slug)">
              <img
                class="karaoke-image"
                :src="searchStore.getImag(item.imagePath)"
                :alt="item.name"
              />
            </NuxtLink>
            <div class="karaoke-warp">
              <div class="karaoke-detail">
                <NuxtLink class="karaoke-link" @click="onPlayNow(item.slug)">
                  <p class="karaoke-name">{{ item.name }}</p>
                  <p class="karaoke-artists">
                    {{ item.artists?.map((value) => `${value.name}`).join() }}
                  </p>
                </NuxtLink>
              </div>
              <div class="karaoke-setting">
                <img
                  src="assets/images/icons/detail.svg"
                  class="icon-w i"
                  alt="detail"
                  @click="toggleDropdown(index)"
                />
                <ul v-if="dropdownStates[index]" class="dropdown">
                  <li>
                    <NuxtLink
                      class="dropdown-item"
                      @click="
                        () => {
                          onAddToQueue(item.slug, true);
                          dropdownStates = {};
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
                  <li>
                    <NuxtLink
                      target="_blank"
                      class="dropdown-item"
                      :href="`/artist/${item.artists![0].slug}`"
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
        <p
          v-if="
            props.searchKaraokeResult?.results.filter((e) => e.type == 'artist')
              .length! > 0 && searchGroupMenu[2].isSelect === true
          "
        >
          ศิลปิน
        </p>
        <div v-if="searchGroupMenu[2].isSelect === true">
          <div
            v-for="(item, index) in props.searchKaraokeResult?.results.filter(
              (e) => e.type == 'artist',
            )"
            :key="index"
            class="karaoke-item"
          >
            <img
              class="karaoke-image-at"
              :src="searchStore.getImag(item.imagePath)"
              :alt="item.name"
              @click="props.getArtist(item.slug)"
            />
            <div class="karaoke-warp" @click="props.getArtist(item.slug)">
              <div class="karaoke-detail">
                <p class="karaoke-name mauve">{{ item.name }}</p>
                <p class="karaoke-artists">Artists</p>
              </div>
            </div>
          </div>
        </div>
        <p
          v-if="
            props.searchKaraokeResult?.results.filter(
              (e) => e.type == 'playlist',
            ).length! > 0 && searchGroupMenu[3].isSelect === true
          "
        >
          เพลย์ลิสต์
        </p>
        <div v-if="searchGroupMenu[3].isSelect === true">
          <div
            v-for="(item, index) in props.searchKaraokeResult?.results.filter(
              (e) => e.type == 'playlist',
            )"
            :key="index"
            class="karaoke-item"
          >
            <img
              class="karaoke-image-pl"
              :src="searchStore.getImag(item.imagePath)"
              :alt="item.name"
              @click="props.getPlayList(item.slug)"
            />
            <div class="karaoke-warp" @click="props.getPlayList(item.slug)">
              <div class="karaoke-detail">
                <p class="karaoke-name">{{ item.name }}</p>
                <p class="karaoke-artists">
                  {{ item.artists?.map((value) => `${value.name}`).join() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/pages/karaoke/search/SearchList.scss"
  lang="scss"
  scoped
></style>
