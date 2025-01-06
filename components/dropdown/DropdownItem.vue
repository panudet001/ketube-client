<script lang="ts" setup>
import { defineProps, ref } from "vue";
import type { Artist } from "~/interfaces/responses/video/Artist";
import { usePlaylistPageStore } from "~/store/usePlaylistPageStore";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { transformError } from "~/utils/transformError";
import { useUserStore } from "~/store/useUserStore";
import { environment } from "~/services/environments";
import { useRemoteStore } from "~/store/useRemoteStore";
import { useVideoStore } from "~/store/useVideoStore";

export interface Item {
  link: string;
  artistLink: string;
  artists?: Artist[];
  albumSlug: string;
  id?: string;
  slug?: string;
}

const props = defineProps<{
  item: Item;
  isShowPlaylist?: boolean;
  isShowAlbum?: boolean;
  isFavoritePlaylist?: boolean;
  resetData?: () => void;
  isShowArtist?: boolean;
}>();

const isShowMenu = ref<boolean>(false);

function showMenu(val: boolean) {
  isShowMenu.value = !val;
}
const playlistPageStore = usePlaylistPageStore();
const videoStore = useVideoStore();

const userStore = useUserStore();
const isShowQueuesButton = ref<boolean>(true);

if (userStore.isShowFavorite && props.item.id) {
  if (userStore.playlists.length === 0 || userStore.videos.length === 0) {
    userStore.getFavorites();
  } else {
    userStore.getFavoritesCookie();
  }
}

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
    if (props.resetData) {
      props.resetData();
    }
  }
}
function saveFavoritePlaylist(val: string) {
  playlistPageStore.addFavorite(val);
  if (playlistPageStore.error) {
    const errMsg = transformError(playlistPageStore.error.message);
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
  } else {
    showSweetAlert(
      "บันทึกไปที่เพลย์ลิสต์ของฉัน",
      "info",
      1000,
      false,
      "top-end",
    );
    userStore.addFavorites("playlists", val);
  }
}
function delFavoritePlaylist(val: string) {
  playlistPageStore.delFavorite(val);
  if (playlistPageStore.error) {
    const errMsg = transformError(playlistPageStore.error.message);
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
  } else {
    showSweetAlert("ลบออกจากเพลย์ลิสต์ของฉัน", "info", 1000, false, "top-end");
    const index = userStore.playlists.indexOf(val);
    userStore.delFavorites("playlists", index);
    if (props.resetData) {
      props.resetData();
    }
  }
}

