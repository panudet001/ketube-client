<script setup lang="ts">
// Variable
const isRenderFinish = ref<boolean>(false);
// Nuxt Hook
const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});
</script>

<template>
  <div v-if="isRenderFinish" class="footer">
    <hr class="line-footer" />
    <div class="wrapper wrapper-content">
      <a href="/">
        <img
          src="assets/images/icons/logo/logo.png"
          alt="Icon Ketube"
          class="logo"
        />
      </a>
      <div class="content-container">
        <div class="content-left">
          <p class="text-content font-body-2">
            เส้นทางคาราโอเกะที่ดีที่สุดของคุณในการร้องเพลง การแบ่งปัน
            และการเชื่อมต่อ ปลดปล่อยเสียงของคุณและร่วมการเดินทาง ทางดนตรี!
          </p>
        </div>
        <div class="content-center font-body-2">
          <div class="column">
            <NuxtLink to="/">หน้าแรก</NuxtLink>
            <NuxtLink to="/playlists">เพลย์ลิสต์</NuxtLink>
            <NuxtLink to="/artists">ศิลปิน</NuxtLink>
          </div>
          <div class="column">
            <NuxtLink rel="noopener noreferrer" to="/terms-of-use"
              >ข้อกำหนดการใช้งาน</NuxtLink
            >
            <NuxtLink rel="noopener noreferrer" to="/privacy-policy"
              >นโยบายความเป็นส่วนตัว</NuxtLink
            >
            <NuxtLink rel="noopener noreferrer" to="/cookie-policy"
              >นโยบายคุกกี้</NuxtLink
            >
          </div>
          <div class="column">
            <NuxtLink to="/about-us">เกี่ยวกับเรา</NuxtLink>
          </div>
        </div>
      </div>
      <div class="footer-end">
        <hr class="line-footer-end" />
        <p class="text-footer-end font-body-2">
          2023 Ketube, Inc. All Rights Reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<style src="/components/layouts/footer/Footer.scss" scoped lang="scss"></style>
