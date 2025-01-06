<script setup lang="ts">
import { ref } from "vue";
import { debounce } from "@antfu/utils";

import { useTicketRequestStore } from "~/store/useTicketRequestPageStore";
import { useUserStore } from "~/store/useUserStore";

definePageMeta({
  layout: "custom",
});

// Store
const ticketStore = useTicketRequestStore();
const userStore = useUserStore();

// SSR CALL API
await useAsyncData(() => ticketStore.get());
await useAsyncData(() => userStore.get());

const page = ref<number>(0);
const size = ref<number>(30);
const sort = ref<string>("updatedAt");
const order = ref<string>("desc");

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Ticket Request", link: "/partner/ticket-request" },
];

function selectPage(val: number) {
  page.value = val;
  ticketStore.get(val, size.value, sort.value, order.value);
}

function selectSize(val: number) {
  size.value = val;
  ticketStore.get(page.value, size.value, sort.value, order.value);
}

const tableName = ref([
  {
    columnDef: "title",
    name: "หัวข้อ",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "sender",
    name: "ผู้ส่ง",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "createdAt",
    name: "วันที่ส่ง",
    isSort: true,
    sortDirection: "desc",
  },
  {
    columnDef: "status",
    className: "text-center",
    name: "สถานะ",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "view",
    className: "text-center",
    name: "ดูรายละเอียด",
    isSort: false,
    sortDirection: "desc",
  },
]);

function sortBy(sort: string, num: number) {
  tableName.value[num].sortDirection =
    tableName.value[num].sortDirection !== "desc" ? "desc" : "asc";
  ticketStore.get(
    page.value,
    size.value,
    sort,
    tableName.value[num].sortDirection,
  );
}

const applyFilter = debounce(300, (value: string) => {
  page.value = 0;
  ticketStore.get(0, 30, "", "", value);
});
</script>

<template>
  <div class="ticket-request-page">
    <div class="wrapper-content">
      <h4>Ticket Request</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-card-ticket-request">
        <div class="section-list-ticket-request">
          <div class="w-100">
            <div class="d-flex justify-content-between action">
              <div class="d-flex">
                <Button class="btn btn-partner-outline-primary d-none"
                  ><i class="las la-filter"></i>
                  <span class="text-filter">ตัวกรอง</span></Button
                >
                <div class="input-group-partner ms-2">
                  <input
                    class="form-control form-control-partner rounded-normal"
                    type="text"
                    placeholder="ค้นหาหัวข้อคำขอ"
                    @keyup="
                      applyFilter(($event.target as HTMLInputElement).value)
                    "
                  />
                  <span class="input-group-text-partner">
                    <span class="material-symbols-outlined"> search </span>
                  </span>
                </div>
              </div>
              <NuxtLink to="/partner/ticket-request/create">
                <Button class="btn btn-partner-solid-primary"
                  ><i class="las la-plus-circle"></i> ส่งรายการคำขอ</Button
                >
              </NuxtLink>
            </div>
            <div class="section-table">
              <TablePartnerTicketRequest
                title="หัวข้อ"
                :table-name="tableName"
                :data-store="ticketStore.ticketList?.tickets"
                :pagination="ticketStore.ticketList?.pagination"
                :select-size="selectSize"
                :select-page="selectPage"
                :page="page"
                :sort-by="sortBy"
                link="/partner/ticket-request/detail/"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/ticket-request/ticket-request.scss"
  lang="scss"
  scoped
></style>
