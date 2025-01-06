<script setup lang="ts">
import Headers from "~/components/layouts/header/Header.vue";
import { useAuthStore } from "~/store/useAuthStore";
import { useUserStore } from "~/store/useUserStore";

const userStore = useUserStore();
const authStore = useAuthStore();
await useAsyncData(() => userStore.get());
const fullName = userStore.user?.name ?? "";
const image = userStore.user?.image ?? "";
const isShowLogin = ref<boolean>(false);

if (!authStore.isAuthenticated) {
  isShowLogin.value = true;
}
</script>

<template>
  <div class="policy-layout-container">
    <!-- Header -->
    <header class="section-header">
      <Headers
        :full-name="fullName"
        :image-profile="image"
        :show-login="isShowLogin"
        :show-sidebar="false"
        :role-name="'Partner'"
        :is-partner="userStore.user?.isPartner"
        :partner-name="userStore.user?.partnerName"
        :partner-image="userStore.user?.partnerImage"
      ></Headers>
    </header>

    <!-- Content -->
    <div class="section-content">
      <main class="main-container">
        <slot />

        <!-- Footer  -->
        <footer class="section-footer">
          <Footer></Footer>
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped src="assets/scss/layouts/policy.scss"></style>
