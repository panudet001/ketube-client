<script lang="ts" setup>
import Headers from "~/components/layouts/header/Header.vue";
import Sidebar from "~/components/layouts/sidebar/Sidebar.vue";
import Footer from "~/components/layouts/footer/Footer.vue";
import { useSidebarStore } from "~/store/useSidebarStore";
import { useUserStore } from "~/store/useUserStore";
import { useAuthStore } from "~/store/useAuthStore";

const sidebarStore = useSidebarStore();
const isSidebarOpen = ref(sidebarStore.isSidebarOpen);
const userStore = useUserStore();
const authStore = useAuthStore();

await useAsyncData(() => userStore.get());
await useAsyncData(() => userStore.getFavorites());

const fullName = userStore.user?.name ?? "";
const image = userStore.user?.image ?? "";
const isShowLogin = ref<boolean>(false);

if (!authStore.isAuthenticated || !fullName) {
  isShowLogin.value = true;
}

const sidebarMenus = [
  {
    displayName: "หน้าแรก",
    iconMenu: "home",
    route: "/",
  },
  { displayName: "ศิลปินรวม", iconMenu: "artist", route: "/artists" },
  {
    displayName: "เพลย์ลิสต์",
    iconMenu: "library_music",
    route: "/playlists",
  },
  {
    displayName: "คาราโอเกะ",
    iconMenu: "mic",
    route: "/karaoke",
  },
];

watchEffect(() => {
  isSidebarOpen.value = sidebarStore.isSidebarOpen;
});
</script>

<template>
  <div class="layout-container">
    <!-- Header -->
    <header class="section-header">
      <Headers
        :full-name="fullName"
        :image-profile="image"
        :show-login="isShowLogin"
        :role-name="''"
        :is-partner="userStore.user?.isPartner"
        :partner-name="userStore.user?.partnerName"
        :partner-image="userStore.user?.partnerImage"
      ></Headers>
    </header>

    <div class="section-sidebar" :class="{ open: isSidebarOpen }">
      <Sidebar :sidebar-menus="sidebarMenus"></Sidebar>
    </div>

    <!-- Content -->
    <div class="section-content">
      <!-- Background -->
      <div class="main-bg">
        <img
          class="left-gradient"
          src="assets/images/backgrounds/left_gradient.png"
          alt="Image"
        />
        <img
          class="right-gradient"
          src="assets/images/backgrounds/right_gradient.png"
          alt="Image"
        />
        <img
          class="top-gradient"
          src="assets/images/backgrounds/top_gradient.png"
          alt="Image"
        />
      </div>
      <main class="main-container">
        <slot />

        <!-- Footer  -->
        <footer class="section-footer">
          <CookieCard></CookieCard>
          <Footer></Footer>
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped src="assets/scss/layouts/default.scss"></style>
