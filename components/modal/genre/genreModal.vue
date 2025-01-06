<script setup lang="ts">
import type { Option } from "~/interfaces/responses/partner/option/Option";

const props = defineProps<{
  selectGenre: (name: string[], id: string[]) => void;
  items: Option[];
  selectItemListName?: string[];
  selectItemListId?: string[];
  genre: Option[];
}>();
const filteredItems = ref<Option[]>(props.items);
const genreListName = ref<string[]>(props.selectItemListName || []);
const genreListId = ref<string[]>(props.selectItemListId || []);

if (!props.selectItemListName) {
  const defaultSelectedItems = props.items.filter((item) =>
    props.genre?.includes(item.name),
  );
  genreListName.value = defaultSelectedItems.map((item) => item.name);
  genreListId.value = defaultSelectedItems.map((item) => item.id);
}

if (props.selectItemListId) {
  genreListId.value = props.selectItemListId;
}
function checkBox(val: string): boolean {
  const genreName = genreListName.value?.find((item) => item === val);
  if (genreName) {
    return true;
  }
  return false;
}
function selectOption(event: boolean, val: Option) {
  const genreName = genreListName.value.findIndex((item) => item === val.name);
  if (event) {
    genreListName.value.push(val.name);
    genreListId.value.push(val.id);
  } else {
    genreListName.value.splice(genreName, 1);
    genreListId.value.splice(genreName, 1);
  }
}
function onSubmit(name: string[], id: string[]) {
  props.selectGenre(name, id);
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
      id="genreModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered bg-blur">
        <div class="modal-content">
          <div class="modal-header no-border">
            <h6 id="ModalLabel">ค้นหาแนวเพลง</h6>
            <p class="font-body-3">คุณสามารถหาแนวเพลงของคุณได้ที่นี่</p>
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
                <p class="font-body-1">{{ item.name }}</p>
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
              @click="onSubmit(genreListName, genreListId)"
            >
              เพิ่มแนวเพลง
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="/components/modal/genre/genreModal.scss" lang="scss" scoped></style>