const remoteStore = useRemoteStore();
let socket: any = null;
const onAddToQueue = (slug: string) => {
  remoteStore.createUser();
  remoteStore.getRoom();
  const user = remoteStore.user;

  socket = io(environment.urlSocket, {
    query: {
      userId: user,
      roomName: remoteStore.room,
    },
  });
  socket.emit("sendMessage", "queue_" + slug);
  showSweetAlert("บันทึกไปที่คิวแล้ว", "info", 1000, false, "top-end");
  isShowQueuesButton.value = false;
};
</script>
<template>
  <li v-if="!isShowPlaylist && !isShowArtist && item.link" class="font-body-4">
    <NuxtLink class="dropdown-item" :to="item?.link">
      <img
        src="assets/images/icons/play_next.png"
        alt="icon-play-next"
        class="me-3 icon-menu"
      />เล่นเพลงนี้</NuxtLink
    >
  </li>
  <li
    v-if="userStore.isShowFavorite && !isShowPlaylist && item.id"
    class="font-body-4"
  >
    <button
      v-if="userStore.videos.includes(item.id) === false"
      class="dropdown-item"
      @click="saveFavoriteVideo(item.id)"
    >
      <span class="material-symbols-outlined me-3 icon-menu"> add_box </span>
      บันทึกเพลงที่ถูกใจ
    </button>
    <button
      v-if="userStore.videos.includes(item.id) === true"
      class="dropdown-item"
      @click="delFavoriteVideo(item.id)"
    >
      <span class="material-symbols-outlined me-3 icon-menu">
        disabled_by_default
      </span>
      ลบเพลงที่ถูกใจ
    </button>
  </li>
  <li
    v-if="
      !isShowPlaylist &&
      !isShowArtist &&
      playlistPageStore.isShowFavorite &&
      item?.slug
    "
  >
    <div
      v-if="isShowQueuesButton"
      class="dropdown-item font-body-4"
      @click="onAddToQueue(item?.slug)"
    >
      <span class="material-symbols-outlined me-3 icon-menu">
        queue_music
      </span>
      เพิ่มเข้าคิว
    </div>
  </li>
  <li v-if="item.albumSlug && isShowAlbum">
    <NuxtLink
      class="dropdown-item font-body-4"
      :href="`/album/${item.albumSlug}`"
    >
      <span class="material-symbols-outlined me-3 icon-menu"> album </span
      >ไปที่อัลบั้ม</NuxtLink
    >
  </li>
  <li v-if="isShowArtist && item.link" class="font-body-4">
    <NuxtLink class="dropdown-item" :href="item?.link">
      <img
        src="assets/images/icons/user.png"
        alt="icon-user"
        class="me-3 icon-menu"
      />ไปที่ศิลปิน
    </NuxtLink>
  </li>
  <li v-if="item?.artistLink && !item?.artists" class="font-body-4">
    <NuxtLink class="dropdown-item" :href="item?.artistLink">
      <img
        src="assets/images/icons/user.png"
        alt="icon-user"
        class="me-3 icon-menu"
      />ไปที่ศิลปิน
    </NuxtLink>
  </li>
  <li v-if="item?.artists" class="font-body-4">
    <div v-if="item?.artists.length > 1" class="dropdown-item sub-dropdown">
      <img
        src="assets/images/icons/user.png"
        alt="icon-user"
        class="me-3 icon-menu"
      />
      <div class="card-icon" @click="showMenu(isShowMenu)">
        <p class="font-body-4">ไปที่ศิลปิน</p>
        <span class="material-symbols-outlined icon-arrow"> arrow_right </span>
      </div>
      <ul
        class="dropdown-sub-menu"
        :style="isShowMenu ? { display: 'block' } : { display: 'none' }"
      >
        <li v-for="(val, idx) in item?.artists" :key="idx">
          <NuxtLink class="dropdown-item" :href="`/artist/${val.slug}`">
            <p class="font-body-4 title-name">
              {{ val.name }}
            </p>
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <NuxtLink
        class="dropdown-item"
        :href="`/artist/${item?.artists[0].slug}`"
      >
        <span class="material-symbols-outlined me-3 icon-menu"> artist </span>
        ไปที่ศิลปิน</NuxtLink
      >
    </div>
  </li>
  <li v-if="!isShowAlbum && isShowPlaylist && item.link" class="font-body-4">
    <NuxtLink class="dropdown-item" :href="`${item?.link}`">
      <span class="material-symbols-outlined me-3 icon-menu">
        video_library
      </span>

      ไปที่เพลย์ลิสต์</NuxtLink
    >
  </li>
  <li
    v-if="userStore.isShowFavorite && isShowPlaylist && item.id"
    class="font-body-4"
  >
    <button
      v-if="userStore.playlists.includes(item.id) === false"
      class="dropdown-item"
      @click="saveFavoritePlaylist(item.id)"
    >
      <span class="material-symbols-outlined me-3 icon-menu">
        playlist_add
      </span>
      เพิ่มไปที่เพลย์ลิสต์ของฉัน
    </button>
    <button
      v-if="userStore.playlists.includes(item.id) === true"
      class="dropdown-item"
      @click="delFavoritePlaylist(item.id)"
    >
      <span class="material-symbols-outlined me-3 icon-menu">
        playlist_remove
      </span>
      ลบเพลย์ลิสต์ของฉัน
    </button>
  </li>
</template>
<style src="/components/dropdown/DropdownItem.scss" lang="scss" scoped></style>
