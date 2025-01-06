<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import type { Artist } from "~/interfaces/responses/video/Artist";
import { useHomePageStore } from "~/store/useHomePageStore";
import DropdownItem from "~/components/dropdown/DropdownItem.vue";
export interface Item {
  id?: string;
  title: string;
  description: string;
  imageURL: string;
  imageName: string;
  link: string;
  artistLink: string;
  ads: boolean;
  partnerName: string;
  partnerImage: string;
  artists?: Artist[];
}

const props = defineProps<{
  items: Item[];
}>();

const screenWidth = ref(window.innerWidth);
const currentIndex = ref(0);
const length = ref(0);
length.value =
  screenWidth.value >= 1285
    ? Math.ceil(props.items.length / 6)
    : Math.ceil(props.items.length / 3);

const touch = {
  startX: 0,
  startY: 0,
  moveX: 0,
  moveY: 0,
  threshold: 50, // ค่าเกณฑ์สำหรับการเลื่อนเพื่อทำการเปลี่ยน slide
};

const prevSlide = () => {
  const itemWidth =
    screenWidth.value <= 680
      ? screenWidth.value <= 450
        ? screenWidth.value <= 400
          ? 310
          : 370
        : 420
      : 580;
  const item = screenWidth.value >= 1260 ? itemWidth : 0;
  const scrollBar = document.querySelector(
    ".card-container-history",
  ) as HTMLElement;
  scrollBar.scrollLeft -= itemWidth + item;
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
const nextSlide = () => {
  const itemWidth =
    screenWidth.value <= 680
      ? screenWidth.value <= 450
        ? screenWidth.value <= 400
          ? 310
          : 370
        : 420
      : 580;
  const item = screenWidth.value >= 1260 ? itemWidth : 0;
  const container = document.getElementById("carouselsContainer");
  const scroll = container?.scrollLeft ?? 0;
  const mod = Math.floor(scroll / itemWidth);
  const res = mod + 1;
  const scrollBar = document.querySelector(
    ".card-container-history",
  ) as HTMLElement;
  scrollBar.scrollLeft = res * itemWidth + item;
  currentIndex.value = res;
};
const onTouchStart = (event) => {
  const touchEvent = event.touches[0];
  touch.startX = touchEvent.clientX;
  touch.startY = touchEvent.clientY;
};

const onTouchMove = (event) => {
  const touchEvent = event.touches[0];
  touch.moveX = touchEvent.clientX;
  touch.moveY = touchEvent.clientY;
};

const onTouchEnd = () => {
  const diffX = touch.startX - touch.moveX;
  const diffY = touch.startY - touch.moveY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > touch.threshold) {
      nextSlide();
    } else if (diffX < -touch.threshold) {
      prevSlide();
    }
  }

  touch.startX = touch.startY = touch.moveX = touch.moveY = 0;
};

const homePageStore = useHomePageStore();

const numberIndex = ref();
const dropdownMarginLeft = ref();
const dropdownMarginTop = ref();

const dataItem = ref<Item>();

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    target &&
    !target.closest(".sub-menu-history") &&
    !target.closest(".sub-menu-square")
  ) {
    // dropdownStates.value = [];
    homePageStore.delDropdown();
    const container = document.querySelector(
      ".card-container-history",
    ) as HTMLElement;
    container.style.overflowX = "scroll";
    container.style.marginBottom = "0";
  }
}

function toggleDropdown(index: number, event, item: Item) {
  const filter = homePageStore.dropdownData.filter(
    (val) => val.title === item.title,
  );
  if (filter) {
    const status = !homePageStore.dropdownData[index]?.status;
    homePageStore.delDropdown();
    homePageStore.addDropdown(index, status, item.title);
  } else {
    homePageStore.addDropdown(index, true, item.title);
  }

  numberIndex.value = index;
  dropdownMarginLeft.value = event.layerX - 169;
  dropdownMarginTop.value = event.layerY + 20;
  dataItem.value = item;

  const checkStatus = homePageStore.dropdownData[index].status;
  const container = document.querySelector(
    ".card-container-history",
  ) as HTMLElement;
  if (checkStatus) {
    container.style.overflowX = "hidden";
    container.style.marginBottom = "16px";
  } else {
    container.style.overflowX = "scroll";
    container.style.marginBottom = "0";
  }
}

onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});
</script>
<template>
  <div class="container-history">
    <div class="list-playlist">
      <div class="card-top">
        <button
          v-if="currentIndex != 0"
          class="carousel-btn prev-mobile"
          @click="prevSlide"
        >
          <i class="las la-angle-left arrow-icon"></i>
        </button>
        <div class="text-item">
          <p class="font-subtitle-1">นี่คือเพลงที่คุณร้องล่าสุด</p>
        </div>
        <div class="button-item">
          <NuxtLink
            :to="{ path: '/music', query: { tag: 'history' } }"
            class="see-more"
          >
            <button class="btn btn-view-all font-body-2">ดูเพิ่มเติม</button>
          </NuxtLink>
          <button
            class="carousel-btn prev"
            :class="currentIndex != 0 ? '' : 'disabled'"
            @click="prevSlide"
          >
            <i class="las la-angle-left arrow-icon"></i>
          </button>
          <button
            :class="currentIndex !== length - 1 ? '' : 'disabled'"
            class="carousel-btn next"
            @click="nextSlide"
          >
            <i class="las la-angle-right arrow-icon"></i>
          </button>
        </div>
      </div>
      <div
        id="carouselsContainer"
        class="card-container-history"
        :style="{ scrollBehavior: 'smooth' }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="card-item">
          <div class="grid-container">
            <div
              v-for="(val, index) in items"
              :key="index"
              class="card-music rounded"
            >
              <div class="item-music">
                <img
                  class="image-music rounded"
                  :src="val.imageURL"
                  alt="music"
                />
                <div class="card-text">
                  <NuxtLink :to="val.link" class="text-music font-body-2">
                    {{ val.title }} -
                    <span class="artist-text font-body-2">
                      {{ val.description }}</span
                    >
                  </NuxtLink>
                  <PartnerCard
                    :partner-name="val.partnerName"
                    :partner-image="val.partnerImage"
                  ></PartnerCard>
                </div>
              </div>
              <div class="item-button">
                <NuxtLink :to="val.link">
                  <span class="material-symbols-outlined icon-w">
                    queue_music
                  </span>
                </NuxtLink>
                <div class="sitting-action-history sub-menu-history">
                  <span
                    class="material-symbols-outlined icon-w"
                    @click="toggleDropdown(index, $event, val)"
                  >
                    more_vert
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown-setting-history sub-menu-history">
          <ul
            v-if="
              homePageStore.dropdownData[numberIndex] &&
              homePageStore.dropdownData[numberIndex].status === true &&
              homePageStore.dropdownData[numberIndex].title === dataItem?.title
            "
            class="dropdown"
            :style="[
              { marginLeft: `${dropdownMarginLeft}px` },
              { top: `${dropdownMarginTop}px` },
            ]"
          >
            <DropdownItem :item="dataItem" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="/components/history/HistoryHome.scss" lang="scss" scoped></style>
