<script setup lang="ts">
import moment from "moment";
import type { Pagination } from "~/interfaces/Pagination";

export interface ItemTable {
  columnDef: string;
  name: string;
  isSort: boolean;
  sortDirection?: string;
  className?: string;
}

const props = defineProps<{
  title: string;
  tableName?: ItemTable[];
  dataStore?: any[];
  pagination: Pagination;
  sortBy: (sort: string, num: number) => void;
  selectSize: (size: number) => void;
  selectPage: (page: number) => void;
  page: number;
  link: string;
}>();

function sort(sort: string, num: number) {
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
  <div class="table-partner-ticket-request-component">
    <div v-if="dataStore && dataStore.length > 0" class="card-table">
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
                v-if="val.isSort"
                class="icon-sort"
                :class="
                  val.sortDirection === 'desc'
                    ? 'las la-arrow-up'
                    : 'las la-arrow-down'
                "
                @click="sort(val.columnDef, index)"
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(val, index) in dataStore" :key="index">
            <td>{{ val.title }}</td>
            <td>{{ val.createdBy.lastname }}</td>
            <td>{{ moment(val.createdAt).format("DD/MM/yyyy, hh:mm") }}</td>
            <td class="d-flex justify-content-center">
              <StatusPartnerCard :status="val.status"></StatusPartnerCard>
            </td>
            <td class="text-center">
              <nuxt-link class="text-link" :to="link + val.id"
                >ดูรายละเอียด</nuxt-link
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div class="data-table-mobile">
        <Nuxt-link
          v-for="(val, index) in dataStore"
          :key="index"
          :to="link + val.id"
          class="card-body rounded-normal"
        >
          <div class="card-item">
            <p class="font-body-1">{{ val.title }}</p>
            <p class="mb-2 font-body-2 text-by">
              โดย {{ val.createdBy.lastname }}
            </p>
            <StatusPartnerCard :status="val.status"></StatusPartnerCard>
          </div>
        </Nuxt-link>
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
  src="/components/pages/partner/table/tablePartnerTicketRequest.scss"
  lang="scss"
  scoped
></style>
