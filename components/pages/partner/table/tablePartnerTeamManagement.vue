<script setup lang="ts">
import moment from "moment";
import type { Pagination } from "~/interfaces/Pagination";
export interface ItemTable {
  columnDef: string;
  name: string;
  isSort: boolean;
  sortDirection?: string;
}

const props = defineProps<{
  title: string;
  tableName?: ItemTable[];
  dataStore?: any[];
  pagination?: Pagination;
  sortBy: (sort: string, num: number) => void;
  selectSize: (size: number) => void;
  selectPage: (page: number) => void;
  page?: number;
  link?: string;
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
  <div class="table-partner-team-management-component">
    <div class="card-table">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="(val, index) in tableName" :key="index">
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
            <td>
              {{
                Number(pagination?.page) * Number(pagination?.size) + index + 1
              }}
            </td>
            <td>{{ val.user.name }}</td>
            <td>{{ val.user.googleUsername }}</td>
            <td>{{ moment(val.createdAt).format("DD/MM/yyyy, hh:mm") }}</td>
            <td>
              <Nuxt-link class="text-link" :to="link + '/detail/' + val.id">
                <i class="las la-eye icon-action"></i>
              </Nuxt-link>
              <Nuxt-link class="text-link" :to="link + '/edit/' + val.id">
                <i class="las la-pen icon-action mx-2"></i>
              </Nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="data-table-mobile">
        <Nuxt-link
          v-for="(val, index) in dataStore"
          :key="index"
          :to="link + '/detail/' + val.id"
          class="card-body rounded-normal"
        >
          <div class="card-item">
            <p class="font-body-2">{{ val.user.name }}</p>
            <p class="font-body-4 mb-2">{{ val.user.googleUsername }}</p>
            <p class="font-body-3">
              {{ val.user.name }}
            </p>
          </div>
        </Nuxt-link>
      </div>

      <div class="card-pagination">
        <div class="option-item">
          <p>แสดงคำขอต่อหน้า</p>

          <select class="form-select" @change="size($event)">
            <option value="10" selected>10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p>
            กำลังแสดง 1 ถึง
            {{ Number(pagination?.lastPage) }} จาก
            {{ Number(pagination?.length) }}
            คำขอ
          </p>
        </div>
        <nav aria-label="Page navigation example">
          <div class="pagination-item">
            <button class="page-item" @click="pages(0)">
              <p class="page-link">
                <i class="las la-angle-left"></i>
              </p>
            </button>
            <button
              v-for="val in Number(pagination?.lastPage)"
              :key="val"
              :class="page === val - 1 ? 'page-item-action' : 'page-item'"
            >
              <p class="page-link" @click="pages(val - 1)">
                {{ val }}
              </p>
            </button>
            <button class="page-item">
              <p
                class="page-link"
                @click="pages(Number(pagination?.lastPage) - 1)"
              >
                <i class="las la-angle-right"></i>
              </p>
            </button>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
<style
  src="/components/pages/partner/table/tablePartnerTeamManagement.scss"
  lang="scss"
  scoped
></style>
