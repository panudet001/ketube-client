<script lang="ts" setup>
definePageMeta({
  layout: "custom",
});
</script>

<template>
  <div class="success-album-partner-page">
    <div class="wrapper-content">
      <div class="section-success d-flex flex-column align-items-center">
        <div class="bg-album-success">
          <img
            src="~assets/images/images/album_success.png"
            class="check-success"
            alt="success"
          />
        </div>
        <h3 class="mb-2">สร้างสำเร็จ</h3>
        <p class="font-body-2">
          อัลบั้มของคุณถูกสร้างเรียบร้อยแล้ว กรุณารอการอนุมัติจากแอดมิน
        </p>
        <NuxtLink to="/partner/album">
          <button class="btn btn-outline-primary">ดูรายละเอียด</button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/album/success-album-partner.scss"
  lang="scss"
  scoped
></style>
