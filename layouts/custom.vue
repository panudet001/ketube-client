<script setup lang="ts">
import Headers from "~/components/layouts/header/Header.vue";
import Sidebar from "~/components/layouts/sidebar/Sidebar.vue";
import { useAuthStore } from "~/store/useAuthStore";
import { useSidebarStore } from "~/store/useSidebarStore";
import { useUserStore } from "~/store/useUserStore";

const sidebarStore = useSidebarStore();
const isSidebarOpen = ref(sidebarStore.isSidebarOpen);
const userStore = useUserStore();
const authStore = useAuthStore();
await useAsyncData(() => userStore.get());
const fullName = userStore.user?.name ?? "";
const image = userStore.user?.image ?? "";
const isShowLogin = ref<boolean>(false);

if (!authStore.isAuthenticated) {
  isShowLogin.value = true;
}

const sidebarMenulist = [
  {
    displayName: "Music",
    iconMenu: "genres",
    route: "/partner/music",
  },
  {
    displayName: "Album",
    iconMenu: "library",
    route: "/partner/album",
  },
  {
    displayName: "Playlist",
    iconMenu: "playlist_partner",
    route: "/partner/playlist",
  },
  {
    displayName: "Request",
    iconMenu: "space",
    route: "/partner/ticket-request",
  },
];

watchEffect(() => {
  isSidebarOpen.value = sidebarStore.isSidebarOpen;
});
</script>

<template>
  <div class="custom-layout-container">
    <!-- Header -->
    <header class="section-header">
      <Headers
        :full-name="fullName"
        :image-profile="image"
        :show-login="isShowLogin"
        :role-name="'Partner'"
        :is-partner="userStore.user?.isPartner"
        :partner-name="userStore.user?.partnerName"
        :partner-image="userStore.user?.partnerImage"
      ></Headers>
    </header>

    <div class="section-sidebar" :class="{ open: isSidebarOpen }">
      <Sidebar :sidebar-menus="sidebarMenulist"></Sidebar>
    </div>

    <!-- Content -->
    <div class="section-content">
      <main class="main-container">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped src="assets/scss/layouts/custom.scss"></style>
