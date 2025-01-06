<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useSearchStore } from "~/store/useSearchStore";
import SearchNotData from "~/components/pages/search/not-data/search-not-data.vue";

const route = useRoute();
const querySlugParam = route.params.name.toString();
const searchStore = useSearchStore();
await useAsyncData(() => searchStore.getBySlug(querySlugParam));
const musicList = searchStore.videos;
const artistList = searchStore.artists;
const albumList = searchStore.albums;
const playlistList = searchStore.playlists;
const checkItem =
  (musicList.length > 0 ? 1 : 0) +
  (artistList.length > 0 ? 1 : 0) +
  (albumList.length > 0 ? 1 : 0) +
  (playlistList.length > 0 ? 1 : 0);
const sumLength =
  musicList.length + artistList.length + albumList.length + playlistList.length;
const category = [
  {
    id: "pills-music-tab",
    name: "เพลง",
    tag: "#music",
    controls: "pills-music",
    length: musicList.length,
    active: !!(checkItem < 2 && musicList.length > 0),
  },
  {
    id: "pills-album-tab",
    name: "อัลบั้ม",
    tag: "#album",
    controls: "pills-album",
    length: albumList.length,
    active: !!(checkItem < 2 && albumList.length > 0),
  },
  {
    id: "pills-playlist-tab",
    name: "เพลย์ลิสต์",
    tag: "#playlist",
    controls: "pills-playlist",
    length: playlistList.length,
    active: !!(checkItem < 2 && playlistList.length > 0),
  },
  {
    id: "pills-artist-tab",
    name: "ศิลปิน",
    tag: "#artist",
    controls: "pills-artist",
    length: artistList.length,
    active: !!(checkItem < 2 && artistList.length > 0),
  },
];

const dropdownStates = ref<Record<number, boolean>>({});

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".table-action")) {
    dropdownStates.value = {};
  }
}

function toggleDropdown(index: number) {
  const check = dropdownStates.value[index];
  dropdownStates.value = {};
  dropdownStates.value[index] = !check;
}

onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});

const isRenderFinish = ref<boolean>(false);

const showHerder = false;

