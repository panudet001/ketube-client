<script setup lang="ts">
import { ref } from "vue";
import moment from "moment";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { transformError } from "~/utils/transformError";
import { useUserStore } from "~/store/useUserStore";
import type { User } from "~/interfaces/responses/user/User";

definePageMeta({
  layout: "false",
});

const isRenderFinish = ref<boolean>(false);
const userStore = useUserStore();
await useAsyncData(() => userStore.get());
const isMsgError = ref<boolean>(true);
const msgError = ref<string>("");
const isLoading = ref<boolean>(false);
const videoAutoplay = ref<boolean>(true);

const formProfile = ref({
  name: userStore.user?.name ?? "",
  gender: userStore.user?.gender ?? "",
  day: moment(userStore.user?.dateOfBirth).date() ?? "",
  month: moment(userStore.user?.dateOfBirth).format("MMMM") ?? "",
  year: moment(userStore.user?.dateOfBirth).year() ?? "",
});

const dates = Array.from({ length: 31 }, (_, index) => index + 1);
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, index) => currentYear - index);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dateMobile = ref<string>(
  `${formProfile.value.year}-${moment().month(formProfile.value.month).format("MM")}-${formProfile.value.day}`,
);

function handleDateChangeMobile() {
  formProfile.value.day = moment(dateMobile.value).date();
  formProfile.value.month = moment(dateMobile.value).format("MMMM");
  formProfile.value.year = moment(dateMobile.value).year();
}

async function handleSubmit() {
  isLoading.value = true;
  isMsgError.value = true;

  if (
    !formProfile.value.name ||
    !formProfile.value.gender ||
    !formProfile.value.day ||
    !formProfile.value.year ||
    formProfile.value.month === "Invalid date"
  ) {
    isLoading.value = false;
    isMsgError.value = false;
    return;
  }

  const sumDate = moment(
    `${formProfile.value.year}-${formProfile.value.month}-${formProfile.value.day}`,
    "YYYY-MMMM-DD",
  );

  const dateOfBirth = sumDate.isValid() ? sumDate.toISOString() : "";

  const formData: User = {
    name: formProfile.value.name,
    gender: formProfile.value.gender,
    dateOfBirth,
  };

  await userStore.updateProfile(formData);
  if (userStore.error) {
    const errMsg = transformError(userStore.error.message);
    msgError.value = errMsg;
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
    isLoading.value = false;
  } else {
    showSweetAlert(
      "สำเร็จ! บันทึกข้อมูลเรียบร้อยแล้ว",
      "success",
      4000,
      true,
      "top-end",
    );
    isLoading.value = false;
    navigateTo("/");
  }
}

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
</script>
<template>
  <div v-if="isRenderFinish === true" class="sign-up-page">
    <div class="section-left">
      <video loop class="video-sign-up" :autoplay="videoAutoplay">
        <source src="assets/images/video/Sign_up_Video.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="section-right">
      <NuxtLink to="/sign-up">
        <button class="btn btn-back">
          <i class="las la-angle-left"></i>
          <p class="font-body-2">กลับ</p>
        </button>
      </NuxtLink>

      <form @submit.prevent="handleSubmit">
        <div class="section-form-profile">
          <h5 class="title-profile">บอกเราเกี่ยวกับตัวคุณ</h5>

          <!-- Desktop -->
          <div class="input-name">
            <label for="full-name" class="form-label">ชื่อ</label>
            <input
              id="full-name"
              v-model="formProfile.name"
              type="text"
              class="form-control-rounded-normal"
              :class="!formProfile.name && !isMsgError ? 'is-invalid' : ''"
              autocomplete="off"
              placeholder="กรุณาระบุชื่อ"
              aria-describedby="name"
            />
            <p id="name" class="invalid-feedback">กรุณาระบุชื่อ</p>
          </div>
          <div class="select">
            <label for="gender" class="form-label">เพศ</label>
            <select
              v-model="formProfile.gender"
              class="form-select"
              aria-label="Default gender"
              :class="!formProfile.gender && !isMsgError ? 'is-invalid' : ''"
              aria-describedby="gender"
            >
              <option disabled value="">กรุณาระบุเพศ</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="NoIdentify">NoIdentify</option>
              <option value="Transgender">Transgender</option>
            </select>
            <p id="gender" class="invalid-feedback text-start">กรุณาระบุเพศ</p>
          </div>
          <div class="title-label">วัน เดือน ปีเกิด</div>
          <div class="section-date">
            <div class="w-100">
              <select
                v-model="formProfile.day"
                class="form-select"
                aria-label="Default date"
                :class="!formProfile.day && !isMsgError ? 'is-invalid' : ''"
                aria-describedby="date"
              >
                <option disabled value="">กรุณาระบุวันที่</option>
                <option v-for="date in dates" :key="date">
                  {{ date }}
                </option>
              </select>
              <p id="date" class="invalid-feedback text-start">
                กรุณาระบุวันที่
              </p>
            </div>
            <div class="w-100">
              <select
                v-model="formProfile.month"
                class="form-select"
                aria-label="Default month"
                :class="
                  formProfile.month === 'Invalid date' && !isMsgError
                    ? 'is-invalid'
                    : ''
                "
                aria-describedby="month"
              >
                <option disabled value="">กรุณาระบุเดือน</option>
                <option v-for="(month, index) in months" :key="index + 1">
                  {{ month }}
                </option>
              </select>
              <p id="month" class="invalid-feedback text-start">
                กรุณาระบุเดือน
              </p>
            </div>
            <div class="w-100">
              <select
                v-model="formProfile.year"
                class="form-select"
                aria-label="Default year"
                :class="!formProfile.year && !isMsgError ? 'is-invalid' : ''"
                aria-describedby="year"
              >
                <option disabled value="">กรุณาระบุปี</option>
                <option v-for="year in years" :key="year">
                  {{ year }}
                </option>
              </select>
              <p id="year" class="invalid-feedback text-start">กรุณาระบุปี</p>
            </div>
          </div>
          <!-- Mobile -->
          <div class="input-date">
            <input
              id="full-name"
              v-model="dateMobile"
              type="date"
              class="form-control-rounded-normal"
              :class="!formProfile.day && !isMsgError ? 'is-invalid' : ''"
              autocomplete="off"
              placeholder="YYYY-MM-DD"
              aria-describedby="date"
              @input="handleDateChangeMobile"
            />
            <p id="date" class="invalid-feedback">กรุณาระบุวัน/เดือน/ปี</p>
          </div>
          <p class="title-accept font-body-4">
            การสร้างบัญชีแสดงว่าคุณยอมรับ Ketube
          </p>
          <p class="title-policy font-body-4">
            ข้อกำหนดการใช้งาน , นโยบายความเป็นส่วนตัว , และ นโยบายคุกกี้
          </p>
          <button
            type="submit"
            class="btn btn-outline-primary w-100"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              aria-hidden="false"
            ></span>
            <span
              :class="[isLoading ? 'visually' : 'visually-hidden']"
              role="status"
              >กำลังบันทึก...</span
            >
            <span
              :class="[!isLoading ? 'visually' : 'visually-hidden']"
              role="status"
              >ยืนยัน</span
            >
          </button>
          <p class="title-recaptcha font-body-4">
            ไซต์นี้ได้รับการคุ้มครองโดย reCAPTCHA นโยบายความเป็นส่วนตัวของ
            Google และข้อกำหนดในการให้บริการมีผลบังคับใช้
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style src="assets/scss/pages/sign-up/sign-up.scss" lang="scss" scoped></style>
