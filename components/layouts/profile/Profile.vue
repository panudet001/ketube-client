<script lang="ts" setup>
import Headers from "~/layouts/header/vue";
import Sidebar from "~/layouts/sidebar/sidebar.vue";
import { useSidebarStore } from "~/store/useSidebarStore";

const store = useSidebarStore();
const isSidebarOpen = ref(store.isSidebarOpen);

watchEffect(() => {
  isSidebarOpen.value = store.isSidebarOpen;
});
</script>

<template>
  <div class="layout-container-profile">
    <!-- Header -->
    <div class="section-header">
      <Headers></Headers>
    </div>

    <div class="section-sidebar" :class="{ open: isSidebarOpen }">
      <Sidebar></Sidebar>
    </div>

    <!-- Content -->
    <div class="section-content">
      <!-- Background -->
      <div class="bg-top-pages">
        <img
          class="left-gradient"
          src="~assets/images/backgrounds/left_gradient.png"
          alt="Image"
        />
        <img
          class="right-gradient"
          src="~assets/images/backgrounds/right_gradient.png"
          alt="Image"
        />
        <img
          class="top-gradient"
          src="~assets/images/backgrounds/top_gradient.png"
          alt="Image"
        />
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style
  src="/components/layouts/profile/Profile.scss"
  scoped
  lang="scss"
></style>
