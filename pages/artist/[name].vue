<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as CryptoJS from "crypto-js";
import { useArtistPageStore } from "~/store/useArtistPageStore";
import { environment } from "~/services/environments";
import { useAdsStore } from "~/store/useAdsStore";

const route = useRoute();
const slug = route.params.name.toString();

const artistPageStore = useArtistPageStore();
const artistAdsStore = useAdsStore();
const isRenderFinish = ref<boolean>(false);

await useAsyncData(() => artistPageStore.getBySlug(slug));

onMounted(() => {
  if (artistPageStore.artistData?.description) {
    const element = document.getElementById("description") as HTMLElement;
    element.innerHTML = artistPageStore.artistData?.description;
  }
});

const path = environment.urlBaseApp + route.fullPath;
useHead({
  htmlAttrs: { lang: "th" },
  title: `ศิลปิน ${artistPageStore.artistData?.name} | อัลบั้ม เพลง และ วิดีโอ ได้ที่ Ketuber`,
  meta: [
    {
      name: "description",
      content: `${artistPageStore.artistData?.description}`,
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
      content: `ศิลปิน ${artistPageStore.artistData?.name}`,
    },
    {
      property: "og:description",
      name: "og:description",
      content: `${artistPageStore.artistData?.description}`,
    },
    { property: "og:url", name: "og:url", content: path },
    { property: "og:site:name", name: "og:site:name", content: path },
    {
      property: "og:image",
      name: "og:image",
      content: `${environment.urlApiImg}/${artistPageStore.artistData?.imagePath}`,
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
      content: `ศิลปิน ${artistPageStore.artistData?.name}`,
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content: `${artistPageStore.artistData?.description}`,
    },
    {
      property: "twitter:image",
      name: "twitter:image",
      content: `${environment.urlApiImg}/${artistPageStore.artistData?.imagePath}`,
    },
    { property: "twitter:site", name: "twitter:site", content: "@ketube" },
  ],
  link: [{ rel: "canonical", href: path }],
});

// Nuxt Hook
const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});

const dropdownStates = ref<boolean>(false);

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".dropdown-new-container")) {
    dropdownStates.value = false;
  }
}

function toggleDropdown() {
  dropdownStates.value = !dropdownStates.value;
}

onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});
</script>
<template>
  <div class="artist-page">
    <CoverMusic
      page-name="ศิลปิน"
      :title="artistPageStore.artistData?.name"
      :title-color="artistPageStore.artistData?.nameColor"
      :subtitle="``"
      :background-image-url="`${environment.urlApiImg}/${artistPageStore.artistData?.imageCoverPath}`"
      :image-url="`${environment.urlApiImg}/${artistPageStore.artistData?.imagePath}`"
      :description="artistPageStore.artistData?.description"
    ></CoverMusic>

    <div class="wrapper-content">
      <div class="artist-container">
        <div
          v-if="
            artistPageStore.newReleaseVideo &&
            artistPageStore.newReleaseVideo.length > 0 &&
            isRenderFinish == true
          "
          class="artist-new"
        >
          <h6>ใหม่ล่าสุด</h6>
          <div class="new-card">
            <NuxtLink :to="`${artistPageStore.newReleaseVideo[0].link}`">
              <div class="card-latest-release">
                <img
                  :src="`${artistPageStore.newReleaseVideo[0].imageURL}`"
                  alt="Image"
                  class="new-image"
                />
                <img
                  src="assets/images/icons/play.png"
                  alt="Image"
                  class="img-play"
                />
                <div class="bk-img"></div>
              </div>
            </NuxtLink>

            <div class="new-text">
              <div>
                <p class="title-name font-subtitle-3">
                  {{ artistPageStore.newReleaseVideo[0].name }}
                </p>
                <p
                  v-if="artistPageStore.newReleaseVideo[0].name"
                  class="title-album font-body-3"
                >
                  อัลบั้ม • {{ artistPageStore.newReleaseVideo[0].name }}
                </p>
                <p class="title font-body-3">
                  {{ artistPageStore.newReleaseVideo[0].duration }}
                </p>
              </div>
              <div class="action-more">
                <NuxtLink :to="`${artistPageStore.newReleaseVideo[0].link}`">
                  <span class="material-symbols-outlined icon-que">
                    queue_music
                  </span>
                </NuxtLink>
                <div class="dropdown-new-container" @click="toggleDropdown()">
                  <span class="material-symbols-outlined icon-more">
                    more_vert
                  </span>
                  <ul v-if="dropdownStates" class="dropdown">
                    <DropdownItem
                      :item="{
                        id: artistPageStore.newReleaseVideo[0].id,
                        link: artistPageStore.newReleaseVideo[0].link,
                        slug: artistPageStore.newReleaseVideo[0].slug,
                      }"
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="
            artistPageStore.videos &&
            artistPageStore.videos.length > 0 &&
            isRenderFinish == true
          "
          class="artist-new m-t-50"
        >
          <h6>ยอดนิยม</h6>
          <PlaylistMusic
            :items="artistPageStore.videos"
            :is-show-album="true"
            :is-show-header="false"
            :is-show-partner="true"
          ></PlaylistMusic>
        </div>

        <SquareCarousel
          v-if="
            artistPageStore.albums &&
            artistPageStore.albums?.length > 0 &&
            isRenderFinish == true
          "
          title="อัลบั้ม"
          :items="artistPageStore.albums"
          :show-icon-hover="true"
          :show-album="true"
          :show-playlist="true"
          class-name="artistAlbums"
          class="m-t-50"
        ></SquareCarousel>
        <hr
          v-if="
            artistPageStore.albums &&
            artistPageStore.albums?.length > 0 &&
            isRenderFinish == true
          "
          class="m-0"
        />

        <SquareCarousel
          v-if="
            artistPageStore?.featuringArtists &&
            artistPageStore.featuringArtists?.length > 0 &&
            isRenderFinish == true
          "
          :title="'ผลงานร่วมกับ ' + artistPageStore.artistData?.name"
          :items="artistPageStore.featuringArtists"
          :show-icon-hover="true"
          :show-artist="true"
          class-name="artistFeaturingArtists"
          class="m-t-50"
        ></SquareCarousel>
        <hr
          v-if="
            artistPageStore?.featuringArtists &&
            artistPageStore.featuringArtists?.length > 0 &&
            isRenderFinish == true
          "
          class="m-0"
        />

        <CircleCarousel
          v-if="
            artistPageStore?.similarArtists &&
            artistPageStore.similarArtists?.length > 0 &&
            isRenderFinish == true
          "
          :title="`ศิลปินที่คล้ายกัน`"
          :items="artistPageStore.similarArtists"
          :show-text-hover="true"
          :show-text-overlay="true"
          class="m-t-50"
        ></CircleCarousel>
      </div>

      <div
        v-if="artistPageStore.artistData?.description"
        id="about"
        class="artist-about"
      >
        <h6>เกี่ยวกับ {{ artistPageStore.artistData?.name }}</h6>
        <p id="description" class="font-body-2"></p>
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

<style scoped src="assets/scss/pages/artist/artist.scss"></style>
