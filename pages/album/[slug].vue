<script setup lang="ts">
import * as CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { environment } from "~/services/environments";
import { useAlbumPageStore } from "~/store/useAlbumUsPageStore";
import { useAdsStore } from "~/store/useAdsStore";

const route = useRoute();
const querySlugParam = route.params.slug.toString();

// Store
const albumPageStore = useAlbumPageStore();
const albumAdsStore = useAdsStore();
const uuid = uuid4();

// SSR CALL API
await useAsyncData(() => albumPageStore.getBySlug(querySlugParam));

// Variable
const isActiveMaxWidth = "1020px";

onMounted(() => {
  if (albumPageStore.albumData?.description) {
    const element = document.getElementById("description") as HTMLElement;
    element.innerHTML = albumPageStore.albumData?.description;
  }
});

const path = environment.urlBaseApp + route.fullPath;
useHead({
  htmlAttrs: { lang: "th" },
  title: `อัลบั้ม ${albumPageStore.albumData?.name} ของ ${albumPageStore.albumData?.artist.name} | เพลง และ วิดีโอ ได้ที่ Ketuber`,
  meta: [
    {
      name: "description",
      content: `${albumPageStore.albumData?.description}`,
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
      content: `อัลบั้ม ${albumPageStore.albumData?.name} ของ ${albumPageStore.albumData?.artist.name}`,
    },
    {
      property: "og:description",
      name: "og:description",
      content: `${albumPageStore.albumData?.description}`,
    },
    { property: "og:url", name: "og:url", content: path },
    { property: "og:site:name", name: "og:site:name", content: path },
    {
      property: "og:image",
      name: "og:image",
      content: `${environment.urlApiImg}/${albumPageStore.albumData?.imagePath}`,
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
      content: `อัลบั้ม ${albumPageStore.albumData?.name} ของ ${albumPageStore.albumData?.artist.name}`,
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content: `${albumPageStore.albumData?.description}`,
    },
    {
      property: "twitter:image",
      name: "twitter:image",
      content: `${environment.urlApiImg}/${albumPageStore.albumData?.imagePath}`,
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
</script>

<template>
  <div class="playlist-page">
    <CoverMusic
      page-name="อัลบั้ม"
      :title="albumPageStore.albumData?.name"
      :title-color="albumPageStore.albumData?.nameColor"
      :subtitle="''"
      :background-image-url="`${environment.urlApiImg}/${albumPageStore.albumData?.imageCoverPath}`"
      :image-url="`${environment.urlApiImg}/${albumPageStore.albumData?.imagePath}`"
      :description="albumPageStore.albumData?.description"
    >
    </CoverMusic>

    <div class="wrapper-content">
      <div class="section-playlist">
        <div class="section-left" :style="{ maxWidth: isActiveMaxWidth }">
          <PlaylistMusic
            v-if="
              albumPageStore.albumData?.videos &&
              albumPageStore.videos.length > 0
            "
            :items="albumPageStore.videos"
            :is-show-album="false"
            :is-show-header="true"
          ></PlaylistMusic>
        </div>
        <div
          v-if="
            albumPageStore.recommendedAlbums &&
            albumPageStore.recommendedAlbums.length > 0
          "
          class="section-right"
        >
          <h6>เพลย์ลิสต์แนะนำ</h6>
          <div
            v-for="(item, index) in albumPageStore.recommendedAlbums"
            :key="index"
            class="recommended"
          >
            <div>
              <NuxtLink :to="item.slug">
                <div class="card-playlist">
                  <img
                    :src="item.imagePath"
                    class="cover-music"
                    alt="cover-music"
                  />
                  <div class="cover-mask"></div>
                  <p class="cover-body h7">
                    {{ item.name }}
                  </p>
                </div>
              </NuxtLink>
              <div
                class="recommended-title font-subtitle-3 d-flex justify-content-between"
              >
                {{ item.name }}
                <div
                  class="dropdown-album-container"
                  @click="toggleDropdown(index)"
                >
                  <span class="material-symbols-outlined icon-w">
                    more_vert
                  </span>
                  <ul v-if="dropdownStates[index]" class="dropdown">
                    <li>
                      <NuxtLink
                        class="dropdown-item font-body-4"
                        :href="item.link"
                      >
                        <span class="material-symbols-outlined me-3 icon-menu">
                          album
                        </span>
                        ไปที่อัลบั้ม</NuxtLink
                      >
                    </li>
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
        v-if="albumPageStore.albumData?.description"
        id="about"
        class="card-about"
      >
        <h6>เกี่ยวกับ {{ albumPageStore.albumData?.name }}</h6>
        <p id="description" class="font-body-1"></p>
      </div>

      <div v-if="albumPageStore.adsAboveFooter" class="banners">
        <a :href="albumPageStore.adsAboveFooter?.url" target="_blank">
          <img
            style="width: 100%; margin: 200px auto 50px"
            :src="albumPageStore.adsAboveFooter?.imageDesktopPath"
            class="image-banner"
            alt="banners"
            @click="
              albumAdsStore.postClick(
                albumPageStore.adsAboveFooter?.id!,
                CryptoJS.AES.encrypt(uuid, environment.tokenOtt).toString(),
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
