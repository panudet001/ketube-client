<script setup lang="ts">
// Store
import * as CryptoJS from "crypto-js";
import { useArtistPageStore } from "~/store/useArtistPageStore";
import { environment } from "~/services/environments";
import type { Item } from "~/components/card/CircleCard.vue";
import { useAdsStore } from "~/store/useAdsStore";

const artistPageStore = useArtistPageStore();
const artistAdsStore = useAdsStore();

const route = useRoute();
const queryGenre = route.query.genre;

// SSR CALL API
await useAsyncData(() => artistPageStore.getAllByStyle(`${queryGenre}`));

const path = environment.urlBaseApp + route.fullPath;
useHead({
  htmlAttrs: { lang: "th" },
  title: "ศิลปินทั้งหมด 👨‍🎤 👩‍🎤 🎤- Ketuber",
  meta: [
    {
      name: "description",
      content:
        "ร่วมค้นหาบทเพลงอันยอดเยี่ยมจากรายชื่อศิลปินคนโปรดของคุณที่ทางเราคัดเลือกมาอย่างพิถีพิถัน พร้อมทั้งศิลปินอื่นๆที่กำลังเป็นที่นิยมในขณะนี้",
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
      content: "ศิลปินทั้งหมด - Ketuber",
    },
    {
      property: "og:description",
      name: "og:description",
      content:
        "ร่วมค้นหาบทเพลงอันยอดเยี่ยมจากรายชื่อศิลปินคนโปรดของคุณที่ทางเราคัดเลือกมาอย่างพิถีพิถัน พร้อมทั้งศิลปินอื่นๆที่กำลังเป็นที่นิยมในขณะนี้",
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
      content: "ศิลปินทั้งหมด - Ketuber",
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content:
        "ร่วมค้นหาบทเพลงอันยอดเยี่ยมจากรายชื่อศิลปินคนโปรดของคุณที่ทางเราคัดเลือกมาอย่างพิถีพิถัน พร้อมทั้งศิลปินอื่นๆที่กำลังเป็นที่นิยมในขณะนี้",
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
  <div class="artists-page">
    <CoverInfo
      page-name="ศิลปิน"
      title="ค้นหาเพลงจากนักร้องคนโปรดของคุณ"
      description="ร่วมค้นหาบทเพลงอันยอดเยี่ยมจากรายชื่อศิลปินคนโปรดของคุณที่ทางเราคัดเลือกมาอย่างพิถีพิถัน พร้อมทั้งศิลปินอื่นๆที่กำลังเป็นที่นิยมในขณะนี้"
    />

    <div class="wrapper-content">
      <div class="section-category">
        <div
          v-if="
            artistPageStore.artistsPageData?.styles &&
            artistPageStore.artistsPageData?.styles.length > 0
          "
          class="slider-content"
        >
          <div
            v-for="(item, index) in artistPageStore.artistsPageData?.styles"
            :key="index"
            class="slider-item"
          >
            <a :href="`/artists?genre=${item.slug}`">
              <button class="btn btn-solid-secondary">{{ item.name }}</button>
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="
          artistPageStore.artistsPageData?.groups &&
          artistPageStore.artistsPageData?.groups.length > 0
        "
      >
        <div
          v-for="(group, index) in artistPageStore.artistsPageData?.groups"
          :key="index"
          class="group-card-container"
        >
          <h6 class="m-b-20">{{ group.name }}</h6>
          <CircleCard
            :items="
              group.artists.map((value) => {
                return {
                  title: value.name,
                  description: '',
                  imageURL: `${environment.urlApiImg}/${value.imagePath}`,
                  imageName: value.name,
                  link: `/artist/${value.slug}`,
                } as Item;
              })
            "
          ></CircleCard>
          <hr />
        </div>
      </div>
      <div v-if="artistPageStore.adsAboveFooter" class="banners">
        <a :href="artistPageStore.adsAboveFooter?.url" target="_blank">
          <img
            style="width: 100%; margin: 30px auto 50px"
            :src="artistPageStore.adsAboveFooter?.imageDesktopPath"
            class="image-banner"
            alt="banners"
            @click="
              artistAdsStore.postClick(
                artistPageStore.adsAboveFooter?.id!,
                CryptoJS.AES.encrypt(
                  artistPageStore.adsAboveFooter?.id,
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

<style src="assets/scss/pages/artists/artists.scss" lang="scss" scoped></style>
