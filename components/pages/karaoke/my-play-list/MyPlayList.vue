<script setup lang="ts">
import { defineProps } from "vue";
import type { PlayListBySlug } from "~/services/playlists/playlists.type";
import type { Video } from "~/shared/types/video.type";

const props = defineProps<{
  list: PlayListBySlug[];
  playListSong?: Video[];
  searchPlaylist: Function;
  addQueue: Function;
  coverImage: Function;
}>();
const text = ref<string>("เลือกเพลย์ลิสต์");

function closeDropdown(val: string) {
  const button = document.querySelector(`.${val}.action`) as HTMLElement;
  if (button) {
    button.classList.remove("action");
    button.style.display = "none";
  }
}

function showDropdown(val: string) {
  const button = document.querySelector(`.${val}`) as HTMLElement;
  if (!button.classList.contains("action")) {
    button.classList.add("action");
    button.style.display = "block";
  } else {
    closeDropdown(val);
  }
}

function handleData(val: string, name: string = "", slug: string = "") {
  text.value = name;
  props.searchPlaylist(slug);
  closeDropdown(val);
}
</script>
<template>
  <div class="my-playlist-component">
    <div class="select-container">
      <div class="input-select">
        <div class="form-control" @click="showDropdown('select')">
          <p>{{ text }}</p>
          <p>
            <span class="icon-prefix">
              <img src="assets/images/icons/drop-down.png" alt="Image" />
            </span>
          </p>
        </div>
        <div class="dropdown-select select">
          <div
            v-for="(option, index) in list"
            :key="index"
            class="dropdown-content"
            @click="handleData('select', option.name, option.slug)"
          >
            <img
              :src="coverImage(option.image)"
              alt="Image"
              class="cover-music"
            />
            <div class="content-list">
              {{ option.name }}
            </div>
          </div>
          <div v-if="list.length < 1" class="dropdown-content empty-search">
            <i class="las la-music icon-search"></i>
            <div class="empty-text">
              <span class="font-body-3">ไม่พบรายการเพลย์ลิสต์</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="my-playlist-container">
      <div v-if="playListSong" class="play-list-container">
        <div v-for="item in playListSong" :key="item.id" class="play-list">
          <div class="play-list-music">
            <button class="btn btn-add-music">
              <i class="las la-plus add-icon" @click="addQueue(item.slug)"></i>
            </button>
            <img
              :src="coverImage(item.image)"
              alt="Image"
              class="cover-music"
            />
            <div class="group-music">
              <p class="text-artist">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="components/pages/karaoke/my-play-list/MyPlayLlist.scss"
  lang="scss"
  scoped
></style>
