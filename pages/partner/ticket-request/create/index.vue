<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { useTicketRequestStore } from "~/store/useTicketRequestPageStore";
import { useUserStore } from "~/store/useUserStore";

definePageMeta({
  layout: "custom",
});
export interface ItemImage {
  name: string;
  size: string;
  type: string;
}
const userStore = useUserStore();
const ticketPartnerStore = useTicketRequestStore();

await useAsyncData(() => userStore.get());

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Ticket Request", link: "/partner/ticket-request" },
  { menu: "Add Request", link: "/partner/ticket-request/create" },
];
const isLoading = ref<boolean>(false);
const msgError = ref<string>("");
const files = ref<File[]>([]);
const dataFile = ref<ItemImage[]>([]);
const isFile = ref(false);
const isFileVideo = ref(true);
const isCheckFile = ref(true);
const fileVideo = ref<File | string>();
const dataFileVideo = ref();
const description = ref();
const isDescription = ref(false);

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    title: yup.string().required("กรุณาระบุชื่อหัวข้อ"),
  }),
});

const [title] = defineField("title");

const onSubmit = handleSubmit(async (value) => {
  isLoading.value = true;
  isFile.value = false;
  isDescription.value = false;

  if (!description.value) {
    isDescription.value = true;
    isLoading.value = false;
  }

  if ((files.value && files.value?.length <= 0) || !files.value) {
    isFile.value = true;
    isLoading.value = false;
    return;
  }
  if (files.value) {
    const formData = new FormData();
    formData.append("title", value.title);
    formData.append("description", description.value);

    for (const value of files.value) {
      formData.append("file", value);
    }
    if (fileVideo.value) {
      formData.append("file", fileVideo.value);
    }

    await ticketPartnerStore.createTicket(formData);
    if (ticketPartnerStore.error) {
      const errMsg = ticketPartnerStore.error.message;
      msgError.value = errMsg;
      showSweetAlert(errMsg, "error", 4000, true, "top-end");
      isLoading.value = false;
    } else {
      showSweetAlert(
        "สำเร็จ! บันทึกข้อมูลรายการเรียบร้อยแล้ว",
        "success",
        4000,
        true,
        "top-end",
      );
      navigateTo("/partner/ticket-request");
      isLoading.value = false;
    }
  }
});

function handUpload() {
  const clickImg = document.getElementById("setImage") as HTMLElement;
  clickImg.click();
}

function handUploadVideo() {
  const clickImg = document.getElementById("setVideo") as HTMLElement;
  clickImg.click();
}

function delImage(index: number) {
  dataFile.value.splice(index, 1);
  delFile(index);
  if (dataFile.value.length < 5) {
    isCheckFile.value = true;
  }
}

function delVideo() {
  dataFileVideo.value = "";
  fileVideo.value = "";
  isFileVideo.value = true;
}

function handleFileInputChange(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  if (fileList && fileList[0]) {
    const file = fileList[0];
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB <= 1) {
      isCheckFile.value = true;
      isFile.value = false;
      saveFile(file, fileList);
    } else {
      showSweetAlert(
        "ไฟล์ต้องที่มีขนาดสูงสุดไม่เกิน 1 MB",
        "error",
        4000,
        true,
        "top-end",
      );
    }
  }
}

function handleFileInputChangeVideo(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  if (fileList && fileList[0]) {
    const file = fileList[0];
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB <= 100) {
      isFileVideo.value = false;
      fileVideo.value = file;
      dataFileVideo.value = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type,
      };
    } else {
      showSweetAlert(
        "ไฟล์ต้องที่มีขนาดสูงสุดไม่เกิน 100 MB",
        "error",
        4000,
        true,
        "top-end",
      );
    }
  }
}

