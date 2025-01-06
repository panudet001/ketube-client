<script setup lang="ts">
import { debounce } from "@antfu/utils";
import moment from "moment";
import { useUserStore } from "~/store/useUserStore";
import { useAlbumPartnerPageStore } from "~/store/partner/useAlbumPageStore";

definePageMeta({
  layout: "custom",
});

// Store
const userStore = useUserStore();
const albumPartnerStore = useAlbumPartnerPageStore();

// SSR CALL API
await useAsyncData(() => userStore.get());
await useAsyncData(() => albumPartnerStore.get());
await useAsyncData(() => albumPartnerStore.getStats());

const page = ref<number>(0);
const size = ref<number>(30);
const sort = ref<string>("updatedAt");
const order = ref<string>("desc");
const amountView = ref<number>(Number(albumPartnerStore.view?.view));
const startView = ref<string>(
  moment(albumPartnerStore.albumList?.startDate).format("DD/MM/yyyy"),
);
const endView = ref<string>("ปัจจุบัน");

function selectPage(val: number) {
  page.value = val;
  albumPartnerStore.get(val, size.value, sort.value, order.value);
}

function selectSize(val: number) {
  size.value = val;
  page.value = 0;
  albumPartnerStore.get(0, size.value, sort.value, order.value);
}

function selectView(startDate: string, endDate: string) {
  albumPartnerStore.getStats(startDate, endDate);
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  if (!startDate && !endDate) {
    startView.value = moment(albumPartnerStore.albumList?.startDate).format(
      "DD/MM/yyyy",
    );
    endView.value = "ปัจจุบัน";
  }
}

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Album", link: "/partner/album" },
];

const tableName = ref([
  { columnDef: "no", name: "No", isSort: false, sortDirection: "desc" },
  {
    columnDef: "name",
    name: "ชื่ออัลบั้ม",
    isSort: true,
    sortDirection: "desc",
  },
  { columnDef: "artist", name: "ศิลปิน", isSort: true, sortDirection: "desc" },
  {
    columnDef: "view",
    className: "view-music-count",
    name: "จำนวนเพลง",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "view",
    className: "view-count",
    name: "จำนวนเข้าชม",
    isSort: true,
    sortDirection: "desc",
  },
  {
    columnDef: "updatedAt",
    className: "updated-at",
    name: "แก้ไขล่าสุดเมื่อ",
    isSort: true,
    sortDirection: "desc",
  },
  {
    columnDef: "updatedBy",
    className: "updated-by",
    name: "แก้ไขโดย",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "status",
    className: "text-center",
    name: "สถานะ",
    isSort: false,
    sortDirection: "desc",
  },
]);

function sortBy(sort: string, num: number) {
  tableName.value.map((value, index) =>
    index !== num ? (value.sortDirection = "desc") : "",
  );
  tableName.value[num].sortDirection =
    tableName.value[num].sortDirection !== "desc" ? "desc" : "asc";
  albumPartnerStore.get(
    page.value,
    size.value,
    sort,
    tableName.value[num].sortDirection,
  );
}

const applyFilter = debounce(300, (value: string) => {
  page.value = 0;
  albumPartnerStore.get(0, 30, "", "", value);
});

watch(albumPartnerStore, (value) => {
  amountView.value = Number(value.view?.view);
});

function goToLink() {
  location.reload();
}
</script>
<template>
  <div class="album-partner-page">
    <div class="wrapper-content">
      <h4>Album</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-card rounded-normal">
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-4 m-t-10">
            <TotalItemCard
              title="จำนวนอัลบั้มทั้งหมด"
              :start-date="
                moment(albumPartnerStore.albumList?.startDate).format(
                  'DD/MM/yyyy',
                )
              "
              end-date="ปัจจุบัน"
              :amount="albumPartnerStore.albumList?.totalAlbum"
              :link="goToLink"
              icon-las="las la-music"
              :is-link="true"
            ></TotalItemCard>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-8 m-t-10">
            <ViewDayCard
              title="จำนวนการเข้าชมอัลบั้มทั้งหมด"
              icon-las="las la-play-circle"
              :start="startView"
              :end="endView"
              :amount="amountView"
              :select-view="selectView"
            ></ViewDayCard>
          </div>
        </div>
        <div class="section-list">
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
                    placeholder="ค้นหาอัลบั้ม"
                    @keyup="
                      applyFilter(($event.target as HTMLInputElement).value)
                    "
                  />
                  <span class="input-group-text-partner">
                    <span class="material-symbols-outlined"> search </span>
                  </span>
                </div>
              </div>
              <NuxtLink to="/partner/album/create">
                <Button class="btn btn-partner-solid-primary"
                  ><i class="las la-plus-circle"></i> เพิ่มอัลบั้ม</Button
                >
              </NuxtLink>
            </div>
            <div class="section-table">
              <TablePartnerAlbum
                title="อัลบั้ม"
                :table-name="tableName"
                :data-store="albumPartnerStore.albumList?.albums"
                :pagination="albumPartnerStore.albumList?.pagination"
                :page="page"
                :sort-by="sortBy"
                :select-page="selectPage"
                :select-size="selectSize"
                link="/partner/album/detail/"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  lang="scss"
  src="assets/scss/pages/partner/album/album.scss"
  scoped
></style>
