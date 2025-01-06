<script lang="ts" setup>
import { defineProps } from "vue";
import { useKaraokeStore } from "~/store/useKaraokeStore";
// Store
const karaokeStore = useKaraokeStore();

const props = defineProps<{
  addQueue: (slug: string) => void;
}>();
</script>

<template>
  <div class="queue-container">
    <div class="queue-title">
      <span class="font-subtitle-3">เพลงแนะนำ</span>
    </div>
    <div class="queue-body">
      <div
        v-for="(item, index) in karaokeStore.recommendedVideos"
        :key="index"
        class="queue-item"
      >
        <i
          class="las la-plus icon-up"
          @click="
            () => {
              karaokeStore.addVideo(item);
              props.addQueue(item.slug);
            }
          "
        ></i>
        <img :src="item.imageURL" :alt="item.name" class="cover-music" />
        <div class="group-music">
          <p class="text-music font-body-2">{{ item.name }}</p>
          <p class="text-artist font-body-2">
            {{ item.artists }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/pages/karaoke/recommended-songs/RecommendedSongs.scss"
  lang="scss"
  scoped
></style>
