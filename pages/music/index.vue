<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useMusicStore } from "~/store/useMusicPageStore";
import { usePlaylistPageStore } from "~/store/usePlaylistPageStore";
import { useVideoStore } from "~/store/useVideoStore";

definePageMeta({
  layout: "profile",
  middleware: "auth",
});

const route = useRoute();
const tag = route.query.tag ?? "like";

const musicPageStore = useMusicStore();
const userPlaylist = usePlaylistPageStore();
const videoStore = useVideoStore();

const isRenderFinish = ref<boolean>(false);

const activeTag = ref<string>(tag.toString());

onMounted(() => getData(activeTag.value));

watch(activeTag, () => {
  getData(activeTag.value);
});

function getData(val: string) {
  if (val === "playlist") {
    userPlaylist.getPlaylistFavorite();
  }
  if (val === "like") {
    videoStore.getFavorite();
  }
  if (val === "history") {
    videoStore.getFavorite();
  }
}

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});

watch(
  () => route.query,
  (newQuery) => {
    const query = newQuery.tag;
    if (query) {
      activeTag.value = query.toString();
    }
  },
);

useHead({
  title: "Profile",
});

const dropdownStates = ref<boolean>(false);
const arrow = ref<string>("asc");
const filter = ref<string>();
// asc = down, desc = up

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".dropdown-filter")) {
    dropdownStates.value = false;
  }
}

function toggleDropdown() {
  dropdownStates.value = !dropdownStates.value;
}

function filterData(val: string, name: string) {
  if (filter.value && filter.value === name) {
    arrow.value = val === "desc" ? "asc" : "desc";
    filter.value = name;
  } else {
    arrow.value = "desc";
    filter.value = name;
  }
}

onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});

