<script lang="ts" setup>
import { ref, defineProps, onMounted, onBeforeUnmount } from "vue";

export interface Item {
  title: string;
  description: string;
  imageURL: string;
  imageName: string;
  link: string;
  partnerName: string;
  slug: string;
  id?: string;
}

defineProps<{
  items: Item[];
  isShowCoverTitle?: boolean;
  showPartner?: boolean;
  isShowPlaylist?: boolean;
  isShowAlbum?: boolean;
  resetData?: () => void;
}>();
const dropdownStates = ref<Record<number, boolean>>({});

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".dropdown-setting")) {
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
  <div class="square-card-component">
    <div v-if="items && items.length > 0" class="square-card-container">
      <div class="square-card-row">
        <div v-for="(item, index) in items" :key="index" class="square-card">
          <NuxtLink
            :to="item.link"
            class="section-card"
            :style="{ 'background-image': 'url(' + item.imageURL + ')' }"
          >
            <div class="square-card-image">
              <div class="square-cover-image"></div>
              <div v-if="isShowCoverTitle" class="square-cover">
                <p class="square-cover-title h7">
                  {{ item.title }}
                </p>
              </div>
              <div class="square-card-mask"></div>
            </div>
          </NuxtLink>
          <div class="square-card-body">
            <div class="square-card-title d-flex justify-content-between">
              <p class="title-name font-subtitle-3">{{ item.title }}</p>
              <div class="dropdown-setting">
                <span
                  class="material-symbols-outlined icon-more"
                  @click="toggleDropdown(index)"
                >
                  more_vert
                </span>
                <ul v-if="dropdownStates[index]" class="dropdown">
                  <DropdownItem
                    :item="item"
                    :is-show-playlist="isShowPlaylist"
                    :is-favorite-playlist="true"
                    :is-show-album="isShowAlbum"
                    :reset-data="resetData"
                  />
                </ul>
              </div>
            </div>
            <div v-if="item.description">
              <p
                id="playlist-description"
                class="square-card-description font-body-3"
                v-html="item.description"
              ></p>
            </div>
            <div v-if="showPartner" class="d-flex">
              <div class="tooltips-container">
                <div class="d-flex">
                  <img
                    src="assets/images/icons/verified.png"
                    alt="icon-verified"
                    class="icon-verified"
                  />
                  <span class="text-partner font-body-3">{{
                    item.partnerName
                  }}</span>
                </div>
                <span class="tooltips font-body-3">{{ item.partnerName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="/components/card/SquareCard.scss" lang="scss" scoped></style>
