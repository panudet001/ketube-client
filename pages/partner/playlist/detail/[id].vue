<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
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
import { environment } from "~/services/environments";
import { useUserStore } from "~/store/useUserStore";
import { usePlaylistPartnerPageStore } from "~/store/partner/usePlaylistPageStore";
import type { Playlist } from "~/interfaces/responses/partner/playlist/Playlist";

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
const playlistPartnerStore = usePlaylistPartnerPageStore();

await useAsyncData(() => playlistPartnerStore.getById(queryIdParam));
const startDate = playlistPartnerStore.playlist?.releasedAt
  ? moment(playlistPartnerStore.playlist?.releasedAt).format("yyyy-MM-DD")
  : "";

const endDate = new Date().toISOString().split("T")[0];
await useAsyncData(() =>
  playlistPartnerStore.getStatsById(queryIdParam, startDate, endDate),
);

const totalView = (items) => {
  if (items) {
    return items.reduce((acc, cur) => acc + cur.view, 0);
  }
};

const playlist = ref<Playlist>();
const imageSrcThumbnail = ref<string>();
const imageSrcCover = ref<string>();
const select = ref<string>("AllDay");
const amountView = ref<number>(Number(totalView(playlistPartnerStore.view)));
const startView = ref<string>("(วันที่เริ่มเผยแพร่วิดีโอเพลง)");
const endView = ref<string>("ปัจจุบัน");
const dateArr = ref<any>(
  playlistPartnerStore.view?.map((item) => {
    return item.date.substring(0, 10);
  }),
);
const viewArr = ref<any>(
  playlistPartnerStore.view?.map((item) => {
    return item.view;
  }),
);

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Playlist", link: "/partner/playlist" },
  { menu: "Playlist Detail", link: `/partner/playlist/detail/${queryIdParam}` },
];

if (playlistPartnerStore.playlist) {
  playlist.value = playlistPartnerStore.playlist;
  imageSrcThumbnail.value =
    environment.urlApiImg + "/" + playlistPartnerStore.playlist?.image;
  imageSrcCover.value =
    environment.urlApiImg + "/" + playlistPartnerStore.playlist?.coverPage;
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
  const startDate = moment(playlistPartnerStore.playlist?.releasedAt).format(
    "yyyy-MM-DD",
  );
  const endDate = new Date().toISOString().split("T")[0];
  startView.value = "(วันที่เริ่มเผยแพร่วิดีโอเพลง)";
  endView.value = "ปัจจุบัน";

  if (playlistPartnerStore.playlist?.releasedAt) {
    await playlistPartnerStore.getStatsById(queryIdParam, startDate, endDate);
    amountView.value = 0;
  } else {
    await playlistPartnerStore.getStatsById(queryIdParam, "", endDate);
    amountView.value = totalView(playlistPartnerStore.view);
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
  await playlistPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(playlistPartnerStore.view);
  getChart();
}

async function AgoMonth() {
  const startDate = new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  await playlistPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(playlistPartnerStore.view);
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
  await playlistPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(playlistPartnerStore.view);
  getChart();
}

function getChart() {
  const viewArr = playlistPartnerStore.view?.map((item) => {
    return item.view;
  });
  const dateArr = playlistPartnerStore.view?.map((item) => {
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
  if (playlistPartnerStore.playlist?.description) {
    const element = document.getElementById(
      "playlist-description",
    ) as HTMLElement;
    element.innerHTML = playlistPartnerStore.playlist?.description;
  }
});
</script>
<template>
  <div class="detail-playlist-partner-page">
    <div class="wrapper-content">
      <h4>Playlist Detail</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-detail-playlist">
        <div class="d-flex align-items-center justify-content-between">
          <p
            class="title-detail-playlist font-body-2 d-flex align-items-center"
          >
            <span class="material-symbols-outlined font-body me-2">
              library_music
            </span>
            รายละเอียดเพลย์ลิสต์
          </p>
          <p class="font-body-2 d-flex align-items-center">
            <NuxtLink :to="`/partner/playlist/edit/${queryIdParam}`">
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
              <p class="col-5 col-md-5 font-body-2 head-playlist">
                ชื่อเพลย์ลิสต์
              </p>
              <p class="col-7 col-md-7 font-body-2">{{ playlist.name }}</p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 font-body-2 head-genre">แนวเพลง</p>
              <div class="col-7 col-md-7 font-body-2 title-genre">
                <span v-for="(item, index) in playlist.style" :key="index">
                  {{ item.name }}
                  {{ index === playlist?.style.length - 1 ? "" : "/" }}
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
                    playlist.isActive
                      ? 'status-playlist-success'
                      : 'status-playlist-danger'
                  "
                  class="font-body-4"
                >
                  {{ playlist.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน" }}
                </div>
              </div>
            </div>
            <p class="mb-3 col-md-12 font-body-2 head-description">
              รายละเอียด
            </p>
            <div v-if="playlist?.description" class="col-md-12 mb-3">
              <p
                id="playlist-description"
                class="description font-body-3"
                v-html="playlist?.description"
              ></p>
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
                  playlist.createdBy.firstname
                    ? `${playlist.createdBy.firstname} ${playlist.createdBy.lastname}`
                    : "-"
                }}
              </p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 head-create-date">วันที่สร้าง</p>
              <p class="col-7 col-md-7">{{ formatDate(playlist.createdAt) }}</p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 head-update-date">แก้ไขล่าสุด</p>
              <p class="col-7 col-md-7">{{ formatDate(playlist.updatedAt) }}</p>
            </div>
            <div class="mb-3 row">
              <p class="col-5 col-md-5 head-update">แก้ไขโดย</p>
              <p class="col-7 col-md-7 title-update">
                {{
                  playlist.updatedBy.firstname
                    ? `${playlist.updatedBy.firstname} ${playlist.updatedBy.lastname}`
                    : "-"
                }}
              </p>
            </div>
          </div>
          <div class="d-flex flex-wrap">
            <div class="me-3">
              <p class="mb-2">รูปภาพเพลย์ลิสต์</p>
              <div class="border-cover-playlist">
                <img
                  v-if="imageSrcThumbnail"
                  :src="imageSrcThumbnail"
                  class="thumbnail-playlist"
                  alt="thumbnail-playlist"
                />
              </div>
            </div>

            <div>
              <p class="mb-2">รูปภาพปกเพลย์ลิสต์</p>
              <div class="border-cover-playlist">
                <img
                  v-if="imageSrcCover"
                  :src="imageSrcCover"
                  class="cover-playlist"
                  alt="cover-playlist"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-chart-playlist">
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
          <p class="font-body-2 mb-1">จำนวนเข้าชมเพลย์ลิสต์</p>
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
  src="assets/scss/pages/partner/playlist/detail-playlist-partner.scss"
  lang="scss"
  scoped
></style>
