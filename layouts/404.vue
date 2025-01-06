<script lang="ts" setup>
import Headers from "~/components/layouts/header/Header.vue";
import Sidebar from "~/components/layouts/sidebar/Sidebar.vue";
import Footer from "~/components/layouts/footer/Footer.vue";
import { useUserStore } from "~/store/useUserStore";
import { useSidebarStore } from "~/store/useSidebarStore";
import { useAuthStore } from "~/store/useAuthStore";

const sidebarStore = useSidebarStore();
const userStore = useUserStore();
const authStore = useAuthStore();
await useAsyncData(() => userStore.get());
const fullName = userStore.user?.name ?? "";
const image = userStore.user?.image ?? "";
const isSidebarOpen = ref(sidebarStore.isSidebarOpen);
const isShowLogin = ref<boolean>(false);

if (!authStore.isAuthenticated) {
  isShowLogin.value = true;
}

const sidebarMenulist = [
  {
    displayName: "หน้าแรก",
    iconMenu: "home",
    route: "/",
  },
  {
    displayName: "ค้นหา",
    iconMenu: "action_key",
    route: "/explore",
  },
  { displayName: "ศิลปิน", iconMenu: "artist", route: "/artists" },
  {
    displayName: "เพลย์ลิสต์",
    iconMenu: "library_music",
    route: "/playlists",
  },
];

watchEffect(() => {
  isSidebarOpen.value = sidebarStore.isSidebarOpen;
});
</script>

<template>
  <div class="layout-container-not-found">
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
      <div class="container-error">
        <div class="card-item">
          <h1>404</h1>
          <div class="vision-line">
            <div class="line"></div>
          </div>
          <div class="content">
            <h4>โอ้ว ขอโทษด้วย !</h4>
            <span class="font-subtitle-2"
              >ดูเหมือนว่าเราจะไม่พบหน้าที่คุณกำลังตามหา</span
            >
            <NuxtLink to="/">
              <button class="btn btn-outline-primary">กลับไปหน้าแรก</button>
            </NuxtLink>
          </div>
        </div>

        <div>
          <img
            src="assets/images/backgrounds/404_desktop.png"
            alt="Image"
            class="img-error-pc"
          />
          <img
            src="assets/images/backgrounds/404_mobile.png"
            alt="Image"
            class="img-error-mobile"
          />
        </div>
      </div>
    </div>

    <!-- Footer  -->
    <div class="section-footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<style scoped src="assets/scss/layouts/404.scss"></style>
