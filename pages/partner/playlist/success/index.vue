<script lang="ts" setup>
definePageMeta({
  layout: "custom",
});
</script>

<template>
  <div class="success-playlist-partner-page">
    <div class="wrapper-content">
      <div class="section-success d-flex flex-column align-items-center">
        <div class="bg-playlist-success">
          <img
            src="~assets/images/images/album_success.png"
            class="check-success"
            alt="success"
          />
        </div>
        <h3 class="mb-2">สร้างสำเร็จ</h3>
        <p class="font-body-2">
          เพลย์ลิสต์ของคุณถูกสร้างเรียบร้อยแล้ว กรุณารอการอนุมัติจากแอดมิน
        </p>
        <NuxtLink to="/partner/playlist">
          <button class="btn btn-outline-primary">ดูรายละเอียด</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/playlist/success-playlist-partner.scss"
  lang="scss"
  scoped
></style>
