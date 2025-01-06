<script lang="ts" setup>
import { usePrivacyPolicyPageStore } from "~/store/usePrivacyPolicyPageStore";

const privacyPolicyPageStore = usePrivacyPolicyPageStore();
await useAsyncData(() => privacyPolicyPageStore.getPrivacyPolicy());

onMounted(() => {
  const element = document.getElementById("privacy-policy") as HTMLElement;
  element.innerHTML = privacyPolicyPageStore.privacyPolicyData?.content ?? "";
});

definePageMeta({
  layout: "policy",
});
useHead({
  title: "นโยบายความเป็นส่วนตัว",
});
</script>
<template>
  <div class="privacy-policy-page">
    <div class="wrapper-content">
      <h3>นโยบายความเป็นส่วนตัว</h3>
      <p class="font-body-2">อัปเดตล่าสุด: 12 พฤศจิกายน 2023</p>
      <div id="privacy-policy"></div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/privacy-policy/privacy-policy.scss"
  lang="scss"
  scoped
></style>
