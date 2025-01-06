<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { useTicketRequestStore } from "~/store/useTicketRequestPageStore";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { environment } from "~/services/environments";
import { useUserStore } from "~/store/useUserStore";

export interface ItemImage {
  name: string;
  size: string;
  type: string;
}

definePageMeta({
  layout: "custom",
});

const route = useRoute();
const queryIdParam = route.params.id.toString();

// Store
const ticketPartnerStore = useTicketRequestStore();
const userStore = useUserStore();

// SSR CALL API
await useAsyncData(() => ticketPartnerStore.getById(queryIdParam));
await useAsyncData(() => userStore.get());

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Ticket Request", link: "/partner/ticket-request" },
  {
    menu: "Edit Request",
    link: `/partner/ticket-request/edit/${queryIdParam}`,
  },
];

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    title: yup.string().required("กรุณาระบุชื่อหัวข้อ"),
  }),
  initialValues: {
    title: ticketPartnerStore.ticket?.title,
  },
});

const [title] = defineField("title");

const showDataFiles = ref(ticketPartnerStore.ticket?.file || null);
const dataFile = ref<ItemImage[]>([]);
const files = ref<File[]>([]);
const isShowUpload = ref(false);
const isShowUploadVideo = ref(false);
const fileVideo = ref<File | string>();
const dataFileVideo = ref();
const msgError = ref<string>("");
const isLoading = ref<boolean>(false);
const isFile = ref(false);
const urlImage = environment.urlApiImg + "/ticket/";
const description = ref(ticketPartnerStore.ticket?.description ?? "");
const isDescription = ref(false);

const onSubmit = handleSubmit(async (value: any) => {
  isFile.value = false;
  isLoading.value = true;
  isDescription.value = false;
  if (!description.value) {
    isDescription.value = true;
    isLoading.value = false;
    return;
  }
  if (!showDataFiles.value && files.value.length === 0) {
    isFile.value = true;
    isLoading.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("id", ticketPartnerStore.ticket!.id);
  formData.append("title", value.title);
  formData.append("description", description.value);

  for (const value of files.value) {
    formData.append("file", value);
  }
  if (fileVideo.value) {
    formData.append("file", fileVideo.value);
  }

  await ticketPartnerStore.updateTicket(formData);
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
    navigateTo(
      "/partner/ticket-request/detail/" + ticketPartnerStore.ticket?.id,
    );
    isLoading.value = false;
  }
});

const delAll = () => {
  showDataFiles.value = null;
  isShowUpload.value = true;
  isShowUploadVideo.value = true;
};

const typeFile = (val: string) => {
  const split = val.split(".");
  return split[1].toUpperCase();
};

function handUpload() {
  const clickImg = document.getElementById("setImage") as HTMLElement;
  clickImg.click();
}

