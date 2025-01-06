<script setup lang="ts">
import { debounce } from "@antfu/utils";
import moment from "moment/moment";
import { useVideoPartnerStore } from "~/store/useVideoPartnerStore";
import { useUserStore } from "~/store/useUserStore";
import TablePartner from "~/components/pages/partner/table/tablePartnerMusic.vue";

definePageMeta({
  layout: "custom",
});

useHead({
  title: "partner",
});

// Store
const userStore = useUserStore();
const videoStore = useVideoPartnerStore();

// SSR CALL API
await useAsyncData(() => userStore.get());
await useAsyncData(() => videoStore.get());
await useAsyncData(() => videoStore.getStats());

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Music", link: "/partner/music" },
];

const page = ref<number>(0);
const size = ref<number>(30);
const sort = ref<string>("updatedAt");
const order = ref<string>("desc");
const amountView = ref<number>(Number(videoStore.view?.view));
const startView = ref<string>(
  moment(videoStore.videoList?.startDate).format("DD/MM/yyyy"),
);
const endView = ref<string>("ปัจจุบัน");

function selectView(startDate: string, endDate: string) {
  videoStore.getStats(startDate, endDate);
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  if (!startDate && !endDate) {
    startView.value = moment(videoStore.videoList?.startDate).format(
      "DD/MM/yyyy",
    );
    endView.value = "ปัจจุบัน";
  }
}

watch(videoStore, (value) => {
  amountView.value = Number(value.view?.view);
});

function selectPage(val: number) {
  page.value = val;
  videoStore.get(val, size.value, sort.value, order.value);
}

function selectSize(val: number) {
  size.value = val;
  page.value = 0;
  videoStore.get(0, size.value, sort.value, order.value);
}

const tableName = ref([
  { columnDef: "no", name: "No", isSort: false, sortDirection: "desc" },
  {
    columnDef: "name",
    name: "วิดีโอเพลง",
    isSort: true,
    sortDirection: "desc",
  },
  { columnDef: "artist", name: "ศิลปิน", isSort: false, sortDirection: "desc" },
  {
    columnDef: "view",
    className: "view",
    name: "จำนวนเข้าชม",
    isSort: false,
    sortDirection: "desc",
  },
  {
    columnDef: "publishedAt",
    className: "published-at",
    name: "Publish Date",
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
]);

function sortBy(sort: string, num: number) {
  tableName.value.map((value, index) =>
    index !== num ? (value.sortDirection = "desc") : "",
  );
  tableName.value[num].sortDirection =
    tableName.value[num].sortDirection !== "desc" ? "desc" : "asc";
  videoStore.get(
    page.value,
    size.value,
    sort,
    tableName.value[num].sortDirection,
  );
}

const applyFilter = debounce(300, (value: string) => {
  page.value = 0;
  videoStore.get(0, 30, "", "", value);
});

function goToLink() {
  location.reload();
}
</script>
<template>
  <div class="music-page">
    <div class="wrapper-content">
      <h4>Music</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-card rounded-normal">
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-4 m-t-10">
            <TotalItemCard
              title="จำนวนวิดีโอเพลงทั้งหมด"
              :start-date="
                moment(videoStore.videoList?.startDate).format('DD/MM/yyyy')
              "
              end-date="ปัจจุบัน"
              icon-las="las la-music"
              :amount="videoStore.videoList?.totalVideos"
              :link="goToLink"
              :is-link="true"
            ></TotalItemCard>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-8 m-t-10">
            <ViewDayCard
              title="จำนวนการเข้าชมทั้งหมด"
              :start="startView"
              :end="endView"
              icon-las="las la-play-circle"
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
                    placeholder="ค้นหาเพลง"
                    @keyup="
                      applyFilter(($event.target as HTMLInputElement).value)
                    "
                  />
                  <span class="input-group-text-partner">
                    <span class="material-symbols-outlined"> search </span>
                  </span>
                </div>
              </div>
              <NuxtLink to="/partner/music/create">
                <Button class="btn btn-partner-solid-primary"
                  ><i class="las la-plus-circle"></i> เพิ่มวิดีโอเพลง</Button
                >
              </NuxtLink>
            </div>
            <div class="section-table">
              <TablePartner
                title="วิดีโอเพลง"
                :table-name="tableName"
                :data-store="videoStore.videoList?.videos"
                :pagination="videoStore.videoList?.pagination"
                :page="page"
                :sort-by="sortBy"
                :select-page="selectPage"
                :select-size="selectSize"
                link="/partner/music/detail/"
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
  src="assets/scss/pages/partner/music/music-list.scss"
  scoped
></style>
