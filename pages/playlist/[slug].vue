<script setup lang="ts">
import * as CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { usePlaylistPageStore } from "~/store/usePlaylistPageStore";
import { environment } from "~/services/environments";
import { useAdsStore } from "~/store/useAdsStore";

const route = useRoute();
const querySlugParam = route.params.slug.toString();

// Store
const playlistPageStore = usePlaylistPageStore();
const playlistAdsStore = useAdsStore();

// SSR CALL API
await useAsyncData(() => playlistPageStore.getBySlug(querySlugParam));

// Variable
const isActiveMaxWidth = "1020px";

onMounted(() => {
  if (playlistPageStore.playlistData?.description) {
    const element = document.getElementById("description") as HTMLElement;
    element.innerHTML = playlistPageStore.playlistData?.description;
  }
});

const onClickBtn = () => {
  const uuid = uuid4();
  playlistAdsStore.postClick(
    playlistPageStore.idAdsRecommend,
    CryptoJS.AES.encrypt(uuid, environment.tokenOtt).toString(),
  );
};

const path = environment.urlBaseApp + route.fullPath;
useHead({
  htmlAttrs: { lang: "th" },
  title: `เพลย์ลิสต์ ${playlistPageStore.playlistData?.name} | เนื้อเพลง และ วิดีโอ ได้ที่ Ketuber`,
  meta: [
    {
      name: "description",
      content: `${playlistPageStore.playlistData?.description}`,
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
      content: `เพลย์ลิสต์ ${playlistPageStore.playlistData?.name}`,
    },
    {
      property: "og:description",
      name: "og:description",
      content: `${playlistPageStore.playlistData?.description}`,
    },
    { property: "og:url", name: "og:url", content: path },
    { property: "og:site:name", name: "og:site:name", content: path },
    {
      property: "og:image",
      name: "og:image",
      content: `${environment.urlApiImg}/${playlistPageStore.playlistData?.imagePath}`,
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
      content: `เพลย์ลิสต์ ${playlistPageStore.playlistData?.name}`,
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content: `${playlistPageStore.playlistData?.description}`,
    },
    {
      property: "twitter:image",
      name: "twitter:image",
      content: `${environment.urlApiImg}/${playlistPageStore.playlistData?.imagePath}`,
    },
    { property: "twitter:site", name: "twitter:site", content: "@ketube" },
  ],
  link: [{ rel: "canonical", href: path }],
});

const dropdownStates = ref<Record<number, boolean>>({});

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".dropdown-album-container")) {
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

// Variable
const isRenderFinish = ref<boolean>(false);

// Nuxt Hook
const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});
</script>

<template>
  <div class="playlist-page">
    <CoverMusic
      v-if="playlistPageStore.playlistData"
      :id="playlistPageStore.playlistData.id"
      page-name="เพลย์ลิสต์"
      :title="playlistPageStore.playlistData?.name"
      :title-color="playlistPageStore.playlistData?.nameColor"
      :subtitle="playlistPageStore.playlistData?.artists"
      :background-image-url="`${environment.urlApiImg}/${playlistPageStore.playlistData?.imageCoverPath}`"
      :image-url="`${environment.urlApiImg}/${playlistPageStore.playlistData?.imagePath}`"
      :description="playlistPageStore.playlistData?.description"
    >
    </CoverMusic>

    <div class="wrapper-content">
      <div class="section-playlist">
        <div class="section-left" :style="{ maxWidth: isActiveMaxWidth }">
          <PlaylistMusic
            v-if="
              playlistPageStore.videoPlaylist &&
              playlistPageStore.videoPlaylist.length > 0 &&
              isRenderFinish == true
            "
            :items="playlistPageStore.videoPlaylist"
            :is-show-album="true"
            :is-show-header="true"
            :is-show-partner="true"
          ></PlaylistMusic>
        </div>
        <div
          v-if="
            playlistPageStore.recommendedPlaylists &&
            playlistPageStore.recommendedPlaylists.length > 0 &&
            isRenderFinish == true
          "
          class="section-right"
        >
          <h6>เพลย์ลิสต์แนะนำ</h6>
          <div
            v-for="(item, index) in playlistPageStore.recommendedPlaylists"
            :key="index"
            class="recommended"
          >
            <NuxtLink
              v-if="item.ads"
              :to="item.link"
              target="_blank"
              @click="onClickBtn"
            >
              <div class="card-playlist">
                <div class="cart-tag">Ads</div>
                <img
                  :src="`${item.imageURL}`"
                  class="cover-music"
                  alt="cover-music"
                />

                <div class="cover-mask"></div>
              </div>
              <p class="recommended-title font-body-3">
                {{ item.title }}
              </p>
            </NuxtLink>
            <div v-if="!item.ads">
              <NuxtLink :to="item.link">
                <div class="card-playlist">
                  <img
                    :src="item.imageURL"
                    class="cover-music"
                    alt="cover-music"
                  />
                  <div class="cover-mask"></div>
                  <div class="cover-body font-subtitle-1">
                    {{ item.title }}
                  </div>
                </div>
              </NuxtLink>
              <div
                class="recommended-title font-subtitle-3 d-flex justify-content-between"
              >
                {{ item.title }}
                <div class="dropdown-album-container">
                  <span
                    class="material-symbols-outlined icon-w"
                    @click="toggleDropdown(index)"
                  >
                    more_vert
                  </span>
                  <ul v-if="dropdownStates[index]" class="dropdown">
                    <dropdown-item
                      :item="item"
                      :is-show-playlist="true"
                      :is-favorite-playlist="true"
                    ></dropdown-item>
                  </ul>
                </div>
              </div>
              <div v-if="item.description">
                <p
                  id="playlist-description"
                  class="recommended-description font-body-3"
                  v-html="item.description"
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="playlistPageStore.playlistData?.description"
        class="card-about"
      >
        <h6>เกี่ยวกับ {{ playlistPageStore.playlistData?.name }}</h6>
        <p id="description" class="font-body-1"></p>
      </div>
      <div v-if="playlistPageStore.adsAboveFooter" class="banners">
        <a :href="playlistPageStore.adsAboveFooter?.url" target="_blank">
          <img
            style="width: 100%; margin: 30px auto 50px"
            :src="playlistPageStore.adsAboveFooter?.imageDesktopPath"
            class="image-banner"
            alt="banners"
            @click="
              playlistAdsStore.postClick(
                playlistPageStore.adsAboveFooter?.id!,
                CryptoJS.AES.encrypt(
                  playlistPageStore.adsAboveFooter?.id,
                  environment.tokenOtt,
                ).toString(),
              )
            "
          />
        </a>
      </div>
    </div>
  </div>
</template>
<style
  src="assets/scss/pages/playlist/playlist.scss"
  lang="scss"
  scoped
></style>
