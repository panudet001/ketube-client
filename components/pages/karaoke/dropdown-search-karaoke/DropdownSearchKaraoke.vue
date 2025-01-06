<script setup lang="ts">
import { defineProps } from "vue";
import type { Item } from "~/store/useVideoStore";

defineProps<{
  items?: Item[];
  onClickBtn?: (value: Item) => void;
  onClickAds?: () => void;
}>();
</script>

<template>
  <div class="dropdown-search-karaoke-component">
    <div v-if="items && items.length > 0" class="search-container">
      <div v-for="item in items" :key="item.title" class="search-list">
        <NuxtLink
          v-if="item.ads"
          class="search-ads"
          target="_blank"
          :href="item.slug"
          @click="onClickAds"
        >
          <img :src="item.imageURL" alt="Image" class="cover-music" />
          <div class="group-music">
            <div class="card-tag">Ads</div>
            <p class="text-artist font-body-2">{{ item.description }}</p>
          </div>
        </NuxtLink>
        <div v-if="!item.ads" class="search-music">
          <button
            v-if="onClickBtn"
            class="btn btn-add-music"
            @click="onClickBtn(item)"
          >
            <i class="las la-plus add-icon"></i>
          </button>
          <img :src="item.imageURL" alt="cover-music" class="cover-music" />
          <div class="group-music">
            <p class="text-music font-body-1">{{ item.title }}</p>
            <p class="text-artist font-body-2">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/pages/karaoke/dropdown-search-karaoke/DropdownSearchKaraoke.scss"
  lang="scss"
  scoped
></style>
