<script lang="ts" setup>
import { ref } from "vue";
import * as yup from "yup";
import moment from "moment";
import { debounce } from "@antfu/utils";
import { generateRandomString } from "~/utils/randomSlug";
import { useUserStore } from "~/store/useUserStore";
import { useVideoPartnerStore } from "~/store/useVideoPartnerStore";
import { environment } from "~/services/environments";
import { showSweetAlert } from "~/utils/showSweetAlert";
import { usePlaylistPartnerPageStore } from "~/store/partner/usePlaylistPageStore";
import { useOptionPartnerStore } from "~/store/useOptionPartnerStore";

definePageMeta({
  layout: "custom",
});

const route = useRoute();
const queryIdParam = route.params.id.toString();
const optionPartnerStore = useOptionPartnerStore();

const userStore = useUserStore();
const videoStore = useVideoPartnerStore();
const playlistPartnerStore = usePlaylistPartnerPageStore();

// SSR CALL API
await useAsyncData(() => videoStore.get());
await useAsyncData(() => optionPartnerStore.getStyles());
await useAsyncData(() => playlistPartnerStore.getById(queryIdParam));

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Playlist", link: "/partner/playlist" },
  { menu: "Edit Playlist", link: `/partner/playlist/edit/${queryIdParam}` },
];

const page = ref<number>(0);
const genreListId = ref<string>("");
const videoListId = ref<string>("");
const videoListValue = ref(playlistPartnerStore.playlist?.videos);
const initialVideoListValue = ref([]);
const step = ref<number>(1);
const imageSrcThumbnail = ref<string | ArrayBuffer>();
const imageSrcCover = ref<string | ArrayBuffer>();
const fileThumbnail = ref<File>();
const fileSizeThumbnail = ref<string>("");
const fileNameThumbnail = ref<string>("");
const fileCover = ref<File>();
const fileSizeCover = ref<string>("");
const fileNameCover = ref<string>("");
const published = moment().format("YYYY-MM-DD");
const releaseDate = moment().subtract(5, "days").format("YYYY-MM-DD");
const expireDate = moment().add(12, "years").format("YYYY-MM-DD");
const urlImage = environment.urlApiImg + "/";
const isPhotoThumbnail = ref(false);
const isPhotoCover = ref(false);
const msgError = ref<string>("");
const isLoading = ref<boolean>(false);
const isNext = ref<number>(1);
const description = ref(playlistPartnerStore.playlist?.description ?? "");
const isDescription = ref(false);
const isImageThumbnail = ref(false);
const isImageCover = ref(false);
const imageThumbnailPreview = ref<any>("");
const imageCoverPreview = ref<any>("");

const link = environment.urlBaseApp + "/partner/music/detail/";

imageThumbnailPreview.value =
  environment.urlApiImg + "/" + playlistPartnerStore.playlist?.image;
imageCoverPreview.value =
  environment.urlApiImg + "/" + playlistPartnerStore.playlist?.coverPage;

fileNameThumbnail.value =
  playlistPartnerStore.playlist?.name + "Thumbnail" ?? "";
fileNameCover.value = playlistPartnerStore.playlist?.name + "Cover" ?? "";

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("กรุณาระบุชื่อเพลย์ลิสต์"),
    slug: yup.string(""),
    status: yup.boolean(),
  }),
  initialValues: {
    id: playlistPartnerStore.playlist?.id,
    name: playlistPartnerStore.playlist?.name ?? "",
    slug: playlistPartnerStore.playlist?.slug ?? "",
    status: playlistPartnerStore.playlist?.isActive,
    genre:
      playlistPartnerStore.playlist?.style
        .map((style: any) => style.name)
        .join(",") ?? "",
  },
});
const [name, nameAttrs] = defineField("name");
const [slug, slugAttrs] = defineField("slug");
const [status, statusAttrs] = defineField("status");
const [genre] = defineField("genre");
const [video] = defineField("video");

genreListId.value = playlistPartnerStore.playlist.style?.map((item) => item.id);
videoListId.value = playlistPartnerStore.playlist?.videos.map(
  (item) => item.id,
);

const selectGenre = (name: string[], id: string[]) => {
  genreListId.value = id.toString();
  genre.value = name.toString();
};

