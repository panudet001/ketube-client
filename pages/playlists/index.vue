<script setup lang="ts">
// Store
import * as CryptoJS from "crypto-js";
import { usePlaylistPageStore } from "~/store/usePlaylistPageStore";
import { useAdsStore } from "~/store/useAdsStore";
import { environment } from "~/services/environments";
const playlistPageStore = usePlaylistPageStore();
const playlistAdsStore = useAdsStore();

const route = useRoute();
const path = environment.urlBaseApp + route.fullPath;
const itemPages = ref(15);
const isLoading = ref(false);
const sortBy = ref("name");
const orderBy = ref("asc");
const dropdownTitle = ref("จาก A-Z, ก-ฮ");

// SSR CALL API
await useAsyncData(() =>
  playlistPageStore.getAll(0, itemPages.value, sortBy.value, orderBy.value),
);

function updateDropdownTitle(value: string) {
  switch (value) {
    case "asc":
      dropdownTitle.value = "จาก A-Z, ก-ฮ";
      break;
    case "desc":
      dropdownTitle.value = "จาก Z-A, ฮ-ก";
      break;
    case "updatedAt":
      dropdownTitle.value = "เพลย์ลิสต์ใหม่ล่าสุด";
      break;
    case "view":
      dropdownTitle.value = "เพลย์ลิสต์แนะนำ";
      break;
    default:
      dropdownTitle.value = "จาก A-Z, ก-ฮ";
  }
}

function getValue(value: string) {
  if (value === "desc" || value === "asc") {
    orderBy.value = value;
    sortBy.value = "name";
    playlistPageStore.getAll(0, itemPages.value, sortBy.value, value);
  } else {
    sortBy.value = value;
    orderBy.value = "desc";
    playlistPageStore.getAll(0, itemPages.value, value, orderBy.value);
  }
  updateDropdownTitle(value);
}

async function handleScroll() {
  const bannersElement = document.querySelector(".load-more");
  if (
    bannersElement &&
    bannersElement.getBoundingClientRect().top <= window.innerHeight &&
    playlistPageStore.playlistItemList.length % 15 === 0 &&
    !isLoading.value
  ) {
    isLoading.value = true;
    try {
      itemPages.value += 15;
      await useAsyncData(() =>
        playlistPageStore.getAll(
          0,
          itemPages.value,
          sortBy.value,
          orderBy.value,
        ),
      );
    } finally {
      isLoading.value = false;
    }
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

useHead({
  htmlAttrs: { lang: "th" },
  title: "เพลย์ลิสต์ทั้มหมด 🎶 🎤 - Ketuber",
  meta: [
    {
      name: "description",
      content:
        "ร่วมค้นหาแนวเพลงใหม่ๆ จากเพลย์ลิสต์ของเราที่คัดสรรมาเพื่อคุณอย่างพิถีพิถัน ทำให้คุณได้รับประสบการณ์ฟังเพลงที่หลากหลายมากยิ่งขึ้น",
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
      content: "เพลย์ลิสต์ทั้งหมด - Ketuber",
    },
    {
      property: "og:description",
      name: "og:description",
      content:
        "ร่วมค้นหาแนวเพลงใหม่ๆ จากเพลย์ลิสต์ของเราที่คัดสรรมาเพื่อคุณอย่างพิถีพิถัน ทำให้คุณได้รับประสบการณ์ฟังเพลงที่หลากหลายมากยิ่งขึ้น",
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
      content: "เพลย์ลิสต์ทั้งหมด - Ketuber",
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content:
        "ร่วมค้นหาแนวเพลงใหม่ๆ จากเพลย์ลิสต์ของเราที่คัดสรรมาเพื่อคุณอย่างพิถีพิถัน ทำให้คุณได้รับประสบการณ์ฟังเพลงที่หลากหลายมากยิ่งขึ้น",
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

// Variable
const isRenderFinish = ref<boolean>(false);

// Nuxt Hook
const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});
</script>

<template>
  <div class="playlists-page">
    <div class="wrapper-content">
      <CoverInfo
        page-name="เพลย์ลิสต์"
        title="เปิดโลกของบทเพลงด้วยเพลย์ลิสต์ของเรา"
        description="ร่วมค้นหาแนวเพลงใหม่ๆ จากเพลย์ลิสต์ของเราที่คัดสรรมาเพื่อคุณอย่างพิถีพิถัน ทำให้คุณได้รับประสบการณ์ฟังเพลงที่หลากหลายมากยิ่งขึ้น"
      />

      <div class="section-sort">
        <span class="font-subtitle-3">จัดเรียงรายการ</span>
        <div class="dropdown">
          <button
            class="btn btn-dropdown dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span class="sort-title font-body-3">{{ dropdownTitle }}</span>
          </button>
          <ul class="dropdown-menu">
            <li>
              <button
                class="dropdown-item font-body-3"
                href="#"
                @click="getValue('asc')"
              >
                จาก A-Z, ก-ฮ
              </button>
            </li>
            <li>
              <button
                class="dropdown-item font-body-3"
                href="#"
                @click="getValue('desc')"
              >
                จาก Z-A, ฮ-ก
              </button>
            </li>
            <li>
              <button
                class="dropdown-item font-body-3"
                href="#"
                @click="getValue('updatedAt')"
              >
                เพลย์ลิสต์ใหม่ล่าสุด
              </button>
            </li>
            <li>
              <button
                class="dropdown-item font-body-3"
                href="#"
                @click="getValue('view')"
              >
                เพลย์ลิสต์แนะนำ
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="
          playlistPageStore.playlistItemList &&
          playlistPageStore.playlistItemList.length > 0 &&
          isRenderFinish === true
        "
        class="section-playlist-card"
      >
        <SquareCard
          :items="playlistPageStore.playlistItemList"
          :is-show-cover-title="true"
          :is-show-playlist="true"
        ></SquareCard>
      </div>

      <div
        v-if="playlistPageStore.adsAboveFooter && isRenderFinish === true"
        class="banners"
      >
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

      <div class="load-more"></div>
    </div>
  </div>
</template>

<style scoped src="assets/scss/pages/playlists/playlists.scss"></style>
