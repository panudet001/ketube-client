<script setup lang="ts">
import type { Option } from "~/interfaces/responses/partner/option/Option";
import { environment } from "~/services/environments";

const props = defineProps<{
  selectArtist: (name: string[], id: string[]) => void;
  items: Option[];
  selectItemListName?: string[];
  selectItemListId?: string[];
  artistName?: string;
}>();
const filteredItems = ref<Option[]>(props.items);
const artistListName = ref<string[]>([]);
const artistListId = ref<string[]>([]);

if (props.selectItemListName) {
  artistListName.value = props.selectItemListName;
}

if (props.selectItemListId) {
  artistListId.value = props.selectItemListId;
}

function selectOption(val: Option) {
  artistListName.value = [val.name];
  artistListId.value = [val.id];
}
function onSubmit(name: string[], id: string[]) {
  props.selectArtist(name, id);
}

function checkBox(val: string): boolean {
  return artistListName.value[0] === val;
}

function applyFilter(filterValue: string): void {
  if (filterValue) {
    filteredItems.value = props.items?.filter((item) =>
      item.name.toLowerCase().includes(filterValue.toLowerCase()),
    );
  } else {
    filteredItems.value = props.items;
  }
}
</script>

<template>
  <div class="artist-modal-container">
    <div
      id="artistModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered bg-blur">
        <div class="modal-content">
          <div class="modal-header no-border">
            <h6 id="ModalLabel">ค้นหาศิลปิน</h6>
            <p class="font-body-3">คุณสามารถหาศิลปินของคุณได้ที่นี่</p>
          </div>
          <div class="modal-body">
            <input
              class="form-control-rounded-normal"
              type="text"
              @keyup="applyFilter(($event.target as HTMLInputElement).value)"
            />
            <p class="font-body-2 m-t-10">
              Search results : {{ filteredItems.length ?? "0" }}
            </p>
            <div
              v-if="filteredItems && filteredItems.length > 0"
              class="item-group m-t-10"
            >
              <div
                v-for="(item, index) in filteredItems"
                :key="index"
                class="item-card"
              >
                <input
                  :id="index"
                  name="artist"
                  type="radio"
                  class="form-check-input"
                  :value="item"
                  :checked="checkBox(item.name) || artistName === item.name"
                  @change="selectOption(item)"
                />
                <img
                  :src="environment.urlApiImg + '/' + item.image"
                  :alt="item.name"
                  class="image-artist card-circle"
                />
                <label :for="index" class="font-body-1">{{ item.name }}</label>
              </div>
            </div>
          </div>
          <div class="modal-footer no-border">
            <button
              type="button"
              class="btn btn-cancel m-r-10"
              data-bs-dismiss="modal"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="btn btn-outline-primary"
              data-bs-dismiss="modal"
              @click="onSubmit(artistListName, artistListId)"
            >
              เพิ่มศิลปิน
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/modal/artist/artistModal.scss"
  lang="scss"
  scoped
></style>