const selectVideo = (name: string[], id: string[], value: any[]) => {
  videoListId.value = id.toString();
  video.value = name.toString();
  videoListValue.value = value;
  initialVideoListValue.value = value;
};

const handleFileCoverInputChange = (event: Event): void => {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;

  if (fileList && fileList[0]) {
    const file = fileList[0];
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
};

const handleFileThumbnailInputChange = (event: Event): void => {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;

  if (fileList && fileList[0]) {
    const file = fileList[0];
    const fileThumbnailSizeMB: number = file.size / (1024 * 1024);
    if (fileThumbnailSizeMB <= 1) {
      fileSizeThumbnail.value = (file.size / (1024 * 1024)).toFixed(2);
      fileNameThumbnail.value = file.name;
      const reader = new FileReader();
      reader.onload = () => (imageSrcThumbnail.value = reader.result ?? "");
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
};

const openPreviewImageThumbnailModal = () => {
  const modal = document.getElementById("previewImageThumbnailModal");
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "block";
  }
};

const openPreviewImageCoverModal = () => {
  const modal = document.getElementById("previewImageCoverModal");
  if (modal) {
    modal.classList.add("show");
    modal.style.display = "block";
  }
};

const cropThumbnailPreview = (src: string, fileBlob: any, fileSizeMB: any) => {
  isImageThumbnail.value = true;
  imageThumbnailPreview.value = src;
  fileThumbnail.value = fileBlob;
  fileSizeThumbnail.value = fileSizeMB;

  if (src) {
    isPhotoThumbnail.value = false;
  }
};

const cropCoverPreview = (src: string, fileBlob: any, fileSizeMB: any) => {
  isImageCover.value = true;
  imageCoverPreview.value = src;
  fileCover.value = fileBlob;
  fileSizeCover.value = fileSizeMB;

  if (src) {
    isPhotoCover.value = false;
  }
};

const onSubmit = handleSubmit(async (value) => {
  isPhotoThumbnail.value = false;
  isPhotoCover.value = false;
  isDescription.value = false;

  if (!fileNameThumbnail.value || !fileNameCover.value || !description.value) {
    isPhotoThumbnail.value = true;
    isPhotoCover.value = true;
    isDescription.value = true;
    return;
  }

  const valueSlug = value.slug ? value.slug : generateRandomString(10);

  const formData = new FormData();
  formData.append("id", value.id);
  formData.append("name", value.name);
  formData.append("slug", valueSlug);
  formData.append("description", description.value);
  formData.append("playlistThumbnail", fileThumbnail.value ?? "");
  formData.append("coverPage", fileCover.value ?? "");
  formData.append("releasedAt", releaseDate);
  formData.append("publishedAt", published);
  formData.append("expiredAt", expireDate);
  formData.append("videoIds", videoListId.value);
  formData.append("styleIds", genreListId.value);
  formData.append("isActive", value.status);

  if (value) {
    step.value = 2;
  }

  if (
    value &&
    fileNameCover.value &&
    fileNameThumbnail.value &&
    videoListId.value &&
    isNext.value === 2
  ) {
    await playlistPartnerStore.updatePlaylist(formData);
    if (playlistPartnerStore.error) {
      const errMsg = playlistPartnerStore.error.message;
      msgError.value = errMsg;
      showSweetAlert(errMsg, "error", 4000, true, "top-end");
      isLoading.value = false;
    } else {
      showSweetAlert(
        "สำเร็จ! บันทึกข้อมูลเพลย์ลิสต์เรียบร้อยแล้ว",
        "success",
        4000,
        true,
        "top-end",
      );
      navigateTo("/partner/playlist/detail/" + value.id);

      isLoading.value = false;
    }
  }
});

const tableName = ref([
  { columnDef: "no", name: "No", isSort: false, sortDirection: "desc" },
  {
    columnDef: "name",
    name: "วิดีโอเพลง",
    sortDirection: "desc",
  },
  {
    columnDef: "updatedAt",
    name: "วันที่เพิ่ม",
  },
  {
    columnDef: "action",
    name: "Action",
  },
]);

const applyFilter = debounce(300, (value: string) => {
  page.value = 0;
  if (value) {
    videoListValue.value = videoListValue.value.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
  } else {
    videoListValue.value = initialVideoListValue.value;
  }
});

const deleteMusic = (index: number) => {
  videoListValue.value.splice(index, 1);
  videoListId.value = videoListValue.value?.map((item) => item.id);
};

const backToStepOne = (index: number) => {
  step.value = index;
  isNext.value = 1;
};
const nextTo = (index: number) => {
  isNext.value = index;
};

const goToListPlaylist = () => {
  navigateTo("/partner/playlist");
};

const deletePlaylist = async (index: string) => {
  isLoading.value = true;
  await playlistPartnerStore.deletePlaylistById(index);
  if (playlistPartnerStore.error) {
    const errMsg = playlistPartnerStore.error.message;
    msgError.value = errMsg;
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
    isLoading.value = false;
  } else {
    showSweetAlert(
      "สำเร็จ! ลบข้อมูลเพลย์ลิสต์เรียบร้อยแล้ว",
      "success",
      4000,
      true,
      "top-end",
    );
    navigateTo("/partner/playlist");
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="edit-playlist-partner-page">
    <div class="wrapper-content">
      <h4>Edit Playlist</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-form">
        <PreviewImageThumbnail
          :image-thumbnail="imageSrcThumbnail"
          :file-name="fileNameThumbnail"
          :crop-preview="cropThumbnailPreview"
        ></PreviewImageThumbnail>
        <PreviewImageCover
          :image-cover="imageSrcCover"
          :file-name="fileNameCover"
          :crop-preview="cropCoverPreview"
        ></PreviewImageCover>
        <form class="" @submit="onSubmit">
          <div class="d-flex align-items-center justify-content-between">
            <p class="title-playlist">แก้ไขเพลย์ลิสต์</p>
            <div
              class="d-flex align-items-center delete-playlist d-none"
              @click="deletePlaylist(queryIdParam)"
            >
              <span class="material-symbols-outlined me-1 icon-trash">
                delete
              </span>
              <p class="title-remove">ลบเพลย์ลิสต์</p>
            </div>
          </div>
          <hr />
          <div class="row">
            <!-- Step Desktop -->
            <div class="step-desktop col-md-4">
              <div class="d-flex align-items-center">
                <div
                  :class="step === 1 ? '' : 'checked-success'"
                  class="border rounded-circle d-flex align-items-center justify-content-center circle-icon-first"
                >
                  <span v-if="step === 1" class="material-icons icon-feed">
                    feed
                  </span>
                  <span
                    v-if="step === 2"
                    class="material-symbols-outlined icon-check"
                  >
                    check
                  </span>
                </div>
                <div>
                  <p class="title-step font-body-4">Step 1</p>
                  <p class="font-body-2">Add Information</p>
                </div>
              </div>
              <div class="step-line"></div>
              <div class="d-flex align-items-center">
                <div
                  class="border rounded-circle d-flex align-items-center justify-content-center circle-icon-second"
                >
                  <span class="material-symbols-outlined icon-note">
                    music_note
                  </span>
                </div>
                <div>
                  <p class="title-step font-body-4">Step 2</p>
                  <p class="font-body-2">Add Music Video</p>
                </div>
              </div>
            </div>

            <!-- Step Mobile -->
            <div class="step-mobile col-md-4">
              <div class="d-flex align-items-center">
                <div
                  class="progress-circle"
                  :class="step === 1 ? '' : 'p-success'"
                >
                  <span class="title-progress font-body-3">1 of 2</span>
                </div>
                <div>
                  <p class="title-step font-body-4">Step 1</p>
                  <p class="font-body-2">Add Information</p>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="table-desktop col-md-8">
              <div v-if="step === 1">
                <div class="mb-3">
                  <label for="files" class="form-label title-cover-playlist"
                    >รูปภาพเพลย์ลิสต์ <span class="text-danger">*</span></label
                  >
                  <div class="input-file-groups-thumbnail">
                    <div>
                      <input
                        id="files"
                        name="files"
                        type="file"
                        accept="image/*"
                        class="form-control-rounded-normal input-file-thumbnail"
                        @change="handleFileThumbnailInputChange($event)"
                      />
                      <label for="files" class="upload">
                        <div v-if="imageThumbnailPreview">
                          <img
                            alt="img-thumbnail"
                            :src="imageThumbnailPreview.toString()"
                            class="img-thumbnail"
                            width="200"
                            height="225"
                          />
                        </div>
                        <div v-else>
                          <img
                            alt="empty-thumbnail"
                            src="https://placehold.co/200X225/e8f7ff/7c8fac"
                            class="empty-thumbnail"
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
                    <p v-if="isPhotoThumbnail" class="text-danger">
                      กรุณาเลือกรูปภาพเพลย์ลิสต์
                    </p>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="files" class="form-label title-cover-playlist"
                    >รูปภาพปกเพลย์ลิสต์
                    <span class="text-danger">*</span></label
                  >
                  <div class="input-file-groups-cover">
                    <div>
                      <input
                        id="files-cover"
                        name="files"
                        type="file"
                        accept="image/*"
                        class="form-control-rounded-normal input-file-cover"
                        @change="handleFileCoverInputChange($event)"
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
                      กรุณาเลือกรูปภาพปกเพลย์ลิสต์
                    </p>
                  </div>
                </div>
                <div class="mb-3">
                  <label
                    for="playlist-name"
                    class="form-label title-cover-playlist"
                    >ชื่อเพลย์ลิสต์ <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="name"
                    name="name"
                    v-bind="nameAttrs"
                    type="text"
                    class="form-control-rounded-normal"
                    placeholder="ชื่อเพลย์ลิสต์"
                    autocomplete="off"
                    :class="errors.name ? 'is-invalid' : ''"
                  />
                  <p class="has-error-feedback font-body-3">
                    {{ errors.name }}
                  </p>
                </div>
                <div class="mb-3">
                  <label for="genre" class="form-label title-cover-playlist"
                    >แนวเพลง <span class="text-danger">*</span></label
                  >
                  <input
                    id="genre"
                    v-model="genre"
                    type="text"
                    class="form-control-rounded-normal"
                    placeholder="ชื่อแนวเพลง"
                    disabled
                    :class="errors.genre ? 'is-invalid' : ''"
                  />
                  <p class="invalid-feedback">{{ errors.genre }}</p>
                </div>
                <button
                  class="btn btn-partner-solid-primary rounded-pill my-3"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#genreModal"
                >
                  เพิ่มแนวเพลง
                </button>
                <GenreModal
                  :select-genre="selectGenre"
                  :items="optionPartnerStore.optionStyles"
                  :genre="genre"
                ></GenreModal>
                <div class="mb-3">
                  <label for="slug" class="form-label title-cover-playlist"
                    >Slug
                  </label>
                  <input
                    v-model="slug"
                    name="slug"
                    v-bind="slugAttrs"
                    type="text"
                    class="form-control-rounded-normal"
                    placeholder="Slug"
                    autocomplete="off"
                  />
                </div>

                <div class="mb-3">
                  <label
                    for="description"
                    class="form-label title-cover-playlist"
                    >รายละเอียด <span class="text-danger">*</span></label
                  >
                  <rich-editor
                    :value="description"
                    :edit="description"
                    @input="(event) => (description = event)"
                  />
                  <p v-if="isDescription" class="ck-error">
                    กรุณาระบุรายละเอียด
                  </p>
                </div>
                <div class="mb-3">
                  <label
                    for="playlist-name"
                    class="form-label title-cover-playlist"
                    >สถานะเพลย์ลิสต์
                  </label>
                  <div>
                    <label for="status" class="switch">
                      <input
                        id="status"
                        v-model="status"
                        type="checkbox"
                        name="slug"
                        v-bind="statusAttrs"
                      />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div v-if="step === 2" class="step-2">
                <div class="d-flex justify-content-between flex-button">
                  <div class="input-group-partner">
                    <input
                      class="form-control form-control-partner rounded-normal"
                      type="text"
                      placeholder="ค้นหาเพลย์ลิสต์"
                      @keyup="
                        applyFilter(($event.target as HTMLInputElement).value)
                      "
                    />
                    <span class="input-group-text-partner">
                      <span class="material-symbols-outlined"> search </span>
                    </span>
                  </div>
                  <button
                    class="btn btn-partner-solid-primary font-body-3"
                    data-bs-toggle="modal"
                    data-bs-target="#videoModal"
                    @click.prevent
                  >
                    <i class="las la-plus-circle"></i>
                    เพิ่มเพลงลงเพลย์ลิสต์
                  </button>
                </div>
                <VideoPlaylistModal
                  :select-video="selectVideo"
                  :items="videoStore.videoList?.videos"
                  :pagination="videoStore.videoList?.pagination"
                  :video-list="videoListValue"
                >
                </VideoPlaylistModal>
                <div class="section-table">
                  <div class="card-table">
                    <table class="data-table">
                      <thead class="mb-2">
                        <tr>
                          <th
                            v-for="(val, index) in tableName"
                            :key="index"
                            :class="val.className"
                          >
                            {{ val.name }}
                          </th>
                        </tr>
                      </thead>
                      <tbody v-if="videoListValue.length > 0">
                        <tr v-for="(val, index) in videoListValue" :key="index">
                          <td class="d-flex ms-2">
                            {{ index + 1 }}
                          </td>
                          <td>
                            <div class="card-image">
                              <img
                                v-if="val.image"
                                class="show-image rounded"
                                :src="urlImage + val.image"
                                alt="cover-music"
                              />
                              <div>
                                <a
                                  class="text-link"
                                  :href="link + val.id"
                                  target="_blank"
                                >
                                  <p class="title-music">
                                    {{ val.name }}
                                  </p>
                                </a>
                                <p class="font-body-3 title-artist-mobile">
                                  {{ val.artist?.name }}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div class="title-update">
                              <span>{{
                                moment(val.updatedAt).format("DD/MM/yyyy")
                              }}</span>
                            </div>
                          </td>
                          <td class="d-flex ms-2">
                            <span
                              class="material-icons-outlined icon-view me-2 d-none"
                            >
                              visibility
                            </span>
                            <span
                              class="material-symbols-outlined icon-trash"
                              @click="deleteMusic(index)"
                            >
                              delete
                            </span>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-else>
                        <td colspan="8" class="text-center">
                          <img
                            src="~assets/images/backgrounds/empty.png"
                            alt="empty"
                            width="170"
                            class="mt-5"
                          />
                          <p class="font-subtitle-2 mt-2">ไม่พบข้อมูล</p>
                          <p class="mb-5">
                            คุณยังไม่ได้เพิ่มเพลงลงในเพลย์ลิสต์นี้
                          </p>
                        </td>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-if="videoListValue.length < 1" class="empty-mobile">
                  <div colspan="8" class="text-center">
                    <img
                      src="~assets/images/backgrounds/empty.png"
                      alt="empty"
                      width="170"
                      class="mt-5"
                    />
                    <p class="font-subtitle-2 mt-2">ไม่พบข้อมูล</p>
                    <p class="mb-5">คุณยังไม่ได้เพิ่มเพลงลงในเพลย์ลิสต์นี้</p>
                  </div>
                </div>
                <div class="section-table-mobile">
                  <div
                    v-for="(val, index) in videoListValue"
                    :key="index"
                    class="bg-card-mobile d-flex align-items-center justify-content-between mt-3"
                  >
                    <div class="d-flex align-items-center">
                      <img
                        v-if="val.image"
                        class="show-image-mobile rounded me-3"
                        :src="urlImage + val.image"
                        alt="cover-music"
                      />
                      <div>
                        <a :href="link + val.id" target="_blank">
                          <p class="font-body-2 text-link-mobile">
                            {{ val.name }}
                          </p>
                        </a>
                        <p class="item-artist font-body-3 artist-name-mobile">
                          {{ val.artist?.name }}
                        </p>
                      </div>
                    </div>
                    <span
                      class="material-symbols-outlined icon-trash-mobile"
                      @click="deleteMusic(index)"
                    >
                      delete
                    </span>
                  </div>
                </div>
              </div>
              <div class="button-card">
                <button
                  class="btn btn-outline-third border px-4"
                  @click.prevent="goToListPlaylist"
                >
                  ยกเลิก
                </button>
                <div class="d-flex">
                  <button
                    v-if="step === 2"
                    class="btn btn-outline-third border px-4 me-3"
                    @click="backToStepOne(1)"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    v-if="step === 1"
                    class="btn btn-outline-primary"
                    @click="handleSubmit(onSubmit)"
                  >
                    ถัดไป
                  </button>
                  <button
                    v-if="step === 2"
                    :disabled="videoListValue.length === 0"
                    class="btn btn-outline-primary"
                    @click="nextTo(2)"
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/playlist/edit-playlist-partner.scss"
  lang="scss"
  scoped
></style>
