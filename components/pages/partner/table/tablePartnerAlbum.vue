<script setup lang="ts">
import moment from "moment";
import type { Pagination } from "~/interfaces/responses/partner/video/Video";
import { environment } from "~/services/environments";

export interface ItemTable {
  columnDef: string;
  name: string;
  isSort: boolean;
  sortDirection?: string;
  className?: string;
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
  <div class="table-album-component">
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
                    ? 'las la-arrow-up cursor action-sort-by'
                    : 'las la-arrow-down cursor action-sort-by'
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
                  alt=""
                />
                <nuxt-link class="text-link" :to="link + val.id">{{
                  val.name
                }}</nuxt-link>
              </div>
            </td>
            <td>
              <div class="text-artist">{{ val.artist.name }}</div>
            </td>
            <td>{{ val.videoCount }}</td>
            <td>{{ val.viewCount }}</td>
            <td>{{ moment(val.updatedAt).format("DD/MM/yyyy, hh:mm") }}</td>
            <td>{{ val.updatedBy.firstname }}</td>
            <td>
              <StatusPartnerCard
                :status="val.isActive.toString()"
              ></StatusPartnerCard>
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
              เมื่อสร้างอัลบั้มแล้ว รายชื่ออัลบั้มจะปรากฏบนหน้านี้
            </p>
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
            alt=""
          />
          <NuxtLink :to="link + val.id" class="text-start">
            <div class="card-item">
              <span class="text-link font-body-2">{{ val.name }}</span>
              <p class="item-artist font-body-3">{{ val.artist.name }}</p>
              <div class="font-body-3 item-detail">
                <span>{{ val.viewCount ?? 0 }} View</span>
                <span class="dot">•</span>
                <span>{{ moment(val.updatedAt).format("DD/MM/yyyy") }}</span>
              </div>
            </div>
          </NuxtLink>
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
        <p class="mb-5">เมื่อสร้างอัลบั้มแล้ว รายชื่ออัลบั้มจะปรากฏบนหน้านี้</p>
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
  src="/components/pages/partner/table/tablePartnerAlbum.scss"
  lang="scss"
  scoped
></style>
