<script lang="ts" setup>
import { defineProps, onMounted, ref } from "vue";
import { useKaraokeStore } from "~/store/useKaraokeStore";
import { useUserStore } from "~/store/useUserStore";
import { useVideoStore } from "~/store/useVideoStore";
import { transformError } from "~/utils/transformError";
import { showSweetAlert } from "~/utils/showSweetAlert";

const props = defineProps<{
  removeQueue: () => void;
  removeQueueByIndex: (index: number) => void;
  removeVideoPlaying: () => void;
  moveUpQueueIndex: (index: number) => void;
  styleAdd?: string;
}>();
// Store
const karaokeStore = useKaraokeStore();
const userStore = useUserStore();
const videoStore = useVideoStore();

// variable
const dropdownStates = ref<Record<number, boolean>>({});
// hook
onMounted(() => {
  window.addEventListener("click", closeDropdown);

  window.addEventListener("resize", function () {
    const width = window.innerWidth;
    const adsDetail = document.getElementById(
      "section-drag-drop",
    ) as HTMLInputElement;
    if (width > 800 && adsDetail) {
      adsDetail.style.maxHeight = "100%";
    } else if (karaokeStore.queues.length > 4 && adsDetail) {
      adsDetail.style.maxHeight = "294px";
    }
  });
});

watch(
  () => karaokeStore.queues.length > 4,
  () => {
    const width = window.innerWidth;
    if (width <= 800) {
      const adsDetail = document.getElementById(
        "section-drag-drop",
      ) as HTMLInputElement;

      if (adsDetail) {
        adsDetail.style.maxHeight = "294px";
      }
    }
  },
);

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

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".search-setting")) {
    dropdownStates.value = {};
  }
};

const removeQueues = (index: number) => {
  karaokeStore.removeQueue(index);
  props.removeQueueByIndex(index);
  dropdownStates.value = {};
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
  <div class="que-list-component">
    <div v-if="karaokeStore.playing">
      <div class="que-total">
        <span class="text-que-music font-subtitle-3"
          ><i class="las la-list"></i>คิวเพลง</span
        >
        <p class="duration-total font-body-2">
          <span>•</span>
          <span class="text-duration-total">
            {{ karaokeStore.queues.length }} เพลง</span
          >
        </p>
      </div>
      <p class="text-playing font-subtitle-3 mb-2">กำลังเล่น</p>
      <div class="playing">
        <div class="playing-music">
          <img
            :src="karaokeStore.playing?.imageURL"
            :alt="karaokeStore.playing?.name"
            class="cover-music"
          />
          <div class="group-music">
            <p class="text-music font-body-2">
              {{ karaokeStore.playing?.name }}
            </p>
            <p class="text-artist font-body-2">
              {{ karaokeStore.playing?.artists }}
            </p>
          </div>
        </div>

        <div class="section-action">
          <img
            src="../../../../assets/images/icons/sound-2.svg"
            alt="sound-icon"
            class="sound-icon"
          />
          <button
            class="btn btn-icon"
            @click="
              () => {
                karaokeStore.removeVideoPlaying();
                props.removeVideoPlaying();
              }
            "
          >
            <i class="las la-trash-alt icon-del"></i>
          </button>
        </div>
      </div>
      <div class="section-remove-queue">
        <p class="text-playing font-subtitle-3">เพลงถัดไป</p>
        <button
          class="btn btn-view-all"
          @click="
            () => {
              karaokeStore.clearQueues();
              props.removeQueue();
            }
          "
        >
          <i class="las la-trash-alt icon-queue-del"></i>
          <span>ลบคิวทั้งหมด</span>
        </button>
      </div>
    </div>

    <div v-if="karaokeStore.queues.length <= 0" class="que-not">
      <img
        src="../../../../assets/images/icons/music-folder.png"
        class="img"
        alt="music-folder"
      />

      <p class="font-body-1">ไม่มีคิวเพลงเพิ่มเติม</p>
    </div>

    <div
      v-if="karaokeStore.queues.length > 0"
      id="section-drag-drop"
      class="section-drag-drop"
      :style="{ height: props.styleAdd }"
    >
      <div
        v-for="(item, index) in karaokeStore.queues"
        :key="index"
        class="drag-drop"
      >
        <div class="music">
          <div :style="[index != 0 ? { width: 'auto' } : { width: '23px' }]">
            <i
              v-if="index != 0"
              class="las la-arrow-up icon-up"
              @click="
                () => {
                  karaokeStore.moveUpQueue(index);
                  props.moveUpQueueIndex(index);
                }
              "
            ></i>
          </div>
          <img :src="item.imageURL" :alt="item.name" class="cover-music" />
          <div class="group-music">
            <p class="text-music font-body-2">{{ item.name }}</p>
            <p class="text-artist font-body-2">
              {{ item.artists }}
            </p>
          </div>
        </div>
        <div class="search-setting">
          <img
            src="assets/images/icons/detail.svg"
            class="icon-w i"
            alt="detail"
            @click="toggleDropdown(index)"
          />
          <ul v-if="dropdownStates[index]" class="dropdown">
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
                />ไปที่อัลบั้ม</NuxtLink
              >
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
                />ไปที่ศิลปิน</NuxtLink
              >
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
              <NuxtLink class="dropdown-item" @click="removeQueues(index)">
                <img
                  src="assets/images/icons/trash-s.png"
                  alt="icon-item"
                  class="icon-item"
                />ลบออกจากคิว
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/pages/karaoke/queue-list/QueueList.scss"
  lang="scss"
  scoped
></style>
