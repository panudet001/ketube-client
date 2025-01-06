<script lang="ts" setup>
import { useKaraokeStore } from "~/store/useKaraokeStore";
// Store
const karaokeStore = useKaraokeStore();
</script>

<template>
  <div class="queue-container">
    <div class="queue-title">
      <i class="las la-list"></i>
      <span class="font-subtitle-3">คิวเพลง</span>
      <span>•</span>

      <span class="font-body-2"> {{ karaokeStore.queues.length }} เพลง</span>
    </div>
    <div class="queue-body">
      <div v-if="karaokeStore.queues.length <= 0" class="que-not">
        <img
          src="../../../../assets/images/icons/music-folder.png"
          class="img"
          alt="music-folder"
        />

        <p class="font-body-1">ไม่มีคิวเพลงเพิ่มเติม</p>
      </div>
      <div
        v-for="item in karaokeStore.queues"
        :key="item.id"
        class="queue-item"
      >
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
  src="/components/pages/karaoke/queue-list-fullscreen/QueueuListFullscreen.scss"
  lang="scss"
  scoped
></style>
