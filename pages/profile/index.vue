<script setup lang="ts">
import { ref } from "vue";
import moment from "moment";
import { environment } from "~/services/environments";
import { useUserStore } from "~/store/useUserStore";
import { transformError } from "~/utils/transformError";
import { showSweetAlert } from "~/utils/showSweetAlert";
import type { User } from "~/interfaces/responses/user/User";

const userStore = useUserStore();
await useAsyncData(() => userStore.get());

const dateBirth = ref<string>(
  `${moment(userStore.user?.dateOfBirth).date()} ${moment(userStore.user?.dateOfBirth).format("MMMM")} ${moment(userStore.user?.dateOfBirth).year()}`,
);

const isRenderFinish = ref<boolean>(false);
const msgError = ref<string>("");
const fileProfile = ref<File>();
const imageSrc = ref<string | ArrayBuffer | null | any>();
const isLoading = ref<boolean>(false);

function getCoverProfile(path: string) {
  if (path) {
    return `${environment.urlApiImg}/${path}`;
  } else {
    return `${environment.urlBaseApp}/profile.jpeg`;
  }
}

imageSrc.value = getCoverProfile(userStore.user?.image ?? "");

const onSubmit = async () => {
  if (userStore.user) {
    const formProfile: User = {
      name: userStore.user?.name,
      gender: userStore.user?.gender,
      dateOfBirth: userStore.user?.dateOfBirth,
      profileImage: fileProfile.value!,
    };

    await userStore.updateProfile(formProfile);
    if (userStore.error) {
      const errMsg = transformError(userStore.error.message);
      msgError.value = errMsg;
      showSweetAlert(errMsg, "error", 4000, true, "top-end");
      isLoading.value = false;
    } else {
      showSweetAlert(
        "สำเร็จ! อัฟโหลดภาพโปรไฟล์เรียบร้อยแล้ว",
        "success",
        4000,
        true,
        "top-end",
      );
      resetForm();
      isLoading.value = false;
    }
  }
};

function handleFileInputChange(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;

  if (fileList && fileList[0]) {
    const file = fileList[0];
    fileProfile.value = file;
    const reader = new FileReader();
    reader.onload = () => (imageSrc.value = reader.result);
    if (file) {
      reader.readAsDataURL(file);
    }
    onSubmit();
  }
}

function handUpload() {
  const clickImg = document.getElementById("setImage") as HTMLElement;
  clickImg.click();
}

function resetForm() {
  userStore.get();
  dateBirth.value = `${moment(userStore.user?.dateOfBirth).date()} ${moment(userStore.user?.dateOfBirth).format("MMMM")} ${moment(userStore.user?.dateOfBirth).year()}`;
}

definePageMeta({
  layout: "profile",
  middleware: "auth",
});

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});

useHead({
  title: "Profile",
});

function submitData() {
  if (userStore.error) {
    const errMsg = transformError(userStore.error.message);
    msgError.value = errMsg;
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
    isLoading.value = false;
  } else {
    showSweetAlert(
      "สำเร็จ! บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว",
      "success",
      4000,
      true,
      "top-end",
    );
    resetForm();
    isLoading.value = false;
  }
}
</script>
<template>
  <div v-if="isRenderFinish === true" class="profile-page">
    <div class="wrapper-content">
      <div class="card-item-profile">
        <h4>โปรไฟล์</h4>
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a
              class="nav-link active"
              aria-current="page"
              href="#"
              data-bs-toggle="tab"
              data-bs-target="#profile"
              >ข้อมูลส่วนตัว</a
            >
          </li>
        </ul>
        <div class="tab-content">
          <div
            id="profile"
            class="tab-pane fade show active"
            role="tabpanel"
            aria-labelledby="profile-tab"
            tabindex="0"
          >
            <div class="form-profile">
              <div class="m-t-50"></div>
              <div class="img-profile" @click="handUpload()">
                <img :src="imageSrc" alt="Image" class="cover-profile" />
                <div class="mask-cover"></div>
                <span class="material-symbols-outlined"> edit </span>
                <input
                  id="setImage"
                  type="file"
                  accept="image/*"
                  hidden
                  @change="handleFileInputChange($event)"
                />
              </div>
              <div class="form-body">
                <p class="m-t-15 h7">{{ userStore.user?.name }}</p>
                <p class="title-member font-body-2">
                  ประเภทสมาชิก :
                  <span class="text-position font-subtitle-3">Member</span>
                </p>
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#profile-modal"
                >
                  <span class="material-symbols-outlined icon-edit">
                    border_color
                  </span>
                  Edit profile
                </button>
                <ProfileModal :submit-data="submitData"></ProfileModal>
              </div>
              <div class="form-footer">
                <p class="font-body-2">Gender : {{ userStore.user?.gender }}</p>
                <p class="font-body-2">
                  Date of birth :
                  {{
                    moment(userStore.user?.dateOfBirth).format("DD MMMM yyyy")
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="assets/scss/pages/profile/profile.scss" scoped></style>
