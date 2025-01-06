<script setup lang="ts">
import * as yup from "yup";
import { useForm } from "vee-validate";
import { ref } from "vue";
import GenreModal from "~/components/modal/genre/genreModal.vue";
import { generateRandomString } from "~/utils/randomSlug";
import { useVideoPartnerStore } from "~/store/useVideoPartnerStore";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { useOptionPartnerStore } from "~/store/useOptionPartnerStore";
import { environment } from "~/services/environments";
import type { Style } from "~/interfaces/responses/partner/video/Style";
import type { Artist } from "~/interfaces/responses/partner/video/Artist";
import { useUserStore } from "~/store/useUserStore";
import { useKaraokeStore } from "~/store/useKaraokeStore";

definePageMeta({
  layout: "custom",
});

const route = useRoute();
const queryIdParam = route.params.id.toString();

// Store
const userStore = useUserStore();
const videoPartnerStore = useVideoPartnerStore();
const optionPartnerStore = useOptionPartnerStore();
const karaokeStore = useKaraokeStore();

// SSR CALL API
await useAsyncData(() => userStore.get());
await useAsyncData(() => optionPartnerStore.getStyles());
await useAsyncData(() => optionPartnerStore.getArtists());
await useAsyncData(() => videoPartnerStore.getById(queryIdParam));

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Music", link: "/partner/music" },
  { menu: "Update Music", link: `/partner/music/edit/${queryIdParam}` },
];

const isLoading = ref<boolean>(false);
const msgError = ref<string>("");
const artistListId = ref<string>("");
const genreListId = ref<string>("");
const itemSelectArtistNames = ref<string[]>([]);
const itemSelectArtistIds = ref<string[]>([]);
const itemSelectGenreNames = ref<string[]>([]);
const itemSelectGenreIds = ref<string[]>([]);

const imageSrc = ref<string | ArrayBuffer>();
const fileProfile = ref<File>();
const fileName = ref<string>("");
const isPhoto = ref(false);

const videoSrc = ref<string | ArrayBuffer>();
const fileVideo = ref<File>();
const fileSizeVideo = ref<string>("");
const fileNameVideo = ref<string>("");
const isVideo = ref(false);
const videoPlay = ref<string>("");
const description = ref(videoPartnerStore.video?.description ?? "");
const lyrics = ref(videoPartnerStore.video?.lyrics ?? "");
const isDescription = ref(false);
const isLyrics = ref(false);

const imageSrcCover = ref<string | ArrayBuffer>();
const fileSizeCover = ref<string>("");
const fileCover = ref<File>();
const fileNameCover = ref<string>("");
const isPhotoCover = ref(false);
const isImageCover = ref(false);
const imageCoverPreview = ref<any>("");

imageCoverPreview.value =
  environment.urlApiImg + "/" + videoPartnerStore.video?.image;

fileNameCover.value = videoPartnerStore.video?.name + "Cover" ?? "";

imageSrc.value = environment.urlApiImg + "/" + videoPartnerStore.video?.image;
fileName.value = videoPartnerStore.video?.name ?? "";

karaokeStore.playVideo(`${videoPartnerStore.video?.slug}`);

if (videoPartnerStore.video?.video) {
  videoPlay.value = environment.urlNimbleVideo + videoPartnerStore.video?.video;
  fileNameVideo.value = videoPartnerStore.video?.name;
}

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("กรุณาระบุชื่อ"),
    artist: yup.string().required("กรุณาระบุชื่อศิลปิน"),
    genre: yup.string().required("กรุณาระบุชื่อแนวเพลง"),
    lyrics: yup.string().required("กรุณาระบุเนื้อเพลง"),
    description: yup.string().required("กรุณาระบุรายละเอียด"),
  }),
  initialValues: {
    id: videoPartnerStore.video?.id,
    name: videoPartnerStore.video?.name ?? "",
    description: videoPartnerStore.video?.description ?? "",
    lyrics: videoPartnerStore.video?.lyrics ?? "",
    artist: "",
    genre: "",
  },
});

const [name, nameAttrs] = defineField("name");
const [artist] = defineField("artist");
const [genre] = defineField("genre");

getArtistItem(videoPartnerStore.video?.artists);
getGenreItem(videoPartnerStore.video?.styles);

const onSubmit = handleSubmit(async (value: any) => {
  isLoading.value = true;
  isPhoto.value = false;
  isVideo.value = false;
  isDescription.value = false;
  isLyrics.value = false;
  if (!fileNameCover.value && !fileNameVideo.value) {
    isPhoto.value = true;
    isVideo.value = true;
    isLyrics.value = true;
    isDescription.value = true;
    return;
  }
  if (!fileNameCover.value) {
    isPhoto.value = true;
    return;
  }
  if (!fileNameVideo.value) {
    isVideo.value = true;
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
  formData.append("id", value.id);
  formData.append("name", value.name);
  formData.append("slug", value.slug ?? generateRandomString(10));
  formData.append("videoThumbnail", fileCover.value ?? "");
  formData.append("video", fileVideo.value ?? "");
  formData.append("artists", artistListId.value ?? "");
  formData.append("styleIds", genreListId.value);
  formData.append("lyrics", lyrics.value);
  formData.append("description", description.value);

  if (fileName.value && fileNameVideo.value) {
    await videoPartnerStore.updateVideo(formData);
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
      navigateTo("/partner/music/detail/" + value.id);
      isLoading.value = false;
    }
  }
});

