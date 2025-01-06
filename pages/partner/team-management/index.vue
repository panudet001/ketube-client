<script setup lang="ts">
import { ref } from "vue";
import { debounce } from "@antfu/utils";
import { useTeamManagementStore } from "~/store/useTeamManagementStore";

definePageMeta({
  layout: "custom",
});

// Store
const teamManagementStore = useTeamManagementStore();

// SSR CALL API
await useAsyncData(() => teamManagementStore.get());

const page = ref<number>(0);
const size = ref<number>(10);
const sort = ref<string>("updatedAt");
const order = ref<string>("desc");

const menu = [{ menu: "GMM Grammy" }, { menu: "Team Management" }];

const tableName = ref([
  { columnDef: "no", name: "No", isSort: false, sortDirection: "desc" },
  {
    columnDef: "name",
    name: "ชื่อสมาชิก",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "googleUsername",
    name: "อีเมล",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "dateMember",
    name: "วันที่เพิ่มสมาชิก",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "action",
    name: "Action",
    isSort: false,
    sortDirection: "desc",
  },
]);

function sortBy(sort: string, num: number) {
  tableName.value[num].sortDirection =
    tableName.value[num].sortDirection !== "desc" ? "desc" : "asc";
  teamManagementStore.get(
    page.value,
    size.value,
    sort,
    tableName.value[num].sortDirection,
  );
}

function selectPage(val: number) {
  page.value = val;
  teamManagementStore.get(val, size.value, sort.value, order.value);
}

function selectSize(val: number) {
  size.value = val;
  teamManagementStore.get(page.value, size.value, sort.value, order.value);
}

const applyFilter = debounce(300, (value: string) => {
  page.value = 0;
  teamManagementStore.get(0, 10, "", "", value);
});
</script>

<template>
  <div class="team-management">
    <div class="wrapper-content">
      <h4>Team Management</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-card-team-management">
        <div class="section-total">
          <div class="item-left col-md-4">
            <p>สมาชิกในทีมปัจจุบัน</p>
            <h6>
              {{ teamManagementStore.memberList?.countInviteSuccess }}
              <span class="span-title-people">คน</span>
            </h6>
            <p class="title-people">คน</p>
          </div>
          <div class="line-center"></div>
          <div class="item-right col-md-4">
            <p>สมาชิกที่รอการตอบรับ</p>
            <h6>
              {{ teamManagementStore.memberList?.countInvite }}
              <span class="span-title-people">คน</span>
            </h6>
            <p class="title-people">คน</p>
          </div>
        </div>
        <div class="section-list-team-management">
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
                    placeholder="ค้นหาสมาชิก"
                    @keyup="
                      applyFilter(($event.target as HTMLInputElement).value)
                    "
                  />
                  <span class="input-group-text-partner">
                    <i class="las la-search icon-search"></i>
                  </span>
                </div>
              </div>
              <NuxtLink to="/partner/team-management/create">
                <Button class="btn btn-partner-solid-primary"
                  ><i class="las la-plus-circle"></i> เพิ่มสมาชิก</Button
                >
              </NuxtLink>
            </div>
            <div class="section-table">
              <TablePartnerTeamManagement
                title="หัวข้อ"
                :table-name="tableName"
                :data-store="teamManagementStore.memberList?.partnerMember"
                :pagination="teamManagementStore.memberList?.pagination"
                :select-size="selectSize"
                :select-page="selectPage"
                :page="page"
                :sort-by="sortBy"
                link="/partner/team-management"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/team-management/team-management.scss"
  lang="scss"
  scoped
></style>
