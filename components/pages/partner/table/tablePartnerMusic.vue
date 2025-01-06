<script setup lang="ts">
import moment from "moment";
import type { Pagination } from "~/interfaces/responses/partner/video/Video";
import { environment } from "~/services/environments";

export interface ItemTable {
  columnDef: string;
  className?: string;
  name: string;
  isSort: boolean;
  sortDirection?: string;
}

const props = defineProps<{
  title: string;
  tableName: ItemTable[];
  dataStore: any[];
  pagination: Pagination;
  sortBy: (sort: string, num: number) => void;
  selectSize: (size: number) => void;
  selectPage: (page: number) => void;
  page: number;
  link: string;
}>();

const urlImage = environment.urlApiImg + "/";
const sortAction = ref<string>("updatedAt");
function sort(sort: string, num: number) {
  sortAction.value = sort;
  props.sortBy(sort, num);
}

function size(event: Event) {
  const element = event.currentTarget as HTMLInputElement;
  const number = Number(element.value);
  props.selectSize(number);
}

function pages(val: number) {
  props.selectPage(val);
}
</script>
<template>
  <div class="table-music-component">
    <div class="card-table">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="(val, index) in tableName"
              :key="index"
              :class="val.className"
            >
              {{ val.name }}
              <i
                v-if="val.isSort && sortAction !== val.columnDef"
                :class="
                  val.sortDirection === 'desc'
                    ? 'las la-arrow-up cursor'
                    : 'las la-arrow-down cursor'
                "
                @click="sort(val.columnDef, index)"
              ></i>
              <i
                v-if="val.isSort && sortAction === val.columnDef"
                :class="
                  val.sortDirection === 'desc'
                    ? 'las la-arrow-up cursor action-sort'
                    : 'las la-arrow-down cursor action-sort'
                "
                @click="sort(val.columnDef, index)"
              ></i>
            </th>
          </tr>
        </thead>
        <tbody v-if="dataStore.length > 0">
          <tr v-for="(val, index) in dataStore" :key="index">
            <td>
              {{
                Number(pagination.page) * Number(pagination.size) + index + 1
              }}
            </td>
            <td>
              <div class="card-image">
                <img
                  v-if="val.image"
                  class="show-image rounded"
                  :src="urlImage + val.image"
                />
                <nuxt-link class="text-link" :to="link + val.id">{{
                  val.name
                }}</nuxt-link>
              </div>
            </td>
            <td>
              <div class="text-artist">
                <span v-for="(item, idx) in val.artists" :key="idx">
                  {{ item.name }}
                  <span v-if="idx + 1 !== val.artists?.length">, </span>
                </span>
              </div>
            </td>
            <td>{{ val.view ?? 0 }}</td>
            <td>
              {{
                val.publishedAt
                  ? moment(val.publishedAt).format("DD/MM/yyyy, hh:mm")
                  : "-"
              }}
            </td>
            <td>
              {{
                val.updatedAt
                  ? moment(val.updatedAt).format("DD/MM/yyyy, hh:mm")
                  : "-"
              }}
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
            <p class="mb-5">เมื่อสร้างเพลงแล้ว รายชื่อเพลงจะปรากฏบนหน้านี้</p>
          </td>
        </tbody>
      </table>

      <div v-if="dataStore.length > 0" class="data-table-mobile">
        <div
          v-for="(val, index) in dataStore"
          :key="index"
          class="card-body rounded-normal"
        >
          <img
            v-if="val.image"
            class="show-image rounded"
            :src="urlImage + val.image"
          />
          <Nuxt-link :to="link + val.id">
            <div class="card-item">
              <div class="font-body-2 text-link" :to="link + val.id">
                {{ val.name }}
              </div>
              <div class="font-body-3 item-artist">
                <span v-for="(item, idx) in val.artists" :key="idx">
                  {{ item.name }}
                  <span v-if="idx + 1 !== val.artists?.length">, </span>
                </span>
              </div>
              <div class="font-body-3 item-detail">
                <span>{{ val.view ?? 0 }} View</span>
                <span class="dot">•</span>
                <span>{{ moment(val.publishedAt).format("DD/MM/yyyy") }}</span>
              </div>
            </div>
          </Nuxt-link>
        </div>
      </div>
      <div v-else class="empty-mobile">
        <img
          src="~assets/images/backgrounds/empty.png"
          alt="empty"
          width="170"
          class="mt-5"
        />
        <p class="font-subtitle-2 mt-2">ไม่พบข้อมูล</p>
        <p class="mb-5">เมื่อสร้างเพลงแล้ว รายชื่อเพลงจะปรากฏบนหน้านี้</p>
      </div>
    </div>
    <Pagination
      :pagination="pagination"
      :page="page"
      :title="title"
      :pages="pages"
      :size="size"
    ></Pagination>
  </div>
</template>
<style
  src="/components/pages/partner/table/tablePartnerMusic.scss"
  lang="scss"
  scoped
></style>
