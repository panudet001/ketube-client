<script setup lang="ts">
import "vue3-carousel/dist/carousel.css";
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Artist } from "~/interfaces/responses/pages/playlist/Artist";

export interface Item {
  link: string;
  name: string;
  artist: string;
  album?: string;
  albumSlug?: string;
  imageURL: string;
  duration: string;
  slug?: string;
  artistSlug?: string;
  partnerName: string;
  partnerImage: string;
  artists?: Artist[];
  videoSlug?: string;
  id: string;
}

defineProps<{
  items: Item[];
  isShowAlbum: boolean;
  isShowHeader: boolean;
  isShowPartner?: boolean;
  isSmallSize?: boolean;
  isShowNext?: boolean;
  resetData?: () => void;
}>();

const dropdownStates = ref<Record<number, boolean>>({});

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".table-action")) {
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
  <div class="playlist-music-components">
    <table class="custom-table">
      <thead v-if="isShowHeader" class="thead-title">
        <tr>
          <td></td>
          <td class="thead-music font-body-3">ชื่อเพลง</td>
          <td v-if="isShowAlbum" class="thead-album font-body-3">อัลบั้ม</td>
          <td class="thead-duration font-body-3">ระยะเวลา</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" class="tbody">
          <td class="table-no font-body-3">{{ index + 1 }}</td>
          <td class="table-music">
            <NuxtLink :to="item.link" class="music-group">
              <img :src="item.imageURL" alt="cover-image" class="cover-music" />
              <div class="cover-mask">
                <i class="las la-play-circle icon-play"></i>
              </div>
              <div class="music">
                <div
                  class="font-body-3"
                  :class="
                    isSmallSize
                      ? 'music-name-small'
                      : !isShowAlbum && !item.duration && !isSmallSize
                        ? 'music-name-no-album'
                        : 'music-name'
                  "
                >
                  {{ item.name }}
                  <span v-if="item.artist || item.artists" class="font-body-2">
                    -
                  </span>
                  <NuxtLink
                    v-if="item.artist && !item.artists"
                    :to="'/artist/' + item.artistSlug"
                    class="sub-link music-artist font-body-3"
                  >
                    {{ item.artist }}
                  </NuxtLink>
                  <span v-for="(val, idx) in item.artists" :key="idx">
                    <NuxtLink
                      :to="`/artist/${val.slug}`"
                      class="sub-link music-artist font-body-3"
                      >{{ val.name }}
                    </NuxtLink>
                    <span v-if="idx + 1 !== item.artists?.length">, </span>
                  </span>
                </div>
                <PartnerCard
                  v-if="isShowPartner && item.partnerName"
                  :partner-name="item.partnerName"
                  :partner-image="item.partnerImage"
                ></PartnerCard>
              </div>
            </NuxtLink>
          </td>
          <td v-if="isShowAlbum" class="table-album">
            <div class="music-album font-body-2">
              <NuxtLink
                v-if="item.album != '-'"
                :to="'/album/' + item.albumSlug"
                class="sub-link"
              >
                {{ item.album }} {{ item.album }}
              </NuxtLink>
              <p v-if="!item.album">-</p>
            </div>
            <p v-if="item.album === '-'">-</p>
          </td>
          <td v-if="item.duration" class="table-duration font-body-3">
            {{ item.duration }}
          </td>
          <td v-if="isShowNext" class="table-add font-body-3">
            <NuxtLink class="dropdown-item" :href="item.link">
              <span class="material-symbols-outlined icon-w">
                queue_music
              </span>
            </NuxtLink>
          </td>
          <td class="table-action">
            <div class="section-profile d-flex">
              <span
                class="material-symbols-outlined icon-w"
                @click="toggleDropdown(index)"
              >
                more_vert
              </span>
              <ul v-if="dropdownStates[index]" class="dropdown">
                <DropdownItem
                  :item="item"
                  :is-show-album="isShowAlbum"
                  :reset-data="resetData"
                />
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style src="/components/playlist/PlaylistMusic.scss" lang="scss" scoped></style>
