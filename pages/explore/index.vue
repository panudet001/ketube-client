<script setup lang="ts">
// Store
import * as CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import { useExplorePageStore } from "~/store/useExplorePageStore";
import { environment } from "~/services/environments";
import { useAdsStore } from "~/store/useAdsStore";
const exploreUseAdsStore = useAdsStore();
const explorePageStore = useExplorePageStore();
// Variable
const isRenderFinish = ref<boolean>(false);
const route = useRoute();
const queryGenre = route.query.genre;

// SSR CALL API
await useAsyncData(() => explorePageStore.getByStyle(`${queryGenre}`));

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});
const onClickBtnBetween = () => {
  const uuid = uuid4();
  exploreUseAdsStore.postClick(
    explorePageStore.idAdsBetween,
    CryptoJS.AES.encrypt(uuid, environment.tokenOtt).toString(),
  );
};

const path = environment.urlBaseApp + route.fullPath;
useHead({
  htmlAttrs: { lang: "th" },
  title: " 🔍︎ ค้นหาเพลงของคุณ  🎵 - Ketuber",
  meta: [
    {
      name: "description",
      content:
        "ค้นหาเพลงโปรดของคุณในหน้าค้นหาของเรา ดื่มด่ำไปกับเพลย์ลิสต์ที่ถูกทำขึ้นอย่างพิถีพิถัน สำรวจแนวเพลงใหม่ และให้เรามอบประสบการณ์ร้องเพลงที่ดีที่สุดสำหรับคุณ",
    },
    {
      name: "keywords",
      content: [
        "ketube , ร้องเพลง, karaoke, คาราโอเกะ, เพลง, ร้องเพลงออนไลน์, เพลงออนไลน์, เพลงใหม่, music, เพลงใหม่, ศิลปิน, artist, อัลบั้ม, album, playlist, เพลย์ลิสต์ม, คาราโอเกะออนไลน์, ร้องคาราโอเกะ, โปรแกรมร้องเพลงคาราโอเกะ, เว็บคาราโอเกะ ออนไลน์, youtube, คาราโอเกะพกพา, ดนตรี",
      ],
    },
    { name: "robots", content: "index, follow" },

    // facebook
    { property: "og:title", name: "og:title", content: "ค้นหาเพลงของคุณ" },
    {
      property: "og:description",
      name: "og:description",
      content:
        "ค้นหาเพลงโปรดของคุณในหน้าค้นหาของเรา ดื่มด่ำไปกับเพลย์ลิสต์ที่ถูกทำขึ้นอย่างพิถีพิถัน สำรวจแนวเพลงใหม่ และให้เรามอบประสบการณ์ร้องเพลงที่ดีที่สุดสำหรับคุณ",
    },
    { property: "og:url", name: "og:url", content: path },
    { property: "og:site:name", name: "og:site:name", content: path },
    { property: "og:image", name: "og:image", content: "/favicon.ico" },

    // twitter
    {
      property: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:title",
      name: "twitter:title",
      content: "ค้นหาเพลงของคุณ",
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content:
        "ค้นหาเพลงโปรดของคุณในหน้าค้นหาของเรา ดื่มด่ำไปกับเพลย์ลิสต์ที่ถูกทำขึ้นอย่างพิถีพิถัน สำรวจแนวเพลงใหม่ และให้เรามอบประสบการณ์ร้องเพลงที่ดีที่สุดสำหรับคุณ",
    },
    {
      property: "twitter:image",
      name: "twitter:image",
      content: "/favicon.ico",
    },
    { property: "twitter:site", name: "twitter:site", content: "@ketube" },
  ],
  link: [{ rel: "canonical", href: path }],
});
</script>

<template>
  <div class="explore-page">
    <CoverInfo
      title="ค้นหาเพลงของคุณได้ที่นี่"
      description="ค้นหาเพลงโปรดของคุณในหน้าค้นหาของเรา ดื่มด่ำไปกับเพลย์ลิสต์ที่ถูกทำขึ้นอย่างพิถีพิถัน สำรวจแนวเพลงใหม่ และให้เรามอบประสบการณ์ร้องเพลงที่ดีที่สุดสำหรับคุณ"
    />

    <div class="wrapper-content">
      <div class="section-category">
        <div
          v-if="
            explorePageStore.exploreData?.style &&
            explorePageStore.exploreData?.style.length > 0 &&
            isRenderFinish
          "
          class="slider-content"
        >
          <div
            v-for="(item, index) in explorePageStore.exploreData?.style"
            :key="index"
            class="slider-item"
          >
            <a :href="`/explore?genre=${item.slug}`">
              <button class="btn btn-solid-secondary">{{ item.name }}</button>
            </a>
          </div>
        </div>
      </div>

      <SquareCarousel
        v-if="
          explorePageStore.videoNewReleases &&
          explorePageStore.videoNewReleases?.length > 0 &&
          isRenderFinish
        "
        title="เพลงใหม่ล่าสุด"
        :items="explorePageStore.videoNewReleases"
        :show-icon-hover="true"
        :show-partner="true"
      ></SquareCarousel>

      <SquareCarousel
        v-if="
          explorePageStore.recommendedVideos &&
          explorePageStore.recommendedVideos?.length > 0 &&
          isRenderFinish
        "
        :on-click-btn="onClickBtnBetween"
        title="เพลงแนะนำ"
        :items="explorePageStore.recommendedVideos"
        :show-icon-hover="true"
        :show-partner="true"
      ></SquareCarousel>

      <SquareCarousel
        v-if="
          explorePageStore.recommendedPlaylists &&
          explorePageStore.recommendedPlaylists?.length > 0 &&
          isRenderFinish
        "
        title="เพลย์ลิสต์แนะนำ"
        :items="explorePageStore.recommendedPlaylists"
        :show-text-hover="true"
        :show-text-overlay="true"
        :show-partner="true"
      ></SquareCarousel>

      <CircleCarousel
        v-if="
          explorePageStore.artists &&
          explorePageStore.artists?.length > 0 &&
          isRenderFinish
        "
        title="ศิลปินสุดฮิต"
        :items="explorePageStore.artists"
        :show-text-hover="true"
        :show-text-overlay="true"
      ></CircleCarousel>
    </div>
  </div>
</template>

<style src="assets/scss/pages/explore/explore.scss" lang="scss" scoped></style>
