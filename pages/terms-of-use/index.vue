<script lang="ts" setup>
import { useTermsOfUsePageStore } from "~/store/useTermsOfUsePageStore";

const termsOfUsePageStore = useTermsOfUsePageStore();
await useAsyncData(() => termsOfUsePageStore.getTermsOfUse());

onMounted(() => {
  const element = document.getElementById("terms-of-use") as HTMLElement;
  element.innerHTML = termsOfUsePageStore.termsOfUseData?.content ?? "";
});

definePageMeta({
  layout: "policy",
});
useHead({
  title: "ข้อกำหนดการใช้งาน",
});
</script>
<template>
  <div class="terms-of-use-page">
    <div class="wrapper-content">
      <h3>ข้อกำหนดการใช้งาน</h3>
      <p class="font-body-2">อัปเดตล่าสุด: 12 พฤศจิกายน 2023</p>
      <div id="terms-of-use"></div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/terms-of-use/terms-of-use.scss"
  lang="scss"
  scoped
></style>
