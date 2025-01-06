<script setup lang="ts">
import * as yup from "yup";
import { useForm } from "vee-validate";
import { ref } from "vue";
import moment from "moment/moment";
import { generateRandomString } from "~/utils/randomSlug";
import { useVideoPartnerStore } from "~/store/useVideoPartnerStore";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { useOptionPartnerStore } from "~/store/useOptionPartnerStore";
import { useUserStore } from "~/store/useUserStore";

definePageMeta({
  layout: "custom",
});

// Store
const userStore = useUserStore();
const videoPartnerStore = useVideoPartnerStore();
const optionPartnerStore = useOptionPartnerStore();

// SSR CALL API
await useAsyncData(() => optionPartnerStore.getStyles());
await useAsyncData(() => optionPartnerStore.getArtists());
await useAsyncData(() => userStore.get());

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Music", link: "/partner/music" },
  { menu: "Create Music", link: "/partner/music/create" },
];
const isLoading = ref<boolean>(false);
const msgError = ref<string>("");
const artistListId = ref<string>("");
const genreListId = ref<string>("");

const imageSrc = ref<string | ArrayBuffer>();
const fileProfile = ref<File>();
const fileSize = ref<string>("");
const fileName = ref<string>("");
const isPhoto = ref(false);

const videoSrc = ref<string | ArrayBuffer>();
const fileVideo = ref<File>();
const fileSizeVideo = ref<string>("");
const fileNameVideo = ref<string>("");
const isVideo = ref(false);
const description = ref();
const lyrics = ref();
const isDescription = ref(false);
const isLyrics = ref(false);
const published = moment().format("YYYY-MM-DD");
const releaseDate = moment().subtract(5, "days").format("YYYY-MM-DD");
const expireDate = moment().add(12, "years").format("YYYY-MM-DD");
const imageCoverPreview = ref<any>("");
const fileCover = ref<File>();
const fileSizeCover = ref<string>("");
const fileNameCover = ref<string>("");

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("กรุณาระบุชื่อวิดีโอเพลง"),
    artist: yup.string().required("กรุณาระบุชื่อศิลปิน"),
    genre: yup.string().required("กรุณาระบุชื่อแนวเพลง"),
  }),
});

const [name, nameAttrs] = defineField("name");
const [artist] = defineField("artist");
const [genre] = defineField("genre");