function handleFileInputChange(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  if (fileList && fileList[0]) {
    const file = fileList[0];
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB <= 1) {
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
  if (dataFile.value.length > 3) {
    isShowUpload.value = false;
  }
}

function delFile(index: number) {
  dataFile.value.splice(index, 1);
  if (files.value) {
    const fileList = [];
    for (let i = 0; i < files.value.length; i++) {
      if (i !== index) {
        fileList.push(files.value[i]);
      }
    }
    files.value = fileList;
  }
  if (dataFile.value.length < 4) {
    isShowUpload.value = true;
  }
}

function handUploadVideo() {
  const clickImg = document.getElementById("setVideo") as HTMLElement;
  clickImg.click();
}

function handleFileInputChangeVideo(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  if (fileList && fileList[0]) {
    const file = fileList[0];
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB <= 100) {
      isShowUploadVideo.value = false;
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

function delVideo() {
  dataFileVideo.value = "";
  fileVideo.value = "";
}

async function deleteMember(id: string) {
  await ticketPartnerStore.deleteTicket(id);
  if (ticketPartnerStore.error) {
    const errMsg = ticketPartnerStore.error.message;
    msgError.value = errMsg;
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
    isLoading.value = false;
  } else {
    showSweetAlert(
      "สำเร็จ! ลบรายการเรียบร้อยแล้ว",
      "success",
      4000,
      true,
      "top-end",
    );
    navigateTo("/partner/ticket-request");
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="edit-ticket-request-page">
    <div class="wrapper-content">
      <h4>Edit Request</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-ticket-request">
        <div class="title-action">
          <p>แก้ไขรายการคำขอ</p>
          <Button
            data-bs-toggle="modal"
            class="btn btn-delete-member"
            data-bs-target="#deleteModal"
            ><i class="las la-trash-alt icon-trash"></i> ลบคำขอ</Button
          >
        </div>
        <hr />
        <form class="" @submit="onSubmit">
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
              <div
                v-for="(val, index) in showDataFiles"
                :key="index"
                class="card-image"
              >
                <div class="image-item">
                  <i class="las la-file-alt cover-icon"></i>
                  <div class="line"></div>
                  <div class="detail-item">
                    <p class="font-body-3 text-silver">
                      Type File : {{ typeFile(val.file) }}
                    </p>
                  </div>
                </div>
                <a :href="urlImage + val.file" target="_blank">
                  <i class="las la-eye icon-del"></i>
                </a>
              </div>
              <div
                v-for="(val, index) in dataFile"
                :key="index"
                class="card-image"
              >
                <div class="image-item">
                  <i class="las la-file-alt cover-icon"></i>
                  <div class="line"></div>
                  <div class="detail-item">
                    <p class="title font-body-2">{{ val.name }}</p>
                    <p class="font-body-3 text-silver">
                      File size : {{ val.size }} MB
                    </p>
                  </div>
                </div>
                <i class="las la-trash icon-del" @click="delFile(index)"></i>
              </div>
              <button
                v-if="showDataFiles"
                class="btn btn-outline-third del-button"
                type="button"
                @click="delAll"
              >
                Delete All
              </button>
              <div
                v-if="isShowUpload"
                class="form-control-rounded-normal card-no-image"
                :class="isFile ? 'is-invalid' : ''"
                @click="handUpload()"
              >
                <i class="las la-file-upload icon-up"></i>
                <p class="font-body-2">click to upload</p>
                <p class="font-body-3 text-silver">
                  Only JPEG and PNG files with max size of 1 MB
                </p>
                <input
                  id="setImage"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  hidden
                  @change="handleFileInputChange($event)"
                />
              </div>
              <p v-if="isFile" class="invalid-feedback">กรุณาเลือกไฟล์</p>
            </div>
          </div>
          <div v-if="isShowUpload" class="mb-3 row">
            <label for="description" class="col-lg-2 col-form-label"
              >อัปโหลดไฟล์วิดีโอ</label
            >
            <div class="col-lg-10">
              <div v-if="dataFileVideo" class="card-image">
                <div class="image-item">
                  <i class="las la-file-alt cover-icon"></i>
                  <div class="line"></div>
                  <div class="detail-item">
                    <p class="title font-body-2">{{ dataFileVideo.name }}</p>
                    <p class="font-body-3 text-silver">
                      File size : {{ dataFileVideo.size }} MB
                    </p>
                  </div>
                </div>
                <i class="las la-trash icon-del" @click="delVideo"></i>
              </div>
              <div
                v-if="!dataFileVideo"
                class="form-control-rounded-normal card-no-image"
                @click="handUploadVideo()"
              >
                <i class="las la-file-upload icon-up"></i>
                <p class="font-body-2">click to upload</p>
                <p class="font-body-3 text-silver">
                  Only MP4 files with max size of 100 MB
                </p>
                <input
                  id="setVideo"
                  type="file"
                  accept="video/mp4"
                  hidden
                  @change="handleFileInputChangeVideo($event)"
                />
              </div>
            </div>
          </div>
          <div class="action">
            <NuxtLink
              :to="
                '/partner/ticket-request/detail/' +
                ticketPartnerStore.ticket?.id
              "
              class=""
              >ยกเลิก</NuxtLink
            >
            <button class="btn btn-outline-primary" :disabled="isLoading">
              {{ isLoading ? "กำลังบันทึก..." : "ยืนยัน" }}
            </button>
          </div>
        </form>
        <ConfirmModal
          :confirm-modal="deleteMember"
          :id-member="queryIdParam"
          :id-modal="'deleteModal'"
          :title="'ยืนยันการลบ'"
          :message="`ยืนยันการลบคำขอ ‘${title}’ เมื่อยืนยันแล้วจะไม่สามารถยกเลิกได้`"
        >
        </ConfirmModal>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/ticket-request/edit/edit-ticket-request.scss"
  lang="scss"
  scoped
></style>
