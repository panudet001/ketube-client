<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";
import type { Album } from "~/interfaces/responses/partner/album/Album";
import { environment } from "~/services/environments";
import { useAlbumPartnerPageStore } from "~/store/partner/useAlbumPageStore";
import { useUserStore } from "~/store/useUserStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

definePageMeta({
  layout: "custom",
});

const route = useRoute();
const queryIdParam = route.params.id.toString();

const userStore = useUserStore();
const albumPartnerStore = useAlbumPartnerPageStore();

await useAsyncData(() => albumPartnerStore.getById(queryIdParam));
const startDate = albumPartnerStore.album?.releasedAt
  ? moment(albumPartnerStore.album?.releasedAt).format("yyyy-MM-DD")
  : "";

const endDate = new Date().toISOString().split("T")[0];
await useAsyncData(() =>
  albumPartnerStore.getStatsById(queryIdParam, startDate, endDate),
);

const totalView = (items) => {
  if (items) {
    return items.reduce((acc, cur) => acc + cur.view, 0);
  }
};

const album = ref<Album>();
const imageSrcThumbnail = ref<string>();
const imageSrcCover = ref<string>();
const select = ref<string>("AllDay");
const amountView = ref<number>(Number(totalView(albumPartnerStore.view)));
const startView = ref<string>("(วันที่เริ่มเผยแพร่วิดีโอเพลง)");
const endView = ref<string>("ปัจจุบัน");
const dateArr = ref<any>(
  albumPartnerStore.view?.map((item) => {
    return item.date.substring(0, 10);
  }),
);
const viewArr = ref<any>(
  albumPartnerStore.view?.map((item) => {
    return item.view;
  }),
);

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Album", link: "/partner/album" },
  { menu: "Album Detail", link: `/partner/album/detail/${queryIdParam}` },
];

if (albumPartnerStore.album) {
  album.value = albumPartnerStore.album;
  imageSrcThumbnail.value =
    environment.urlApiImg + "/" + albumPartnerStore.album?.image;
  imageSrcCover.value =
    environment.urlApiImg + "/" + albumPartnerStore.album?.albumCover;
}

function formatUID(uid: string) {
  if (uid.length <= 8) {
    return uid;
  } else {
    return uid.substring(0, 4) + "......" + uid.substring(uid.length - 4);
  }
}

function formatDate(val: string) {
  const date = moment(val).format("DD/MM/YYYY HH:mm");
  return date.toString();
}

const buttonData = [
  {
    name: "ทั้งหมด",
    status: "AllDay",
  },
  {
    name: "ย้อนหลัง 7 วัน",
    status: "AgoWeek",
  },
  {
    name: "ย้อนหลัง 30 วัน",
    status: "AgoMonth",
  },
  {
    name: "แสดงเฉพาะเดือนนี้",
    status: "Month",
  },
];

function selectButton(val: string) {
  select.value = val;
  if (val === "AllDay") {
    AllDay();
  }
  if (val === "AgoWeek") {
    AgoWeek();
  }
  if (val === "AgoMonth") {
    AgoMonth();
  }
  if (val === "Month") {
    Month();
  }
}