function getArtistItem(val?: Artist[]) {
  const id: string[] = [];
  const name: string[] = [];
  val?.forEach((value) => {
    id.push(value.id);
    name.push(value.name);
  });
  artistListId.value = id.toString();
  artist.value = name.toString();
  itemSelectArtistNames.value = name;
  itemSelectArtistIds.value = id;
}
function getGenreItem(val?: Style[]) {
  const id: string[] = [];
  const name: string[] = [];
  val?.forEach((value) => {
    id.push(value.id);
    name.push(value.name);
  });
  genre.value = name.toString();
  genreListId.value = id.toString();
  itemSelectGenreNames.value = name;
  itemSelectGenreIds.value = id;
}

function selectArtist(name: string[], id: string[]) {
  artistListId.value = id.toString();
  artist.value = name.toString();
}

function selectGenre(name: string[], id: string[]) {
  genreListId.value = id.toString();
  genre.value = name.toString();
}

function handleFileInputChange(event: Event): void {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  if (fileList && fileList[0]) {
    const file = fileList[0];
    fileProfile.value = file;
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB <= 1) {
      fileSizeCover.value = (file.size / (1024 * 1024)).toFixed(2);
      fileNameCover.value = file.name;
      const reader = new FileReader();
      reader.onload = () => (imageSrcCover.value = reader.result ?? "");
      openPreviewImageCoverModal();
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

const openPreviewImageCoverModal = () => {
  const modal = document.getElementById("previewImageThumbnailModal");
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "block";
  }
};

const cropCoverPreview = (src: string, fileBlob: any, fileSizeMB: any) => {
  isImageCover.value = true;
  imageCoverPreview.value = src;
  fileCover.value = fileBlob;
  fileSizeCover.value = fileSizeMB;
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
      videoPlay.value = "";
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
  <div class="music-edit-components">
    <div class="wrapper-content">
      <h4>Music</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>
      <PreviewImageThumbnail
        :image-thumbnail="imageSrcCover"
        :file-name="fileNameCover"
        :crop-preview="cropCoverPreview"
      ></PreviewImageThumbnail>
      <form class="" @submit="onSubmit">
        <div class="row rounded-normal section-card">
          <div class="card-title">
            <p class="font-subtitle-2">แก้ไขวิดีโอเพลง</p>
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
                  <div v-if="imageCoverPreview">
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
                      alt="empty-cover"
                      src="https://placehold.co/1280X460/e8f7ff/7c8fac"
                      class="img-cover"
                      width="1280"
                      height="460"
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
              <p v-if="isPhotoCover" class="text-danger">
                กรุณาเลือกรูปภาพปกอัลบั้ม
              </p>
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
                placeholder="ชื่อวิดีโอเพลง"
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
              :select-item-list-name="itemSelectArtistNames"
              :select-item-list-id="itemSelectArtistIds"
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
                :select-item-list-name="itemSelectGenreNames"
                :select-item-list-id="itemSelectGenreIds"
              ></GenreModal>
            </div>
          </div>
          <div class="col-md-4 m-t-20">
            <p>รายละเอียด<span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <rich-editor
              :value="description"
              :edit="description"
              @input="(event) => (description = event)"
            />
            <p v-if="isDescription" class="ck-error">กรุณาระบุรายละเอียด</p>
          </div>
          <div class="col-md-4 m-t-20">
            <p>เนื้อเพลง<span class="text-red">*</span></p>
          </div>
          <div class="col-md-8 m-t-20">
            <rich-editor
              :value="lyrics"
              :edit="lyrics"
              @input="(event) => (lyrics = event)"
            />
            <p v-if="isLyrics" class="ck-error">กรุณาระบุรายละเอียด</p>
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
            <div v-if="videoPlay">
              <div class="cover-show-video">
                <VideoPartner
                  :file="videoPartnerStore.video?.video"
                ></VideoPartner>
                <button
                  class="btn btn-outline-third"
                  type="button"
                  @click="handUploadVideo()"
                >
                  Upload
                </button>
                <input
                  id="setVideo"
                  type="file"
                  accept="video/mp4"
                  hidden
                  @change="handleFileInputChangeVideo($event)"
                />
              </div>
            </div>
            <div id="videoUpdate"></div>
            <div
              v-if="!videoSrc && !videoPlay"
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
              <button
                class="btn btn btn-outline-third border px-4"
                type="button"
              >
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
  src="assets/scss/pages/partner/music/music-edit.scss"
  scoped
></style>
