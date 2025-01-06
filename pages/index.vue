<script setup lang="ts">
import * as CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import { ref } from "vue";
import { useHomePageStore } from "~/store/useHomePageStore";
import { useAdsStore } from "~/store/useAdsStore";
import { environment } from "~/services/environments";
import { useUserStore } from "~/store/useUserStore";
import History from "~/components/history/HistoryHome.vue";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";
// Store
const homePageStore = useHomePageStore();
const homeUseAdsStore = useAdsStore();
const userStore = useUserStore();

// SSR CALL API
await useAsyncData(() => userStore.get());
await useAsyncData(() => homePageStore.get());

if (userStore.error && userStore.error?.exception === "UNAUTHORIZED") {
  const token = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
  token.value = null;
}

// Variable
const isRenderFinish = ref<boolean>(false);

// Nuxt Hook
const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});
const onClickBtn = () => {
  const id = uuid4();
  homeUseAdsStore.postClick(
    homePageStore.idAdsBanner,
    CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
  );
};

const onClickBtnBetween = () => {
  homeUseAdsStore.postClick(
    homePageStore.idAdsBetween,
    CryptoJS.AES.encrypt(
      homePageStore.idAdsBetween,
      environment.tokenOtt,
    ).toString(),
  );
};

const route = useRoute();
const path = environment.urlBaseApp + route.fullPath;
useHead({
  htmlAttrs: { lang: "th" },
  title: "ร้องเพลง | เพลง | ร้องเพลงได้ทุกที่ ทุกเวลา Ketube",
  meta: [
    {
      name: "description",
      content:
        "เพิ่มประสบการณ์การร้องเพลงของคุณด้วยฟีเจอร์ที่จะทำให้คุณ สนุกได้อย่างไร้รอยต่อ ปลดปล่อยความหลงใหลในการร้องคาราโอเกะไปกับ Ketube พร้อมทั้งเพลงมากหมายให้เลือกสรร เลือกเพลงโปรดของคุณแล้วร้องเลย!",
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
      content: "ร้องเพลง | เพลง | ร้องเพลงได้ทุกที่ ทุกเวลา Ketube",
    },
    {
      property: "og:description",
      name: "og:description",
      content:
        "เพิ่มประสบการณ์การร้องเพลงของคุณด้วยฟีเจอร์ที่จะทำให้คุณ สนุกได้อย่างไร้รอยต่อ ปลดปล่อยความหลงใหลในการร้องคาราโอเกะไปกับ Ketube พร้อมทั้งเพลงมากหมายให้เลือกสรร เลือกเพลงโปรดของคุณแล้วร้องเลย!",
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
      content: "ร้องเพลง | เพลง | ร้องเพลงได้ทุกที่ ทุกเวลา Ketube",
    },
    { property: "twitter:url", name: "twitter:url", content: path },
    {
      property: "twitter:description",
      name: "twitter:description",
      content:
        "เพิ่มประสบการณ์การร้องเพลงของคุณด้วยฟีเจอร์ที่จะทำให้คุณ สนุกได้อย่างไร้รอยต่อ ปลดปล่อยความหลงใหลในการร้องคาราโอเกะไปกับ Ketube พร้อมทั้งเพลงมากหมายให้เลือกสรร เลือกเพลงโปรดของคุณแล้วร้องเลย!",
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

const getCurrentTime = (
  hello: { value: string },
  description: { value: string },
  image: { value: string },
) => {
  const now = new Date();
  const hour = now.getHours();
  const time = hour;
  if (Number(time) >= 5 && Number(time) < 11) {
    hello.value = "สวัสดีตอนเช้า";
    description.value =
      "ร้องเพลงยามเช้าช่วยให้จิตใจแจ่มใสและพร้อมรับพลังงานบวกได้ทั้งวัน";
    image.value = "./time/5.png";
  } else if (Number(time) >= 11 && Number(time) < 16) {
    hello.value = "สวัสดีตอนกลางวัน";
    description.value =
      "แดดตอนกลางวันกำลังร้อนชวนเพื่อนเข้ามาคลายร้อนที่ Ketube ";
    image.value = "./time/6.png";
  } else if (Number(time) >= 16 && Number(time) < 20) {
    hello.value = "สวัสดีตอนเย็น";
    description.value =
      "อากาศเริ่มเย็นสบาย ชวนเพื่อนมาสนุกและสร้างความสุขด้วยการร้องเพลง";
    image.value = "./time/7.png";
  } else {
    hello.value = "สวัสดีตอนค่ำ";
    description.value =
      "วันนี้เราก็พร้อมที่จะช่วยทำให้คุณร้องเพลงอย่างมีความสุข";
    image.value = "./time/8.png";
  }
  return time;
};

const hello = ref<string>("");
const description = ref<string>("");
const image = ref<string>("");
const fullName = userStore.user?.name ?? "";
if (fullName) {
  getCurrentTime(hello, description, image);
}

const widthImage = ref(["250px", "250px", "250px"]);
const mouseoverImg = (val: number) => {
  const screenWidth = window.innerWidth;
  if (screenWidth > 1260) {
    widthImage.value = ["225px", "225px", "225px"];
    widthImage.value[val] = "350px";
  }
};

const mouseleaveImg = () => {
  widthImage.value = ["250px", "250px", "250px"];
};
</script>

<template>
  <div class="home-page">
    <div
      v-if="homePageStore.banners && isRenderFinish == true"
      class="wrapper-content-full"
    >
      <ImageCarousel
        v-if="homePageStore.banners.length > 0"
        :items="homePageStore.banners"
        :on-click-btn="onClickBtn"
      />
    </div>

    <div v-if="isRenderFinish" class="wrapper-content">
      <!-- Welcome -->
      <div v-if="fullName" class="section-welcome">
        <div class="item-content">
          <span>
            <p class="h7">{{ hello }}</p>
            <h5 class="text-name">คุณ {{ fullName }}</h5>
          </span>
          <p class="font-button-2">
            {{ description }}
          </p>
        </div>
        <img :src="image" alt="Image" />
      </div>
      <p class="font-body-2">คิดเพลงไม่ออกใช่ไหม ลองดูนี่เป็นไอเดียสิ</p>
      <history
        v-if="
          fullName &&
          homePageStore.recents &&
          homePageStore.recents?.length > 0 &&
          isRenderFinish == true
        "
        :items="homePageStore.recents"
      ></history>

      <div class="group-item">
        <SquareCarousel
          v-if="
            homePageStore.videoNewReleases &&
            homePageStore.videoNewReleases?.length > 0 &&
            isRenderFinish == true
          "
          :ads="true"
          :on-click-btn="onClickBtnBetween"
          title="เพลงใหม่ล่าสุด"
          :items="homePageStore.videoNewReleases"
          :show-icon-hover="true"
          :show-partner="true"
          class-name="videoNewReleases"
        ></SquareCarousel>

        <SquareCarousel
          v-if="
            homePageStore.recommendedVideos &&
            homePageStore.recommendedVideos?.length > 0 &&
            isRenderFinish == true
          "
          title="เพลงแนะนำ"
          :items="homePageStore.recommendedVideos"
          :show-icon-hover="true"
          :show-partner="true"
          class-name="recommendedVideos"
        ></SquareCarousel>

        <SquareCarousel
          v-if="
            homePageStore.recommendedPlaylists &&
            homePageStore.recommendedPlaylists?.length > 0 &&
            isRenderFinish == true
          "
          title="เพลย์ลิสต์"
          :items="homePageStore.recommendedPlaylists"
          :show-text-hover="true"
          :show-playlist="true"
          :show-partner="false"
          text-btn="ดูเพิ่มเติม"
          link-btn="/playlists"
          class-name="recommendedPlaylists"
        ></SquareCarousel>

        <CircleCarousel
          v-if="
            homePageStore.artists &&
            homePageStore.artists?.length > 0 &&
            isRenderFinish == true
          "
          title="ศิลปิน"
          link-btn="/artists"
          text-btn="ดูเพิ่มเติม"
          :items="homePageStore.artists"
          :show-text-hover="true"
          :show-text-overlay="true"
        ></CircleCarousel>
      </div>
    </div>

    <div
      v-if="homePageStore.banners && isRenderFinish == true"
      class="features-section"
    >
      <div class="features-container">
        <div class="header-container">
          <h4>มีความสุขกับทุก</h4>
          <h4 class="text-linear">เพลงบน Ketube</h4>
          <p class="font-body-2">
            สัมผัสประสบการณ์คาราโอเกะแบบใหม่ ไปกับ Ketube เปล่งเสียงในใจของคุณ
            ออกมาแบบไร้ขีดจำกัด
          </p>
        </div>
        <div class="item-container">
          <div
            class="item"
            :style="[
              widthImage[0] === '350px'
                ? {
                    width: widthImage[0],
                    height: '395px',
                    boxShadow: '0 0 4px 0 rgb(169 116 255 / 50%)',
                  }
                : { width: widthImage[0] },
            ]"
            @mouseover="mouseoverImg(0)"
            @mouseleave="mouseleaveImg"
          >
            <img
              class="image"
              src="assets/images/backgrounds/image1.png"
              alt="Image"
              :style="{ width: widthImage[0] }"
            />
            <div class="content-container">
              <h6 :class="widthImage[0] === '350px' ? 'title' : 'title-small'">
                ค้นพบบทเพลงของ คาราโอเกะ
              </h6>
              <p
                class="description font-body-4"
                :style="[
                  widthImage[0] === '350px'
                    ? { display: 'block' }
                    : { display: 'none' },
                ]"
              >
                "เพลิดเพลินไปกับสวรรค์แห่งคาราโอเกะบน ketube
                กับแนวเพลงที่หลากหลาย ให้คุณร้องและสนุกได้ไม่รู้จบ"
              </p>
            </div>
            <div
              class="mask-card"
              :style="[
                widthImage[0] !== '350px'
                  ? { width: widthImage[0], background: 'rgb(0 0 0 / 20%)' }
                  : { width: widthImage[0] },
              ]"
            ></div>
          </div>
          <div
            class="item"
            :style="[
              widthImage[1] === '350px'
                ? {
                    width: widthImage[1],
                    height: '395px',
                    boxShadow: '0 0 4px 0 rgb(169 116 255 / 50%)',
                  }
                : { width: widthImage[1] },
            ]"
            @mouseover="mouseoverImg(1)"
            @mouseleave="mouseleaveImg"
          >
            <img
              class="image"
              src="assets/images/backgrounds/image2.png"
              alt="Image"
              :style="{ width: widthImage[1] }"
            />
            <div class="content-container">
              <h6 :class="widthImage[1] === '350px' ? 'title' : 'title-small'">
                สนุกสนานไปกับเพื่อนของคุณ
              </h6>
              <p
                class="description font-body-4"
                :style="[
                  widthImage[1] === '350px'
                    ? { display: 'block' }
                    : { display: 'none' },
                ]"
              >
                "เปิดประสบการณ์แห่งการร้องเพลงไม่ว่าคุณจะร้องคู่ ร้องเดี่ยว
                หรือร้องเป็นกลุ่ม"
              </p>
            </div>
            <div
              class="mask-card"
              :style="[
                widthImage[1] !== '350px'
                  ? { width: widthImage[1], background: 'rgb(0 0 0 / 20%)' }
                  : { width: widthImage[1] },
              ]"
            ></div>
          </div>
          <div
            class="item"
            :style="[
              widthImage[2] === '350px'
                ? {
                    width: widthImage[2],
                    height: '395px',
                    boxShadow: '0 0 4px 0 rgb(169 116 255 / 50%)',
                  }
                : { width: widthImage[2] },
            ]"
            @mouseover="mouseoverImg(2)"
            @mouseleave="mouseleaveImg"
          >
            <img
              class="image"
              src="assets/images/backgrounds/image3.png"
              alt="Image"
              :style="{ width: widthImage[2] }"
            />
            <div class="content-container">
              <h6 :class="widthImage[2] === '350px' ? 'title' : 'title-small'">
                คุณสามารถร้อง เพลงได้ทุกสถานที่
              </h6>
              <p
                class="description font-body-4"
                :style="[
                  widthImage[2] === '350px'
                    ? { display: 'block' }
                    : { display: 'none' },
                ]"
              >
                "ถ่ายทอดตัวตนของคุณผ่านบทเพลง
                ไม่ว่าคุณจะพบแรงบันดาลใจที่ไหนก็ตามบนเส้นทางแห่งชีวิต"
              </p>
            </div>
            <div
              class="mask-card"
              :style="[
                widthImage[2] !== '350px'
                  ? { width: widthImage[2], background: 'rgb(0 0 0 / 20%)' }
                  : { width: widthImage[2] },
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="cover-info-component">
      <div class="header-cover-info">
        <h5 class="cover-title">ฟีเจอร์เด่นของ Ketube</h5>
        <p class="cover-description font-body-2">
          เพิ่มประสบการณ์การร้องเพลงของคุณด้วยฟีเจอร์ที่จะทำให้คุณ
          สนุกได้อย่างไร้รอยต่อ ปลดปล่อยความหลงใหลในการร้องคาราโอเกะไปกับ Ketube
          พร้อมทั้งเพลงมากหมายให้เลือกสรร เลือกเพลงโปรดของคุณแล้วร้องเลย!
        </p>
      </div>
    </div>

    <div
      v-if="homePageStore.banners && isRenderFinish == true"
      class="highlight-section wrapper-content"
    >
      <div class="card-container">
        <div class="card">
          <span class="material-symbols-outlined icon-user"> group </span>
          <p class="title font-subtitle-3">คัดสรรเพลย์ลิสต์ให้สำหรับคุณ</p>
          <p class="description font-body-3">
            มอบประสบการณ์สุดพิเศษด้วยการคัดสรร เพลย์ลิสต์ให้คุณ
            พร้อมทั้งสร้างคอลเล็กชัน ที่ตรงกับรสนิยมและอารมณ์ของคุณ
          </p>
        </div>
        <div class="card">
          <span class="material-symbols-outlined icon-mic">
            mic_external_on
          </span>
          <p class="title font-subtitle-3">
            เครื่องเล่นคาราโอเกะแบบปรับแต่งได้
          </p>
          <p class="description font-body-3">
            ดื่มด่ำไปกับเครื่องเล่นเพลงคาราโอเกะของเรา
            ที่จะทำให้คุณรู้สึกสนุกไปกับการได้ร้องเพลงเสียงระดับคุณภาพสตูดิโอพร้อมโหมดเนื้อร้องและโหมดการปรับแต่งสไตล์การร้องคาราโอเกะให้เข้ากับคุณ
            แบบที่คุณจะไม่มีวันลืม
          </p>
        </div>
        <div class="card">
          <span class="material-symbols-outlined icon-note"> graphic_eq </span>
          <p class="title font-subtitle-3">ไฟล์เสียงคุณภาพสูง</p>
          <p class="description font-body-3">
            Ketube พร้อมพาคุณดื่มด่ำกับเสียงดนตรี คุณภาพสูงของเรา
            สัมผัสถึงความคมชัดและ ความสมบูรณ์ของทุกตัวโน้ต เปิดประสบการณ์
            ร้องเพลงที่เทียบเท่ากับการร้องเพลงในสตูดิโอ
          </p>
        </div>
      </div>
      <div v-if="homePageStore.adsAboveFooter" class="banners">
        <a :href="homePageStore.adsAboveFooter?.url" target="_blank">
          <img
            style="width: 100%; margin: 50px auto"
            :src="homePageStore.adsAboveFooter?.imageDesktopPath"
            class="image-banner"
            alt="banners"
            @click="
              homeUseAdsStore.postClick(
                homePageStore.adsAboveFooter?.id!,
                CryptoJS.AES.encrypt(
                  homePageStore.adsAboveFooter?.id,
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

<style scoped src="assets/scss/pages/index.scss"></style>