const onSubmit = handleSubmit(async (value) => {
  isLoading.value = true;
  isPhoto.value = false;
  isVideo.value = false;
  isDescription.value = false;
  isLyrics.value = false;
  if (
    !fileName.value &&
    !fileNameVideo.value &&
    !isDescription.value &&
    !isLyrics.value
  ) {
    isPhoto.value = true;
    isVideo.value = true;
    isLyrics.value = true;
    isDescription.value = true;
    isLoading.value = false;
    return;
  }
  if (!fileName.value) {
    isPhoto.value = true;
    isLoading.value = false;
    return;
  }
  if (!fileNameVideo.value) {
    isVideo.value = true;
    isLoading.value = false;
    return;
  }
  if (!description.value) {
    isDescription.value = true;
    isLoading.value = false;
    return;
  }
  if (!lyrics.value) {
    isLyrics.value = true;
    isLoading.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("name", value.name);
  formData.append("slug", generateRandomString(10));
  formData.append("releasedAt", releaseDate);
  formData.append("publishedAt", published);
  formData.append("expiredAt", expireDate);
  formData.append("videoThumbnail", fileCover.value ?? "");
  formData.append("video", fileVideo.value ?? "");
  formData.append("artists", artistListId.value);
  formData.append("styleIds", genreListId.value);
  formData.append("lyrics", lyrics.value);
  formData.append("description", description.value);
  formData.append("status", "");

  if (fileProfile.value && fileVideo.value) {
    await videoPartnerStore.createVideo(formData);
    if (videoPartnerStore.error) {
      const errMsg = videoPartnerStore.error.message;
      msgError.value = errMsg;
      showSweetAlert(errMsg, "error", 4000, true, "top-end");
      isLoading.value = false;
    } else {
      showSweetAlert(
        "สำเร็จ! บันทึกข้อมูลวิดิโอเรียบร้อยแล้ว",
        "success",
        4000,
        true,
        "top-end",
      );
      navigateTo("/partner/music/success");
      isLoading.value = false;
    }
  }
});

function selectArtist(name: string[], id: string[]) {
  artistListId.value = id.toString();
  artist.value = name.toString();
}

function selectGenre(name: string[], id: string[]) {
  genreListId.value = id.toString();
  genre.value = name.toString();
}

const cropCoverPreview = (src: string, fileBlob: any, fileSizeMB: any) => {
  isPhoto.value = true;
  imageCoverPreview.value = src;
  fileCover.value = fileBlob;
  fileSizeCover.value = fileSizeMB;
};

function handleFileInputChange(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  if (fileList && fileList[0]) {
    const file = fileList[0];
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB <= 1) {
      fileProfile.value = file;
      fileSize.value = (file.size / (1024 * 1024)).toFixed(2);
      fileName.value = file.name;
      const reader = new FileReader();
      reader.onload = () => (imageSrc.value = reader.result ?? "");
      openPreviewImageThumbnailModal();
      if (file) {
        reader.readAsDataURL(file);
      }
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
  element.value = "";
}

const openPreviewImageThumbnailModal = () => {
  const modal = document.getElementById("previewImageThumbnailModal");
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "block";
  }
};

function handUploadVideo() {
  const clickVideo = document.getElementById("setVideo") as HTMLElement;
  clickVideo.click();
}

function delVideo() {
  videoSrc.value = "";
  fileNameVideo.value = "";
}

function handleFileInputChangeVideo(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  if (fileList && fileList[0]) {
    const file = fileList[0];
    fileVideo.value = file;
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB <= 100) {
      fileSizeVideo.value = (file.size / (1024 * 1024)).toFixed(2);
      fileNameVideo.value = file.name;
      const video = document.createElement("video");
      video.src = window.URL.createObjectURL(file);
      video.preload = "metadata";
      videoSrc.value = video.src;
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
</script>
<template>
  <div class="music-create-components">
    <div class="wrapper-content">
      <h4>Music</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>
      <PreviewImageThumbnail
        :image-thumbnail="imageSrc"
        :file-name="fileNameCover"
        :crop-preview="cropCoverPreview"
      ></PreviewImageThumbnail>

      <form class="" @submit="onSubmit">
        <div class="row rounded-normal section-card">
          <div class="card-title">
            <p class="font-subtitle-2">เพิ่มวิดีโอเพลง</p>
            <hr />
          </div>
          <div class="col-md-4 m-t-20">
            <p>ภาพปกวิดีโอเพลง <span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <div class="input-file-groups-cover">
              <div>
                <input
                  id="files-cover"
                  name="files"
                  type="file"
                  accept="image/*"
                  class="form-control-rounded-normal input-file-cover"
                  @change="handleFileInputChange($event)"
                />
                <label for="files-cover" class="upload">
                  <div v-if="isPhoto">
                    <img
                      alt="img-cover"
                      :src="imageCoverPreview.toString()"
                      class="img-cover"
                      width="200"
                      height="225"
                    />
                  </div>
                  <div v-else>
                    <img
                      alt="empty-thumbnail"
                      src="https://placehold.co/200X225/e8f7ff/7c8fac"
                      class="empty-thumbnail img-cover"
                      width="200"
                      height="225"
                    />
                  </div>
                  <p
                    class="btn btn-partner-solid-primary rounded-pill font-body-2 m-auto my-2"
                  >
                    click to upload
                  </p>
                  <p class="title-max-size font-body-4">
                    Only JPEG and PNG files with max size of 1 MB
                  </p>
                </label>
              </div>
              <p v-if="isPhoto" class="">กรุณาเลือกรูปภาพปก cover</p>
            </div>
          </div>
          <div class="col-md-4 m-t-20 title-center">
            <p>ชื่อวิดีโอเพลง <span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <input
              v-model="name"
              name="name"
              v-bind="nameAttrs"
              type="text"
              class="form-control-rounded-normal"
              autocomplete="off"
              placeholder="ชื่อวิดีโอเพลง"
              :class="errors.name ? 'is-invalid' : ''"
            />
            <p class="invalid-feedback">{{ errors.name }}</p>
          </div>
          <div class="col-md-4 m-t-20">
            <p>ชื่อศิลปิน <span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <div class="cart-artist">
              <input
                v-model="artist"
                name="artist"
                type="text"
                class="form-control-rounded-normal"
                autocomplete="off"
                placeholder="ชื่อศิลปิน"
                disabled
                :class="errors.artist ? 'is-invalid' : ''"
              />
              <p class="invalid-feedback">{{ errors.artist }}</p>
              <button
                type="button"
                class="btn btn-artist rounded-medium"
                data-bs-toggle="modal"
                data-bs-target="#artistModal"
              >
                เพิ่มศิลปิน
              </button>
            </div>
            <ArtistModal
              :select-artist="selectArtist"
              :items="optionPartnerStore.optionArtists"
            ></ArtistModal>
          </div>
          <div class="col-md-4 m-t-20">
            <p>แนวเพลง<span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <div class="cart-artist">
              <input
                v-model="genre"
                name="genre"
                type="text"
                class="form-control-rounded-normal"
                autocomplete="off"
                placeholder="ชื่อแนวเพลง"
                disabled
                :class="errors.genre ? 'is-invalid' : ''"
              />
              <p class="invalid-feedback">{{ errors.genre }}</p>
              <button
                type="button"
                class="btn btn-artist rounded-medium"
                data-bs-toggle="modal"
                data-bs-target="#genreModal"
              >
                เพิ่มแนวเพลง
              </button>
              <GenreModal
                :select-genre="selectGenre"
                :items="optionPartnerStore.optionStyles"
              ></GenreModal>
            </div>
          </div>
          <div class="col-md-4 m-t-20 title-center">
            <p>รายละเอียด<span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <rich-editor
              :value="description"
              @input="(event) => (description = event)"
            />
            <p v-if="isDescription" class="ck-error">กรุณาระบุรายละเอียด</p>
          </div>
          <div class="col-md-4 m-t-20">
            <p>เนื้อเพลง<span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <rich-editor :value="lyrics" @input="(event) => (lyrics = event)" />
            <p v-if="isLyrics" class="ck-error">กรุณาระบุเนื้อเพลง</p>
          </div>
          <div class="col-md-4 m-t-20">
            <p>อัปโหลดไฟล์วิดีโอเพลง<span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <div v-if="videoSrc" class="card-video rounded-normal">
              <div class="image-video">
                <video
                  v-if="videoSrc"
                  class="cover-video"
                  :src="videoSrc.toString()"
                  controls
                ></video>
                <div class="detail-video">
                  <p class="title font-body-2">{{ fileNameVideo }}</p>
                  <p class="font-body-3 text-silver">
                    File size : {{ fileSizeVideo }} MB
                  </p>
                </div>
              </div>
              <i class="las la-trash icon-del" @click="delVideo()"></i>
            </div>
            <div
              v-if="!videoSrc"
              class="form-control-rounded-normal card-no-image"
              :class="isVideo ? 'is-invalid' : ''"
              @click="handUploadVideo()"
            >
              <i class="las la-file-upload icon-up"></i>
              <p class="font-body-2">click to upload</p>
              <p class="font-body-3 text-silver">
                Only MP4 files with max size of 100 MB
              </p>
            </div>
            <input
              id="setVideo"
              type="file"
              accept="video/mp4"
              hidden
              @change="handleFileInputChangeVideo($event)"
            />
            <p v-if="isVideo" class="invalid-feedback">กรุณาเลือกวิดีโอ</p>
          </div>
          <div class="col-md-12 btn-card">
            <a href="/partner/music">
              <button class="btn btn-outline-third border px-4" type="button">
                ยกเลิก
              </button>
            </a>
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
  lang="scss"
  src="assets/scss/pages/partner/music/music-create.scss"
  scoped
></style>
