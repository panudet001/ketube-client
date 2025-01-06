<script setup lang="ts">
import { ref } from "vue";

import {
  useTokenClient,
  type AuthCodeFlowSuccessResponse,
  type AuthCodeFlowErrorResponse,
} from "vue3-google-signin";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { useAuthStore } from "~/store/useAuthStore";
import { transformError } from "~/utils/transformError";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const isRenderFinish = ref<boolean>(false);
const videoAutoplay = ref<boolean>(true);

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});

const handleOnSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  await authStore.loginByGoogle(response.access_token);
  if (authStore.error) {
    const errMsg = transformError(authStore.error.exception);
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
  }
};

const handleOnError = (err: AuthCodeFlowErrorResponse) => {
  showSweetAlert(err.error.message, "error", 4000, true, "top-end");
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});

const isMobile = () => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return width < 900 || height < 900;
};

onMounted(() => {
  if (isMobile()) {
    videoAutoplay.value = false;
  } else {
    videoAutoplay.value = true;
  }
});

useHead({
  title: "Login",
});
</script>
<template>
  <div v-if="isRenderFinish == true" class="login-page">
    <div class="section-left">
      <video loop class="video-login" :autoplay="videoAutoplay">
        <source src="assets/images/video/Log_in_Video.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="section-right">
      <a href="/">
        <button class="btn btn-back">
          <i class="las la-angle-left icon-back"></i>
          <span>กลับ</span>
        </button>
      </a>
      <div class="section-form-login">
        <img
          src="assets/images/icons/logo/logo.png"
          alt="logo"
          class="img-logo"
        />
        <h4>เข้าสู่ระบบ</h4>
        <p class="font-body-2 title">ยินดีต้อนรับกลับมาอีกครั้ง</p>
        <button
          class="btn btn-outline-third w-100"
          :disabled="!isReady"
          @click="() => login()"
        >
          <span
            v-if="authStore.isLoading"
            class="spinner-border spinner-border-sm"
            aria-hidden="false"
          ></span>
          <span
            :class="[authStore.isLoading ? 'visually' : 'visually-hidden']"
            role="status"
            >กำลังบันทึก...</span
          >
          <span
            :class="[!authStore.isLoading ? 'visually' : 'visually-hidden']"
            role="status"
            ><img
              src="assets/images/icons/social/google.png"
              alt="logo"
              class="img-google"
            />เข้าสู่ระบบด้วย Google</span
          >
        </button>
        <p class="title-sign-up">
          คุณยังไม่มีบัญชี?
          <NuxtLink to="/sign-up">
            <span class="title-ketube">ลงทะเบียน Ketube</span>
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style src="assets/scss/pages/login/login.scss" lang="scss" scoped></style>
