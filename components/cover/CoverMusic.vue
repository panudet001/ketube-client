<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useUserStore } from "~/store/useUserStore";

const props = defineProps<{
  pageName: string;
  title: string;
  titleColor: string;
  subtitle?: string;
  description?: string;
  backgroundImageUrl: string;
  imageUrl: string;
  id: string;
}>();

onMounted(() => {
  if (props.description) {
    const element = document.getElementById("cover-description") as HTMLElement;
    element.innerHTML = props.description;
  }
});

const userStore = useUserStore();
const isShowButton = ref<boolean>(false);

if (userStore.isShowFavorite && props.pageName === "เพลย์ลิสต์") {
  isShowButton.value = true;
}

const dropdownStates = ref<boolean>(false);
function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".card-dropdown")) {
    dropdownStates.value = false;
  }
}

function toggleDropdown() {
  dropdownStates.value = !dropdownStates.value;
}

onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <div class="cover-music-component">
    <div
      class="bg-cover-music"
      :style="{
        backgroundImage: 'url(' + backgroundImageUrl + ')',
      }"
    ></div>
    <div class="bg-blur"></div>
    <div class="header-cover-music">
      <div class="wrapper-cover-music">
        <div class="section-cover-music">
          <div class="cover-music-left">
            <p class="cover-music-title-heading font-subtitle-2">
              {{ pageName }}
            </p>
            <h3
              v-if="titleColor"
              :style="{ '-webkit-text-fill-color': titleColor }"
              class="cover-music-title"
            >
              {{ title }}
            </h3>
            <p class="cover-sub-title font-subtitle-1">
              {{ subtitle }}
            </p>
            <div v-if="description" class="cover-description">
              <p
                id="cover-description"
                class="text-description font-body-2"
              ></p>
            </div>
            <div v-if="isShowButton" class="card-dropdown">
              <button
                class="btn btn-all"
                type="button"
                @click="toggleDropdown()"
              >
                <span class="material-symbols-outlined icon-add">
                  playlist_add
                </span>
              </button>
              <ul v-if="dropdownStates" class="dropdown">
                <DropdownItem :item="{ id }" :is-show-playlist="true" />
              </ul>
            </div>
          </div>
          <div class="cover-music-right">
            <div class="cover-music-image">
              <img :src="imageUrl" alt="Image" class="cover-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="/components/cover/CoverMusic.scss" lang="scss" scoped></style>
