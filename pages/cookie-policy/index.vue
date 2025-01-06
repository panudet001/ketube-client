<script lang="ts" setup>
import { useCookiePolicyPageStore } from "~/store/useCookiePolicyPageStore";

const cookiePolicyPageStore = useCookiePolicyPageStore();
await useAsyncData(() => cookiePolicyPageStore.getCookiePolicy());

onMounted(() => {
  const element = document.getElementById("cookie-policy") as HTMLElement;
  element.innerHTML = cookiePolicyPageStore.cookiePolicyData?.content ?? "";
});

definePageMeta({
  layout: "policy",
});

useHead({
  title: "นโยบายคุกกี้",
});
</script>
<template>
  <div class="cookie-policy-page">
    <div class="wrapper-content">
      <h3>นโยบายคุกกี้</h3>
      <p class="font-body-2">อัปเดตล่าสุด: 12 พฤศจิกายน 2023</p>
      <div id="cookie-policy"></div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/cookie-policy/cookie-policy.scss"
  lang="scss"
  scoped
></style>
