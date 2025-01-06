<script lang="ts" setup>
const cookies = useCookie("list", {
  default: () => true,
  watch: "shallow",
});

function clickCookies() {
  cookies.value = false;
}
</script>

<template>
  <div v-if="cookies" class="cookie-component">
    <div class="header-cookie">
      <img
        src="assets/images/icons/cookie/biskit.png"
        class="img-cookie"
        alt="cookie"
      />
      <p class="title-cookie">เราใช้คุกกี้</p>
    </div>
    <p class="description-cookie">
      เว็บไซต์นี้ใช้คุกกี้เพื่อมอบประสบการณ์ที่สะดวกให้กับคุณ
      คุกกี้เหล่านี้จำเป็น
      สำหรับการดำเนินเว็บไซต์ของเราและเป็นกุญแจสำคัญในการมอบบริการที่
      สะดวกและเป็นส่วนตัวยิ่งขึ้นให้กับคุณ เพิ่มเติม...
    </p>
    <div class="cookie-action">
      <button class="btn btn-outline-third" @click="clickCookies()">
        ปฏิเสธ
      </button>
      <button class="btn btn-outline-primary" @click="clickCookies()">
        ยอมรับ
      </button>
    </div>
  </div>
</template>

<style src="/components/cookie/CookieCard.scss" lang="scss" scoped></style>
