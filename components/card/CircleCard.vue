<script lang="ts" setup>
import { defineProps } from "vue";

export interface Item {
  title: string;
  description: string;
  imageURL: string;
  imageName: string;
  link: string;
}

defineProps<{
  items: Item[];
}>();
</script>

<template>
  <div class="circle-card-component">
    <div v-if="items && items.length > 0" class="circle-card-container">
      <div class="circle-card-row">
        <div v-for="(item, index) in items" :key="index" class="circle-card">
          <NuxtLink :to="item.link">
            <div class="circle-card-image">
              <img
                :src="item.imageURL"
                :alt="item.imageName"
                class="circle-cover-image"
              />
              <div class="circle-card-mask"></div>
            </div>
            <div class="circle-card-body">
              <p class="circle-card-title font-body-1">
                {{ item.title }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="/components/card/CircleCard.scss" lang="scss" scoped></style>