const chartData = ref({
  labels: dateArr.value,
  datasets: [
    {
      label: "",
      backgroundColor: "#6D8DFF",
      borderColor: "#6D8DFF",
      data: viewArr.value,
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

async function AllDay() {
  const startDate = moment(albumPartnerStore.album?.releasedAt).format(
    "yyyy-MM-DD",
  );
  const endDate = new Date().toISOString().split("T")[0];
  startView.value = "(วันที่เริ่มเผยแพร่วิดีโอเพลง)";
  endView.value = "ปัจจุบัน";

  if (albumPartnerStore.album?.releasedAt) {
    await albumPartnerStore.getStatsById(queryIdParam, startDate, endDate);
    amountView.value = 0;
  } else {
    await albumPartnerStore.getStatsById(queryIdParam, "", endDate);
    amountView.value = totalView(albumPartnerStore.view);
  }
  getChart();
}

async function AgoWeek() {
  const startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  await albumPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(albumPartnerStore.view);
  getChart();
}

async function AgoMonth() {
  const startDate = new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  await albumPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(albumPartnerStore.view);
  getChart();
}

async function Month() {
  const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 2)
    .toISOString()
    .split("T")[0];
  const endDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1,
  )
    .toISOString()
    .split("T")[0];
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  await albumPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(albumPartnerStore.view);
  getChart();
}

function getChart() {
  const viewArr = albumPartnerStore.view?.map((item) => {
    return item.view;
  });
  const dateArr = albumPartnerStore.view?.map((item) => {
    return item.date.substring(0, 10);
  });
  chartData.value = {
    labels: dateArr,
    datasets: [
      {
        label: "",
        backgroundColor: "#6D8DFF",
        borderColor: "#6D8DFF",
        data: viewArr,
      },
    ],
  };
}

onMounted(() => {
  if (album.value?.description) {
    const element = document.getElementById(
      "album-description",
    ) as HTMLElement | null;
    if (element) {
      element.innerHTML = album.value?.description;
    }
  }
});
</script>
<template>
  <div class="detail-album-partner-page">
    <div class="wrapper-content">
      <h4>Album Detail</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-detail-album">
        <div class="d-flex align-items-center justify-content-between">
          <p class="title-detail-album font-body-2 d-flex align-items-center">
            <span class="material-symbols-outlined font-body me-2">
              library_music
            </span>
            รายละเอียดอัลบั้ม
          </p>
          <p class="font-body-2 d-flex align-items-center">
            <NuxtLink :to="`/partner/album/edit/${queryIdParam}`">
              <span class="material-symbols-outlined font-body me-2">
                border_color
              </span>
              แก้ไข
            </NuxtLink>
          </p>
        </div>
        <hr />
        <div class="row">
          <div class="col-12 col-md-5">
            <div class="mb-3 row">
              <p class="col-5 col-md-5 font-body-2 head-id">ID</p>
              <p class="col-7 col-md-7 font-body-2 title-id">
                {{ formatUID(queryIdParam) }}
              </p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 font-body-2 head-album">ชื่ออัลบั้ม</p>
              <p class="col-7 col-md-7 font-body-2">{{ album.name }}</p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 font-body-2 head-artist">ชื่อศิลปิน</p>
              <p class="col-7 col-md-7 font-body-2 title-artist">
                <a
                  class="title-artist"
                  :href="`/artist/${album.artist.slug}`"
                  target="_blank"
                >
                  {{ album.artist.name }}
                </a>
              </p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 font-body-2 head-genre">แนวเพลง</p>
              <div class="col-7 col-md-7 font-body-2 title-genre">
                <span v-for="(item, index) in album.styles" :key="index">
                  {{ item.name }}
                  {{ index === album.styles.length - 1 ? "" : "/" }}
                </span>
              </div>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 font-body-2 head-status">
                สถานะเพลย์ลิสต์
              </p>
              <div class="col-7 col-md-7 font-body-2">
                <div
                  :class="
                    album.isActive
                      ? 'status-playlist-success'
                      : 'status-playlist-danger'
                  "
                  class="font-body-4"
                >
                  {{ album.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน" }}
                </div>
              </div>
            </div>
            <p class="mb-3 col-md-12 font-body-2 head-description">
              รายละเอียด
            </p>
            <div v-if="album?.description" class="col-md-12 mb-3">
              <div
                id="playlist-description"
                class="description font-body-3"
                v-html="album?.description"
              ></div>
            </div>
          </div>
        </div>

        <div class="row">
          <div>
            <p class="title-upload font-body-2 d-flex align-items-center">
              <span class="material-symbols-outlined font-body me-2">
                upload_file
              </span>
              รายละเอียดการอัปโหลด
            </p>
            <hr />
          </div>
          <div class="col-12 col-md-5">
            <div class="mb-3 row">
              <p class="col-5 col-md-5 head-create">สร้างโดย</p>
              <p class="col-7 col-md-7 title-create">
                {{
                  album.createdBy.firstname
                    ? `${album.createdBy.firstname} ${album.createdBy.lastname}`
                    : "-"
                }}
              </p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 head-create-date">วันที่สร้าง</p>
              <p class="col-7 col-md-7">{{ formatDate(album.createdAt) }}</p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 head-update-date">แก้ไขล่าสุด</p>
              <p class="col-7 col-md-7">{{ formatDate(album.updatedAt) }}</p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 head-update">แก้ไขโดย</p>
              <p class="col-7 col-md-7 title-update">
                {{
                  album.updatedBy.firstname
                    ? `${album.updatedBy.firstname} ${album.updatedBy.lastname}`
                    : "-"
                }}
              </p>
            </div>
          </div>
          <div class="d-flex flex-wrap">
            <div class="me-3">
              <p class="mb-2">รูปภาพอัลบั้ม</p>
              <div class="border-cover-album">
                <img
                  v-if="imageSrcThumbnail"
                  :src="imageSrcThumbnail"
                  class="thumbnail-album"
                  alt="thumbnail-album"
                />
              </div>
            </div>

            <div>
              <p class="mb-2">รูปภาพปกอัลบั้ม</p>
              <div class="border-cover-album">
                <img
                  v-if="imageSrcCover"
                  :src="imageSrcCover"
                  class="cover-album"
                  alt="cover-album"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-chart-album">
        <button
          v-for="(item, index) in buttonData"
          :key="index"
          class="btn-day rounded font-body-2 me-2"
          :class="select === item.status ? 'action' : ''"
          @click="selectButton(item.status)"
        >
          <i v-if="select === item.status" class="las la-check icon-menu"></i>
          {{ item.name }}
        </button>
        <div class="border-view-count">
          <p class="font-body-2 mb-1">จำนวนเข้าชมอัลบั้ม</p>
          <p class="font-body-3">ตั้งแต่ {{ startView }} ถึง {{ endView }}</p>
          <div class="d-flex align-items-center mt-2">
            <div class="border-icon me-2">
              <span class="material-icons"> visibility </span>
            </div>
            <h6>{{ amountView }} ครั้ง</h6>
          </div>
        </div>

        <div class="border-chart">
          <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/album/detail-album-partner.scss"
  lang="scss"
  scoped
></style>
