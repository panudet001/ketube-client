<script lang="ts" setup>
import { defineProps, onMounted } from "vue";
import type { Artist } from "~/interfaces/responses/video/Artist";
import { useHomePageStore } from "~/store/useHomePageStore";

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
  partnerImage?: string;
  artists?: Artist[];
  className?: string;
  albumSlug?: string;
  slug?: string;
}

const props = defineProps<{
  title: string;
  items: Item[];
  textBtn?: string;
  linkBtn?: string;
  showTextOverlay?: boolean;
  showIconHover?: boolean;
  onClickBtn?: () => void;
  showPartner?: boolean;
  className?: string;
  showAlbum?: boolean;
  showArtist?: boolean;
  showPlaylist?: boolean;
}>();

const translate = ref(0);
const currentIndex = ref(0);
const showPrevButton = ref(false);
const screenWidth = ref(window.innerWidth);
const carouselsContainer = ref(null);
const carouselsContainerWidth = ref(0);

const homePageStore = useHomePageStore();

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
  const scrollBar = document.querySelector(
    `.${props.className}`,
  ) as HTMLElement;
  scrollBar.scrollLeft -= itemWidth + itemWidth * item;

  const container = document.querySelector(`.${props.className}`);
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
  const container = document.querySelector(`.${props.className}`);
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
  const scrollBar = document.querySelector(
    `.${props.className}`,
  ) as HTMLElement;
  scrollBar.scrollLeft = res * itemWidth + itemWidth * item;
  currentIndex.value = res + item;
};

const touch = {
  startX: 0,
  startY: 0,
  moveX: 0,
  moveY: 0,
  threshold: 50, // ค่าเกณฑ์สำหรับการเลื่อนเพื่อทำการเปลี่ยน slide
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

const numberIndex = ref();
const dropdownMarginLeft = ref();
const dataItem = ref<Item>();

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    target &&
    !target.closest(".sub-menu-square") &&
    !target.closest(".sub-menu-history")
  ) {
    // dropdownStates.value = [];
    homePageStore.delDropdown();
    if (props.className) {
      const container = document.querySelector(
        `.${props.className}`,
      ) as HTMLElement;
      container.style.overflowX = "scroll";
      container.style.marginBottom = "0";
    }
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
  const container = document.querySelector(
    `.${props.className}`,
  ) as HTMLElement;
  const scroll = container?.scrollLeft ?? 0;
  numberIndex.value = index;
  dropdownMarginLeft.value = event.layerX - 169 - scroll;
  dataItem.value = item;

  const checkStatus = homePageStore.dropdownData[index].status;
  if (checkStatus) {
    container.style.overflowX = "hidden";
    container.style.marginBottom = "41px";
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
  <div class="square-carousel-component">
    <div
      v-if="items && items.length > 0"
      class="section-carousels"
      :style="{ marginBottom: '25px' }"
    >
      <div class="d-flex justify-content-between align-items-center mb-3 w-100">
        <button
          v-if="showPrevButton"
          class="carousel-btn-mobile mx-3"
          :class="textBtn ? 'prev-mobile-view' : 'prev-mobile'"
          @click="prevSlide"
        >
          <i class="las la-angle-left arrow-icon"></i>
        </button>
        <span class="square-title-heading font-subtitle-1">{{ title }}</span>
        <div class="square-button-heading">
          <NuxtLink v-if="textBtn" :to="linkBtn" class="see-more">
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
            :class="currentIndex !== items.length ? '' : 'disabled'"
            :style="showTextOverlay ? { top: '120px' } : ''"
            @click="nextSlide"
          >
            <i class="las la-angle-right arrow-icon"></i>
          </button>
        </div>
      </div>
      <div
        ref="carouselsContainer"
        class="carousels-container"
        :class="className"
        :style="{ scrollBehavior: 'smooth' }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div
          class="carousels"
          :style="{
            transform: `translateX(${translate}px)`,
            marginBottom: '50px',
          }"
        >
          <div
            v-for="(item, index) in items"
            :key="index"
            class="carousels-item"
          >
            <NuxtLink
              v-if="item.ads && onClickBtn"
              :to="item.link"
              target="_blank"
              @click="onClickBtn()"
            >
              <div v-if="item.ads" class="cart-tag">Ads</div>
              <img
                :src="item.imageURL"
                :alt="item.imageName"
                class="cover-card"
              />
              <p class="font-body-2 title-name-ads">
                {{ item.ads ? item.link : item.title }}
              </p>
              <NuxtLink :to="'/artist/' + item.artistLink">
                <p class="font-body-3 sub-title-name-ads">
                  {{ item.description }}
                </p>
              </NuxtLink>
            </NuxtLink>

            <div v-else>
              <NuxtLink :to="item.link">
                <img
                  :src="item.imageURL"
                  :alt="item.imageName"
                  class="cover-card"
                />
                <div class="square-button-play">
                  <div
                    v-if="showIconHover && !item.ads"
                    class="square-play-black"
                  ></div>
                </div>
                <div class="mask-card"></div>
              </NuxtLink>
              <div class="card-title">
                <p
                  class="title-name"
                  :class="showTextOverlay ? 'font-subtitle-3' : 'font-body-2'"
                >
                  {{ item.title }}
                </p>
                <div class="sitting-action sub-menu-square">
                  <div class="section-profile">
                    <span
                      class="material-symbols-outlined icon-more"
                      @click="toggleDropdown(index, $event, item)"
                    >
                      more_vert
                    </span>
                  </div>
                </div>
              </div>
              <NuxtLink v-if="!showPlaylist" :to="'/artist/' + item.artistLink">
                <p class="font-body-3 sub-title-name">
                  {{ item.description }}
                </p>
              </NuxtLink>
              <div v-if="showPlaylist && item.description">
                <p
                  id="playlist-description"
                  class="partner-description font-body-2"
                  v-html="item.description"
                ></p>
              </div>
              <PartnerCard
                v-if="showPartner"
                :partner-name="item.partnerName"
                :partner-image="item.partnerImage"
              ></PartnerCard>
            </div>
          </div>
        </div>

        <div class="dropdown-setting sub-menu-square">
          <ul
            v-if="
              homePageStore.dropdownData[numberIndex] &&
              homePageStore.dropdownData[numberIndex].status === true &&
              homePageStore.dropdownData[numberIndex].title === dataItem?.title
            "
            class="dropdown"
            :style="[
              { marginLeft: `${dropdownMarginLeft}px` },
              dataItem?.description && showPartner
                ? { marginTop: '-100px' }
                : !dataItem?.description && showPartner
                  ? { marginTop: '-150px' }
                  : showAlbum && dataItem?.description
                    ? { marginTop: '-70px' }
                    : showAlbum && !dataItem?.description
                      ? { marginTop: '-50px' }
                      : showPlaylist && !showTextOverlay
                        ? { marginTop: '-115px' }
                        : { marginTop: '-50px' },
            ]"
          >
            <DropdownItem
              :item="dataItem"
              :is-show-playlist="showPlaylist"
              :is-favorite-playlist="true"
              :is-show-album="showAlbum"
              :is-show-artist="showArtist"
            />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/carousel/SquareCarousel.scss"
  lang="scss"
  scoped
></style>