function resetData() {
  setTimeout(() => {
    userPlaylist.getPlaylistFavorite();
    videoStore.getFavorite();
  }, 500);
}
</script>
<template>
  <div v-if="isRenderFinish === true" class="music-page">
    <div class="wrapper-content">
      <div class="card-item-music">
        <h4>คลังเพลงของฉัน</h4>
        <ul class="nav nav-tabs m-t-20">
          <li class="nav-item">
            <a
              class="nav-link font-button-2"
              :class="activeTag === 'like' ? 'active' : ''"
              aria-current="page"
              href="#"
              data-bs-toggle="tab"
              data-bs-target="#like"
              @click="getData('like')"
              >ถูกใจแล้ว</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link font-button-2"
              :class="activeTag === 'playlist' ? 'active' : ''"
              aria-current="page"
              href="#"
              data-bs-toggle="tab"
              data-bs-target="#playlist"
              @click="getData('playlist')"
              >เพลย์ลิสต์ของฉัน</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link font-button-2"
              :class="activeTag === 'history' ? 'active' : ''"
              aria-current="page"
              href="#"
              data-bs-toggle="tab"
              data-bs-target="#history"
              @click="getData('history')"
              >ร้องล่าสุด</a
            >
          </li>
        </ul>
        <div class="tab-content">
          <div
            id="like"
            class="tab-pane"
            :class="activeTag === 'like' ? 'active' : ''"
            role="tabpanel"
            aria-labelledby="profile-tab"
            tabindex="0"
          >
            <div class="card-like">
              <div class="cart-header">
                <h6>{{ videoStore.videoFavorite.length ?? 0 }} เพลง</h6>
                <div class="cart-search d-none">
                  <div class="dropdown-filter">
                    <button class="btn btn-filter" @click="toggleDropdown()">
                      <span class="material-symbols-outlined"> tune </span>
                      <p class="text-filter">ตัวกรอง</p>
                    </button>
                    <ul v-if="dropdownStates" class="dropdown">
                      <li><p class="font-body-3 title-top">เรียงจาก</p></li>
                      <li>
                        <div
                          class="dropdown-item"
                          @click="filterData(arrow, 'name')"
                        >
                          <p class="font-body-2">ชื่อเพลง</p>
                          <span
                            v-if="arrow === 'desc' && filter === 'name'"
                            class="material-symbols-outlined icon-up"
                          >
                            arrow_upward
                          </span>
                          <span
                            v-if="arrow === 'asc' && filter === 'name'"
                            class="material-symbols-outlined icon-up"
                          >
                            arrow_downward
                          </span>
                        </div>
                      </li>
                      <li>
                        <div
                          class="dropdown-item"
                          @click="filterData(arrow, 'artist')"
                        >
                          <p class="font-body-2">ศิลปิน</p>
                          <span
                            v-if="arrow === 'desc' && filter === 'artist'"
                            class="material-symbols-outlined icon-up"
                          >
                            arrow_upward
                          </span>
                          <span
                            v-if="arrow === 'asc' && filter === 'artist'"
                            class="material-symbols-outlined icon-up"
                          >
                            arrow_downward
                          </span>
                        </div>
                      </li>
                      <li>
                        <div
                          class="dropdown-item"
                          @click="filterData(arrow, 'album')"
                        >
                          <p class="font-body-2">อัลบัม</p>
                          <span
                            v-if="arrow === 'desc' && filter === 'album'"
                            class="material-symbols-outlined icon-up"
                          >
                            arrow_upward
                          </span>
                          <span
                            v-if="arrow === 'asc' && filter === 'album'"
                            class="material-symbols-outlined icon-up"
                          >
                            arrow_downward
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="input-group-rounded">
                    <input
                      class="form-control rounded-normal"
                      type="text"
                      placeholder="ค้นหาวิดีโอเพลง"
                    />
                    <span class="input-group-text">
                      <span class="material-symbols-outlined icon-search">
                        search
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <PlaylistMusic
                  v-if="
                    videoStore.videoFavorite &&
                    videoStore.videoFavorite.length > 0
                  "
                  :items="videoStore.videoFavorite"
                  :is-show-header="true"
                  :is-show-album="true"
                  :is-show-partner="true"
                  :reset-data="resetData"
                ></PlaylistMusic>
                <div v-else class="card-not-data">
                  <img
                    src="~assets/images/backgrounds/empty.png"
                    alt="empty"
                    width="170"
                    class="mt-5"
                  />
                  <p class="font-subtitle-2 mt-2">ไม่พบข้อมูล</p>
                </div>
              </div>
            </div>
          </div>
          <div
            id="playlist"
            class="tab-pane"
            :class="activeTag === 'playlist' ? 'active' : ''"
            role="tabpanel"
            aria-labelledby="profile-tab"
            tabindex="0"
          >
            <div class="card-play-list">
              <div class="cart-header">
                <h6>เพลย์ลิสต์ของฉัน</h6>
                <div class="cart-search d-none">
                  <div class="input-group-rounded">
                    <input
                      class="form-control rounded-normal"
                      type="text"
                      placeholder="ค้นหาวิดีโอเพลง"
                    />
                    <span class="input-group-text">
                      <span class="material-symbols-outlined icon-search">
                        search
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="cart-body-list">
                <div
                  v-if="
                    userPlaylist.playlistFavorite &&
                    userPlaylist.playlistFavorite.length > 0 &&
                    isRenderFinish === true
                  "
                  class="section-playlist-card"
                >
                  <SquareCard
                    :items="userPlaylist.playlistFavorite"
                    :is-show-playlist="true"
                    :reset-data="resetData"
                  ></SquareCard>
                </div>
                <div
                  v-if="
                    userPlaylist.playlistFavorite.length === 0 ||
                    !userPlaylist.playlistFavorite
                  "
                  class="card-not-data"
                >
                  <img
                    src="~assets/images/backgrounds/empty.png"
                    alt="empty"
                    width="170"
                    class="mt-5"
                  />
                  <p class="font-subtitle-2 mt-2">ไม่พบข้อมูล</p>
                </div>
              </div>
            </div>
          </div>
          <div
            id="history"
            class="tab-pane"
            :class="activeTag === 'history' ? 'active' : ''"
            role="tabpanel"
            aria-labelledby="profile-tab"
            tabindex="0"
          >
            <div class="card-history">
              <div class="cart-header">
                <h6>เพลงที่ร้องล่าสุด</h6>
              </div>
              <div class="card-body">
                <PlaylistMusic
                  v-if="
                    musicPageStore.recent && musicPageStore.recent.length > 0
                  "
                  :items="musicPageStore.recent"
                  :is-show-header="true"
                  :is-show-album="true"
                  :is-show-partner="true"
                ></PlaylistMusic>
                <div
                  v-if="
                    musicPageStore.recent.length === 0 || !musicPageStore.recent
                  "
                  class="card-not-data"
                >
                  <img
                    src="~assets/images/backgrounds/empty.png"
                    alt="empty"
                    width="170"
                    class="mt-5"
                  />
                  <p class="font-subtitle-2 mt-2">ไม่พบข้อมูล</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="assets/scss/pages/music/music.scss" lang="scss" scoped></style>