// Nuxt Hook
const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});
</script>
<template>
  <div class="search-page">
    <div
      v-if="
        musicList.length > 0 ||
        artistList.length > 0 ||
        albumList.length > 0 ||
        playlistList.length > 0
      "
      class="wrapper-content"
    >
      <h4>ผลการค้นหาสำหรับ “ {{ querySlugParam }} ”</h4>
      <p class="font-body-1">จำนวนทั้งหมด {{ sumLength }} รายการ</p>
      <div id="pills-tab" class="nav nav-pills m-t-24" role="tablist">
        <div class="section-category" role="presentation">
          <div class="slider-content">
            <div v-if="checkItem >= 2" class="slider-item">
              <button
                id="pills-all-tab"
                class="btn btn-solid-secondary active font-subtitle-3"
                data-bs-toggle="pill"
                data-bs-target="#pills-all"
                type="button"
                role="tab"
                aria-controls="pills-all"
                aria-selected="true"
              >
                ทั้งหมด
              </button>
            </div>
            <div
              v-for="(item, index) in category.filter((val) => val.length > 0)"
              :key="index"
              class="slider-item"
            >
              <button
                :id="item.id"
                class="btn btn-solid-secondary font-subtitle-3"
                :class="item.active ? 'active' : ''"
                data-bs-toggle="pill"
                :data-bs-target="item.tag"
                type="button"
                role="tab"
                :aria-controls="item.controls"
                aria-selected="false"
              >
                {{ item.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="pills-tabContent" class="tab-content">
        <div
          v-if="checkItem >= 2"
          id="pills-all"
          class="tab-pane fade show active"
          role="tabpanel"
          aria-labelledby="pills-all-tab"
        >
          <div
            v-if="musicList && musicList.length > 0 && isRenderFinish"
            class="top-container"
          >
            <div class="popular-card">
              <p class="font-subtitle-1">ผลการค้นหาที่ใกล้เคียง</p>
              <div class="bk-card rounded">
                <div class="new-card">
                  <NuxtLink :to="`${musicList[0].link}`">
                    <div class="card-song-new">
                      <img
                        :src="`${musicList[0].imageURL}`"
                        alt="Image"
                        class="new-image"
                      />
                      <i class="las la-play-circle img-play"></i>
                      <div class="bk-img"></div>
                    </div>
                  </NuxtLink>

                  <div class="new-text">
                    <NuxtLink :to="`${musicList[0].link}`">
                      <p class="title font-button-1">
                        {{ musicList[0].name }}
                      </p>
                    </NuxtLink>
                    <div class="title-sub font-body-2">
                      <span>Song • </span>
                      <span
                        v-for="(item, index) in musicList[0].artists"
                        :key="index"
                      >
                        <NuxtLink
                          :to="`/artist/${item.slug}`"
                          class="title-link font-body-2"
                          >{{ item.name }}
                        </NuxtLink>
                        <span
                          v-if="index + 1 !== musicList[0]?.artists?.length"
                          class="font-body-1"
                          >,
                        </span>
                      </span>
                    </div>
                    <PartnerCard
                      v-if="musicList[0].partnerName"
                      :partner-name="musicList[0].partnerName"
                      :partner-image="musicList[0].partnerImage"
                    ></PartnerCard>
                  </div>
                </div>
              </div>
            </div>
            <div class="music-card">
              <p class="font-subtitle-1">เพลง</p>
              <div class="select-item">
                <table class="custom-table">
                  <th v-if="showHerder"></th>
                  <tbody>
                    <tr
                      v-for="(item, index) in musicList.slice(0, 4)"
                      :key="index"
                      class="tbody"
                    >
                      <td class="table-music">
                        <NuxtLink :to="item.link" class="music-group">
                          <img
                            :src="item.imageURL"
                            alt="cover-image"
                            class="cover-music"
                          />
                          <div class="cover-mask">
                            <i class="las la-play-circle icon-play"></i>
                          </div>
                          <div class="music">
                            <div class="font-body-1 music-name">
                              {{ item.name }}
                              <span class="font-body-1"> - </span>
                              <NuxtLink
                                :to="'/artist/' + item.artistSlug"
                                class="sub-link music-artist font-body-1"
                              >
                                {{ item.artist }}
                              </NuxtLink>
                            </div>
                            <PartnerCard
                              v-if="item.partnerName"
                              :partner-name="item.partnerName"
                              :partner-image="item.partnerImage"
                            ></PartnerCard>
                          </div>
                        </NuxtLink>
                      </td>
                      <td class="table-add font-body-3">
                        <NuxtLink class="dropdown-item" :to="item.link">
                          <span class="material-symbols-outlined icon-w">
                            queue_music
                          </span>
                        </NuxtLink>
                      </td>
                      <td class="table-action" @click="toggleDropdown(index)">
                        <div class="section-profile">
                          <i class="las la-ellipsis-v icon-w"></i>
                          <ul v-if="dropdownStates[index]" class="dropdown">
                            <dropdown-item :item="item"></dropdown-item>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div
            v-if="artistList && artistList.length > 0 && isRenderFinish"
            class="m-t-50 m-b-50"
          >
            <CircleCarousel
              title="ศิลปิน"
              :items="artistList"
              :show-text-hover="true"
              :show-text-overlay="true"
            ></CircleCarousel>
          </div>
          <div v-if="albumList && albumList.length > 0 && isRenderFinish">
            <SquareCarousel
              title="อัลบั้ม"
              :items="albumList"
              :show-icon-hover="true"
              :show-text-overlay="true"
              :show-album="true"
              class-name="albumList"
            ></SquareCarousel>
          </div>
          <div v-if="playlistList && playlistList.length > 0 && isRenderFinish">
            <SquareCarousel
              title="เพลย์ลิสต์"
              :items="playlistList"
              :show-text-overlay="true"
              :show-playlist="true"
              class-name="playlistList"
            ></SquareCarousel>
          </div>
        </div>
        <div
          id="music"
          class="tab-pane fade m-b-21"
          :class="checkItem < 2 && musicList.length > 0 ? 'show active' : ''"
          role="tabpanel"
          aria-labelledby="pills-music-tab"
        >
          <PlaylistMusic
            v-if="musicList && musicList.length > 0 && isRenderFinish"
            :items="musicList"
            :is-show-album="true"
            :is-show-header="true"
            :is-show-partner="true"
          ></PlaylistMusic>
          <div v-else>
            <SearchNotData :keyword="querySlugParam" />
          </div>
        </div>
        <div
          id="album"
          class="tab-pane fade"
          :class="checkItem < 2 && albumList.length > 0 ? 'show active' : ''"
          role="tabpanel"
          aria-labelledby="pills-album-tab"
        >
          <SquareCard
            v-if="albumList && albumList.length > 0 && isRenderFinish"
            :items="albumList"
            :show-icon-hover="true"
            :is-show-album="true"
            :is-show-playlist="true"
            class-name="albumList"
          ></SquareCard>
          <div v-else>
            <SearchNotData :keyword="querySlugParam" />
          </div>
        </div>
        <div
          id="playlist"
          class="tab-pane fade m-b-21"
          :class="checkItem < 2 && playlistList.length > 0 ? 'show active' : ''"
          role="tabpanel"
          aria-labelledby="pills-playlist-tab"
        >
          <SquareCard
            v-if="playlistList && playlistList.length > 0 && isRenderFinish"
            :items="playlistList"
            :is-show-cover-title="true"
            :is-show-playlist="true"
            class-name="playlistList"
          ></SquareCard>
          <div v-else>
            <SearchNotData :keyword="querySlugParam" />
          </div>
        </div>
        <div
          id="artist"
          class="tab-pane fade m-b-21"
          :class="checkItem < 2 && artistList.length > 0 ? 'show active' : ''"
          role="tabpanel"
          aria-labelledby="pills-artist-tab"
        >
          <CircleCard
            v-if="artistList && artistList.length > 0 && isRenderFinish"
            :items="artistList"
          ></CircleCard>
          <div v-else>
            <SearchNotData :keyword="querySlugParam" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        musicList.length === 0 &&
        artistList.length === 0 &&
        albumList.length === 0 &&
        playlistList.length === 0
      "
      class="not-data-card"
    >
      <h4 class="title-not-data">
        ไม่พบผลการค้นหาสำหรับ “ {{ querySlugParam }} ”
      </h4>
      <p class="font-body-1">
        กรุณาตรวจสอบการสะกดคำให้ถูกต้อง ปรับลดจำนวนคำให้มีความกระชับ
        หรือใช้คีย์เวิร์ดอื่น
      </p>
    </div>
  </div>
</template>
<style src="assets/scss/pages/search/search.scss" lang="scss" scoped></style>
