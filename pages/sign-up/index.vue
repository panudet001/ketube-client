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

const handleOnSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  await authStore.registerByGoogle(response.access_token);
  if (authStore.error) {
    const errMsg = transformError(authStore.error.message);
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

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
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
  title: "Sing-up",
});
</script>
<template>
  <div v-if="isRenderFinish === true" class="sign-up-page">
    <div class="section-left">
      <video loop class="video-sign-up" :autoplay="videoAutoplay">
        <source src="assets/images/video/Sign_up_Video.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="section-right">
      <NuxtLink to="/">
        <button class="btn btn-back">
          <i class="las la-angle-left"></i>
          <p class="font-body-2">กลับ</p>
        </button>
      </NuxtLink>
      <div class="section-form-sign-up">
        <img
          src="assets/images/icons/logo/logo.png"
          alt="logo"
          class="img-logo"
        />
        <h4>ลงทะเบียนเพื่อร้องเพลง</h4>
        <p class="font-body-2 title">
          มาร่วมสนุกกับการร้องเพลงในคลังคาราโอเกะของเรา
        </p>
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
            />ลงทะเบียนด้วย Google</span
          >
        </button>
        <p class="title-sign-up">
          คุณมีบัญชีอยู่แล้ว?
          <NuxtLink to="/login">
            <span class="title-ketube">เข้าสู่ระบบ</span>
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style src="assets/scss/pages/sign-up/sign-up.scss" lang="scss" scoped></style>
