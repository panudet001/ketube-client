<script lang="ts" setup>
import { defineProps } from "vue";

export interface Item {
  title: string;
  imageURL: string;
  imageName: string;
  link: string;
}

defineProps<{
  items: Item[];
  title: string;
  textBtn?: string;
  linkBtn?: string;
}>();

const translate = ref(0);
const currentIndex = ref(0);
const showPrevButton = ref(false);
const screenWidth = ref(window.innerWidth);
const carouselsContainer = ref(null);
const carouselsContainerWidth = ref(0);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenWidth);
});

watchEffect(() => {
  const container = carouselsContainer.value;
  if (container) {
    carouselsContainerWidth.value = container.offsetWidth;
  }

  if (screenWidth.value <= 540) {
    showPrevButton.value = false;
    if (currentIndex.value > 0) {
      showPrevButton.value = true;
    }
  } else {
    showPrevButton.value = true;
  }
});

const prevSlide = () => {
  const itemWidth = screenWidth.value <= 540 ? 176 : 196;

  const item =
    screenWidth.value <= 1200
      ? screenWidth.value <= 1080
        ? screenWidth.value <= 880
          ? screenWidth.value <= 680
            ? 1
            : 2
          : 3
        : 4
      : 5;
  const scrollBar = document.querySelector(".artist-carousels") as HTMLElement;
  scrollBar.scrollLeft -= itemWidth + itemWidth * item;

  const container = document.querySelector(".artist-carousels");
  const scroll = container?.scrollLeft ?? 0;
  const mod = Math.round(scroll / itemWidth);
  const res = mod;
  if (res > 0) {
    currentIndex.value = res;
  } else {
    currentIndex.value = 0;
  }
};

const nextSlide = () => {
  const itemWidth = screenWidth.value <= 540 ? 176 : 196;
  const container = document.querySelector(".artist-carousels");

  const scroll = container?.scrollLeft ?? 0;
  const mod = Math.round(scroll / itemWidth);
  const res = mod + 1;
  const item =
    screenWidth.value <= 1200
      ? screenWidth.value <= 1080
        ? screenWidth.value <= 880
          ? screenWidth.value <= 680
            ? 1
            : 2
          : 3
        : 4
      : 5;
  const scrollBar = document.querySelector(".artist-carousels") as HTMLElement;
  scrollBar.scrollLeft = res * itemWidth + itemWidth * item;
  currentIndex.value = res + item;
};
</script>

<template>
  <div class="circle-carousel-component">
    <div v-if="items && items.length > 0" class="section-carousels">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="circle-title-heading font-subtitle-1">{{ title }}</span>
        <div class="d-flex align-items-center">
          <NuxtLink v-if="linkBtn" :to="linkBtn" class="see-more">
            <button class="btn btn-outline-third btn-see-more font-body-2">
              {{ textBtn }}
            </button>
          </NuxtLink>
          <button
            v-if="showPrevButton"
            class="carousel-btn prev mx-3"
            :class="currentIndex !== 0 ? '' : 'disabled'"
            @click="prevSlide"
          >
            <i class="las la-angle-left arrow-icon"></i>
          </button>
          <button
            class="carousel-btn next"
            :class="currentIndex !== items.length - 1 ? '' : 'disabled'"
            @click="nextSlide"
          >
            <i class="las la-angle-right arrow-icon"></i>
          </button>
        </div>
      </div>
      <div
        ref="carouselsContainer"
        class="carousels-container artist-carousels"
        :style="{ scrollBehavior: 'smooth' }"
      >
        <div
          class="carousels"
          :style="{
            transform: `translateX(${translate}px)`,
          }"
        >
          <div
            v-for="(item, index) in items"
            :key="index"
            class="carousels-item"
          >
            <NuxtLink :to="item.link" :target="item.ads ? '_blank' : ''">
              <img
                :src="item.imageURL"
                :alt="item.imageName"
                class="cover-card"
              />
              <div class="mask-card"></div>
              <p class="font-body-1 title-name text-center">{{ item.title }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/carousel/CircleCarousel.scss"
  lang="scss"
  scoped
></style>
