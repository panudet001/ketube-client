<script setup lang="ts">
import { defineProps } from "vue";
export interface Item {
  title: string;
  description: string;
  imageURL: string;
  link: string;
  type: string;
}

defineProps<{
  items?: Item[];
  history?: string[];
  onClickItem: () => void;
  onClickAds: () => void;
  onClickDeleteHistory: (val: string) => void;
}>();
</script>

<template>
  <div class="dropdown-search-component">
    <div class="card-dropdown-search">
      <!-- Search -->
      <div v-for="(item, index) in history" :key="index" class="card-history">
        <a :href="'/search/' + item" class="dropdown-list">
          <span class="material-symbols-outlined icon-size"> history </span>
          <div class="dropdown-music">
            <p class="font-body-3">
              {{ item }}
            </p>
          </div>
        </a>
        <span
          class="material-symbols-outlined cover-del"
          @click="onClickDeleteHistory(item)"
        >
          delete
        </span>
      </div>
      <div v-if="items && items.length > 0">
        <div v-for="(item, index) in items" :key="index">
          <a
            v-if="item.type === 'ads'"
            :href="item.link"
            class="dropdown-list bk-ads m-tb-4"
            target="_blank"
            @click="onClickAds()"
          >
            <img :src="item.imageURL" alt="Image" class="cover-music" />
            <div class="dropdown-music">
              <div class="card-tag">Ads</div>
              <p class="text-ads font-body-3">
                {{ item.title }}
              </p>
            </div>
          </a>
          <a
            v-else
            :href="'/search/' + item.title"
            class="dropdown-list card-item"
            @click="onClickItem()"
          >
            <span class="material-symbols-outlined icon-size"> search </span>
            <div class="dropdown-music">
              <p class="font-body-3">
                {{ item.title }}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/layouts/dropdown-search/DropdownSearch.scss"
  lang="scss"
  scoped
></style>
