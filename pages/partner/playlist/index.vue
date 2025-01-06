<script setup lang="ts">
import { debounce } from "@antfu/utils";
import moment from "moment";
import { useUserStore } from "~/store/useUserStore";
import { usePlaylistPartnerPageStore } from "~/store/partner/usePlaylistPageStore";

definePageMeta({
  layout: "custom",
});

// Store
const userStore = useUserStore();
const playlistPartnerStore = usePlaylistPartnerPageStore();

// SSR CALL API
await useAsyncData(() => userStore.get());
await useAsyncData(() => playlistPartnerStore.get());
await useAsyncData(() => playlistPartnerStore.getStats());

const page = ref<number>(0);
const size = ref<number>(30);
const sort = ref<string>("updatedAt");
const order = ref<string>("desc");
const amountView = ref<number>(Number(playlistPartnerStore.view?.view));
const startView = ref<string>(
  moment(playlistPartnerStore.playlistList?.startDate).format("DD/MM/yyyy"),
);
const endView = ref<string>("ปัจจุบัน");

function selectPage(val: number) {
  page.value = val;
  playlistPartnerStore.get(val, size.value, sort.value, order.value);
}

function selectSize(val: number) {
  size.value = val;
  page.value = 0;
  playlistPartnerStore.get(0, size.value, sort.value, order.value);
}

function selectView(startDate: string, endDate: string) {
  playlistPartnerStore.getStats(startDate, endDate);
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  if (!startDate && !endDate) {
    startView.value = moment(
      playlistPartnerStore.playlistList?.startDate,
    ).format("DD/MM/yyyy");
    endView.value = "ปัจจุบัน";
  }
}

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Playlist", link: "/partner/playlist" },
];

const tableName = ref([
  { columnDef: "no", name: "No", isSort: false, sortDirection: "desc" },
  {
    columnDef: "name",
    name: "ชื่อเพลย์ลิสต์",
    isSort: true,
    sortDirection: "desc",
  },
  {
    columnDef: "view",
    name: "จำนวนเพลง",
    className: "view-music-count",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "view",
    name: "จำนวนเข้าชม",
    className: "view-count",
    isSort: true,
    sortDirection: "desc",
  },
  {
    columnDef: "updatedAt",
    className: "updated-at",
    name: "แก้ไขล่าสุด",
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
  playlistPartnerStore.get(
    page.value,
    size.value,
    sort,
    tableName.value[num].sortDirection,
  );
}

const applyFilter = debounce(300, (value: string) => {
  page.value = 0;
  playlistPartnerStore.get(0, 30, "", "", value);
});

watch(playlistPartnerStore, (value) => {
  amountView.value = Number(value.view?.view);
});

function goToLink() {
  location.reload();
}
</script>
<template>
  <div class="album-partner-page">
    <div class="wrapper-content">
      <h4>Playlist</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-card rounded-normal">
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-4 m-t-10">
            <TotalItemCard
              title="จำนวนเพลย์ลิสต์ทั้งหมด"
              :start-date="
                moment(playlistPartnerStore.playlistList?.startDate).format(
                  'DD/MM/yyyy',
                )
              "
              end-date="ปัจจุบัน"
              :amount="playlistPartnerStore.playlistList?.totalPlaylist"
              :link="goToLink"
              icon-las="las la-music"
              :is-link="true"
            ></TotalItemCard>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-8 m-t-10">
            <ViewDayCard
              title="จำนวนการเข้าชมเพลย์ลิสต์ทั้งหมด"
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
                    placeholder="ค้นหาเพลย์ลิสต์"
                    @keyup="
                      applyFilter(($event.target as HTMLInputElement).value)
                    "
                  />
                  <span class="input-group-text-partner">
                    <span class="material-symbols-outlined"> search </span>
                  </span>
                </div>
              </div>
              <NuxtLink to="/partner/playlist/create">
                <Button class="btn btn-partner-solid-primary"
                  ><i class="las la-plus-circle"></i> เพิ่มเพลย์ลิสต์</Button
                >
              </NuxtLink>
            </div>
            <div class="section-table">
              <TablePartnerPlaylist
                title="เพลย์ลิสต์"
                :table-name="tableName"
                :data-store="playlistPartnerStore.playlistList?.playlists"
                :pagination="playlistPartnerStore.playlistList?.pagination"
                :page="page"
                :sort-by="sortBy"
                :select-page="selectPage"
                :select-size="selectSize"
                link="/partner/playlist/detail/"
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
