<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
  keyword: string;
}>();
</script>
<template>
  <div class="no-results-card">
    <h6>ไม่พบผลการค้นหาที่คุณต้องการ?</h6>
    <li class="font-body-1">กรุณาตรวจสอบตัวสะกด และลองค้นหาอีกครั้ง</li>
    <li class="font-body-1">
      สามารถค้นหาเพลงอื่นๆ ได้จากหน้าเพลย์ลิสต์และศิลปินรวม
    </li>
    <div class="card-image">
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
</template>
<style
  src="/components/pages/search/not-data/search-not-data.scss"
  lang="scss"
  scoped
></style>
