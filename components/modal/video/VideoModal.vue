<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import moment from "moment";
import type { Option } from "~/interfaces/responses/partner/option/Option";
import type { Pagination } from "~/interfaces/responses/partner/video/Video";
import { environment } from "~/services/environments";
import { useOptionPartnerStore } from "~/store/useOptionPartnerStore";
import { optionPartnersService } from "~/services/partner/optionsPartnerService";
import { formatTime } from "~/utils/formatTime";

const props = defineProps<{
  selectVideo: (name: string[], id: string[], value: any[]) => void;
  items: Option[];
  selectItemListName?: string[];
  selectItemListId?: string[];
  styles: Option[];
  pagination: Pagination;
  selectSize: (size: number) => void;
  selectPage: (page: number) => void;
  page?: number;
  artistListId: string;
  videoList: any[];
}>();

const optionPartnerStore = useOptionPartnerStore();

// SSR CALL API
await useAsyncData(() => optionPartnerStore.getArtistById(props.artistListId));

const filteredItems = ref<any>(optionPartnerStore.optionVideosList);
const videoListName = ref<string[]>(props.selectItemListName || []);
const videoListValue = ref<string[]>(props.videoList || []);
const videoListId = ref<string[]>(props.selectItemListId || []);
const urlImage = environment.urlApiImg + "/";
const searchMusic = ref<string>("");

watchEffect(() => {
  if (searchMusic.value === "") {
    filteredItems.value = optionPartnerStore.optionVideosList;
  } else {
    optionPartnersService
      .getArtistById(props.artistListId, 0, 10, "", "", searchMusic.value)
      .then((value) => {
        filteredItems.value = value.videos;
      });
  }
});

if (!props.selectItemListName) {
  videoListName.value = videoListValue.value?.map((item) => item.name);
  videoListId.value = videoListValue.value?.map((item) => item.id);
}

if (props.selectItemListName) {
  videoListName.value = props.selectItemListName;
}

if (props.selectItemListId) {
  videoListId.value = props.selectItemListId;
}

function checkBox(val: string): boolean {
  const videoName = videoListName.value?.find((item) => item === val);
  if (videoName) {
    return true;
  }
  return false;
}

function selectOption(event: boolean, val: Option) {
  const videoNameIndex = videoListName.value.findIndex(
    (item) => item === val.name,
  );

  if (event) {
    videoListName.value.push(val.name);
    videoListValue.value.push(val);
    videoListId.value.push(val.id);
  } else {
    videoListName.value.splice(videoNameIndex, 1);
    videoListValue.value.splice(videoNameIndex, 1);
    videoListId.value.splice(videoNameIndex, 1);
  }
}

function onSubmit(name: string[], id: string[], value: any[]) {
  props.selectVideo(name, id, value);
}

function size(event: Event) {
  const element = event.currentTarget as HTMLInputElement;
  const number = Number(element.value);
  props.selectSize(number);
}

function pages(val: number) {
  props.selectPage(val);
}

function clearSelection(value: any) {
  if (!value) {
    videoListName.value = [];
    videoListId.value = [];
    videoListValue.value = [];
  }
}
</script>

<template>
  <div class="video-modal-container">
    <div
      id="videoModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered bg-blur">
        <div class="modal-content">
          <div class="modal-header no-border">
            <h6 id="ModalLabel">Add Music Video</h6>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">
              <span class="material-icons-outlined icon-search"> search </span>
            </span>
            <input
              v-model="searchMusic"
              class="form-control"
              type="text"
              placeholder="ค้นหาเพลง"
            />
          </div>
          <div class="section-style d-none">
            <div class="button-style">
              <button
                v-for="(item, index) in styles"
                :key="index"
                class="btn btn-outline-third"
              >
                {{ item.name }}
              </button>
            </div>
          </div>
          <div class="modal-body">
            <table class="data-table w-100">
              <thead>
                <tr>
                  <th class="mb-3">ชื่อเพลง</th>
                  <th class="mb-3">วันที่เพิ่ม</th>
                  <th class="mb-3">ความยาว</th>
                </tr>
              </thead>
              <tbody v-if="filteredItems && filteredItems.length > 0">
                <tr v-for="(item, index) in filteredItems" :key="index">
                  <td>
                    <div class="d-flex align-items-center mb-3">
                      <input
                        name="genre"
                        type="checkbox"
                        class="form-check-input"
                        :value="item"
                        :checked="checkBox(item.name)"
                        @change="
                          selectOption(
                            ($event.target as HTMLInputElement).checked,
                            item,
                          )
                        "
                      />
                      <img
                        v-if="item.image"
                        class="cover-music rounded ms-2"
                        :src="urlImage + item.image"
                        alt="cover-music"
                      />
                      <div class="ms-2">
                        <p class="font-body-3">{{ item.name }}</p>
                        <p class="font-body-4 title-artist">{{ item.name }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {{ moment(item.updatedAt).format("DD/MM/yyyy, hh:mm") }}
                  </td>
                  <td>{{ formatTime(item.duration) }}</td>
                </tr>
              </tbody>
              <!-- v-else -->
              <tbody v-else>
                <tr>
                  <td colspan="3">
                    <div class="d-flex align-items-center flex-column">
                      <p class="mt-4 font-body-2">
                        ไม่พบเพลงของศิลปินคนนี้
                        กรุณาอัปโหลดเพลงเพื่อเพิ่มลงในอัลบั้ม
                      </p>
                      <NuxtLink
                        class="btn btn-outline-primary px-4 mt-4"
                        to="/partner/music"
                        >เพิ่มลงอัลบั้ม</NuxtLink
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination
            :pagination="pagination"
            :page="page"
            :pages="pages"
            :size="size"
          ></Pagination>
          <div class="modal-footer no-border">
            <button
              type="button"
              class="btn btn-outline-third m-r-10 px-4"
              data-bs-dismiss="modal"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="btn btn-outline-primary px-4"
              data-bs-dismiss="modal"
              @click="
                onSubmit(videoListName, videoListId, videoListValue);
                clearSelection(videoListValue);
              "
            >
              เพิ่มลงอัลบั้ม
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="/components/modal/video/VideoModal.scss" lang="scss" scoped></style>