function saveFile(file: File, fileList: FileList) {
  dataFile.value.push({
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2),
    type: file.type,
  });

  if (files.value) {
    for (const value of fileList) {
      files.value.push(value);
    }
  } else {
    const data = [];
    for (const value of fileList) {
      data.push(value);
    }
    files.value = data;
  }
  if (dataFile.value.length >= 4) {
    isCheckFile.value = false;
  }
}
function delFile(index: number) {
  if (files.value) {
    const fileList = [];
    for (let i = 0; i < files.value.length; i++) {
      if (i !== index) {
        fileList.push(files.value[i]);
      }
    }
    files.value = fileList;
  }
}
</script>
<template>
  <div class="create-ticket-request-page">
    <div class="wrapper-content">
      <h4>Add Request</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>
      <form class="" @submit="onSubmit">
        <div class="section-ticket-request">
          <p>ส่งรายการคำขอ</p>
          <hr />
          <div class="mb-3 row">
            <label for="title" class="col-lg-2 col-form-label"
              >ชื่อหัวข้อ <span class="text-danger">*</span></label
            >
            <div class="col-lg-10">
              <input
                id="title"
                v-model="title"
                type="text"
                class="form-control-rounded-normal"
                placeholder="กรุณาใส่หัวข้อ"
                autocomplete="off"
                :class="errors.title ? 'is-invalid' : ''"
              />
              <p class="invalid-feedback">{{ errors.title }}</p>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="description" class="col-lg-2 col-form-label"
              >รายละเอียด <span class="text-danger">*</span></label
            >
            <div class="col-lg-10">
              <rich-editor
                :value="description"
                :edit="description"
                @input="(event) => (description = event)"
              />
              <p v-if="isDescription" class="ck-error">กรุณาระบุรายละเอียด</p>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="description" class="col-lg-2 col-form-label"
              >อัปโหลดไฟล์ <span class="text-danger">*</span></label
            >
            <div class="col-lg-10">
              <div v-if="dataFile">
                <div
                  v-for="(val, index) in dataFile"
                  :key="index"
                  class="card-image"
                >
                  <div class="image-item">
                    <i class="las la-file-alt cover-profile"></i>
                    <div class="detail-item">
                      <p class="title font-body-2">{{ val.name }}</p>
                      <p class="font-body-3 text-silver">
                        File size : {{ val.size }} MB
                      </p>
                    </div>
                  </div>
                  <i class="las la-trash icon-del" @click="delImage(index)"></i>
                </div>
              </div>
              <div
                v-if="isCheckFile"
                class="form-control-rounded-normal card-no-image"
                :class="isFile ? 'is-invalid' : ''"
                @click="handUpload()"
              >
                <i class="las la-file-upload icon-up"></i>
                <p class="font-body-2">click to upload</p>
                <p class="font-body-3 text-silver">
                  Only JPEG PNG and PDF files with max size of 1 MB
                </p>
              </div>
              <input
                id="setImage"
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                hidden
                @change="handleFileInputChange($event)"
              />
              <input
                id="setVideo"
                type="file"
                accept="video/mp4"
                hidden
                @change="handleFileInputChangeVideo($event)"
              />
              <p v-if="isFile" class="invalid-feedback">กรุณาเลือกไฟล์</p>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="description" class="col-lg-2 col-form-label"
              >อัปโหลดไฟล์วิดีโอ</label
            >
            <div class="col-lg-10">
              <div v-if="dataFileVideo">
                <div class="card-image">
                  <div class="image-item">
                    <i class="las la-file-alt cover-profile"></i>
                    <div class="detail-item">
                      <p class="title font-body-2">{{ dataFileVideo.name }}</p>
                      <p class="font-body-3 text-silver">
                        File size : {{ dataFileVideo.size }} MB
                      </p>
                    </div>
                  </div>
                  <i class="las la-trash icon-del" @click="delVideo()"></i>
                </div>
              </div>
              <div
                v-if="isFileVideo"
                class="form-control-rounded-normal card-no-image"
                @click="handUploadVideo()"
              >
                <i class="las la-file-upload icon-up"></i>
                <p class="font-body-2">click to upload</p>
                <p class="font-body-3 text-silver">
                  Only MP4 files with max size of 100 MB
                </p>
              </div>
              <input
                id="setImage"
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                hidden
                @change="handleFileInputChange($event)"
              />
              <input
                id="setVideo"
                type="file"
                accept="video/mp4"
                hidden
                @change="handleFileInputChangeVideo($event)"
              />
              <p v-if="isFile" class="invalid-feedback">กรุณาเลือกไฟล์</p>
            </div>
          </div>
          <div class="action">
            <NuxtLink to="/partner/ticket-request">
              <button class="btn btn-cancel" type="button">ยกเลิก</button>
            </NuxtLink>
            <button class="btn btn-outline-primary" :disabled="isLoading">
              {{ isLoading ? "กำลังบันทึก..." : "ยืนยัน" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/ticket-request/create/create-ticket-request.scss"
  lang="scss"
  scoped
></style>
