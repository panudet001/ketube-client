<script setup lang="ts">
import { ref } from "vue";
import moment from "moment";
import { Line } from "vue-chartjs";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useVideoPartnerStore } from "~/store/useVideoPartnerStore";
import { useOptionPartnerStore } from "~/store/useOptionPartnerStore";
import { environment } from "~/services/environments";
import { useUserStore } from "~/store/useUserStore";
import type { Video } from "~/interfaces/responses/partner/video/Video";
import { useKaraokeStore } from "~/store/useKaraokeStore";

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

// Store
const userStore = useUserStore();
const videoPartnerStore = useVideoPartnerStore();
const optionPartnerStore = useOptionPartnerStore();
const karaokeStore = useKaraokeStore();

// SSR CALL API
await useAsyncData(() => userStore.get());
await useAsyncData(() => optionPartnerStore.getStyles());
await useAsyncData(() => optionPartnerStore.getArtists());
await useAsyncData(() => videoPartnerStore.getById(queryIdParam));
const startDate = videoPartnerStore.video?.releasedAt
  ? moment(videoPartnerStore.video?.releasedAt).format("yyyy-MM-DD")
  : "";

const endDate = new Date().toISOString().split("T")[0];
await useAsyncData(() =>
  videoPartnerStore.getStatsById(queryIdParam, startDate, endDate),
);

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Music", link: "/partner/music" },
  { menu: "Music Detail", link: `/partner/music/detail/${queryIdParam}` },
];
const imageSrc = ref<string>();
const videoPlay = ref<string>();
const video = ref<Video>();

onMounted(() => {
  if (videoPartnerStore.video?.lyrics) {
    const element = document.getElementById("lyrics") as HTMLElement;
    element.innerHTML = videoPartnerStore.video?.lyrics ?? "";
  }

  if (videoPartnerStore.video?.description) {
    const element = document.getElementById("description") as HTMLElement;
    element.innerHTML = videoPartnerStore.video?.description ?? "";
  }
});

karaokeStore.playVideo(`${videoPartnerStore.video?.slug}`);

if (videoPartnerStore.video) {
  video.value = videoPartnerStore.video;
  imageSrc.value = environment.urlApiImg + "/" + videoPartnerStore.video?.image;
  videoPlay.value = environment.urlNimbleVideo + videoPartnerStore.video?.video;
}

function formatDate(val: string) {
  const date = moment(val).format("DD/MM/YYYY");
  return date.toString();
}

const view: number[] = [];
const date: string[] = [];

videoPartnerStore.video?.viewerStats?.forEach((value) => {
  view.push(value.view);
  date.push(formatDate(value.date));
});
const totalView = (items) => {
  if (items) {
    return items.reduce((acc, cur) => acc + cur.view, 0);
  }
};
const select = ref<string>("AllDay");
const amountView = ref<number>(Number(totalView(videoPartnerStore.view)));
const startView = ref<string>("(วันที่เริ่มเผยแพร่วิดีโอเพลง)");
const endView = ref<string>("ปัจจุบัน");
const dateArr = ref<any>(
  videoPartnerStore.view?.map((item) => {
    return item.date.substring(0, 10);
  }),
);
const viewArr = ref<any>(
  videoPartnerStore.view?.map((item) => {
    return item.view;
  }),
);
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
  const startDate = moment(videoPartnerStore.video?.releasedAt).format(
    "yyyy-MM-DD",
  );
  const endDate = new Date().toISOString().split("T")[0];
  startView.value = "(วันที่เริ่มเผยแพร่วิดีโอเพลง)";
  endView.value = "ปัจจุบัน";

  if (videoPartnerStore.video?.releasedAt) {
    await videoPartnerStore.getStatsById(queryIdParam, startDate, endDate);
    amountView.value = totalView(videoPartnerStore.view);
  } else {
    await videoPartnerStore.getStatsById(queryIdParam, "", endDate);
    amountView.value = totalView(videoPartnerStore.view);
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
  await videoPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(videoPartnerStore.view);
  getChart();
}

async function AgoMonth() {
  const startDate = new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  startView.value = moment(startDate).format("DD/MM/yyyy");
  endView.value = moment(endDate).format("DD/MM/yyyy");
  await videoPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(videoPartnerStore.view);
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
  await videoPartnerStore.getStatsById(queryIdParam, startDate, endDate);
  amountView.value = totalView(videoPartnerStore.view);
  getChart();
}

function getChart() {
  const viewArr = videoPartnerStore.view?.map((item) => {
    return item.view;
  });
  const dateArr = videoPartnerStore.view?.map((item) => {
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
</script>
<template>
  <div class="music-detail-components">
    <div class="wrapper-content">
      <h4>Music Detail</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div v-if="video" class="row card-component rounded-normal section-card">
        <div class="card-title px-0">
          <div class="item-title">
            <i class="las la-music icon-title"></i>
            <p class="font-subtitle-2">รายละเอียดสมาชิก</p>
          </div>

          <NuxtLink :to="'../edit/' + video.id" class="btn-edit"
            ><i class="las la-edit icon-edit"></i> แก้ไข</NuxtLink
          >
        </div>
        <hr />
        <div class="col-sm-12 col-md-12 col-lg-6 pl-0">
          <div class="row m-t-10d">
            <div class="col-md-4 m-t-20">ID</div>
            <div class="col-md-8 m-t-20">{{ video.id }}</div>
            <div class="col-md-4 m-t-20">ชื่อวิดีโอเพลง</div>
            <div class="col-md-8 m-t-20">{{ video.name }}</div>
            <div class="col-md-4 m-t-20">ชื่อศิลปิน</div>
            <div class="col-md-8 m-t-20">
              <div class="card-item text-link">
                <p v-for="(item, index) in video.artists" :key="index">
                  <a
                    :href="`/artist/${item.slug}`"
                    target="_blank"
                    class="text-link"
                    >{{ item.name }}
                  </a>
                  <span>{{
                    index === video.artists.length - 1 ? "" : "/"
                  }}</span>
                </p>
              </div>
            </div>
            <div class="col-md-4 m-t-20">แนวเพลง</div>
            <div class="col-md-8 m-t-20">
              <div class="card-item">
                <p v-for="(item, index) in video.styles" :key="index">
                  <span>{{ item.name }}</span>
                  <span>{{
                    index === video.styles.length - 1 ? "" : "/"
                  }}</span>
                </p>
              </div>
            </div>
            <div class="col-md-4 m-t-20">สถานะปัจจุบัน</div>
            <div class="col-md-8 m-t-20">
              <div
                :class="
                  video.isActive
                    ? 'card-status-open rounded-normal'
                    : 'card-status-close rounded-normal'
                "
              >
                {{ video.isActive ? "ใช้งาน" : "ปิดใช้งาน" }}
              </div>
            </div>
            <div class="col-md-4 m-t-20">Publish Date</div>
            <div class="col-md-8 m-t-20">
              {{ formatDate(video.publishedAt) }} -
              {{ formatDate(video.expiredAt) }}
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-6 pr-0">
          <div class="row m-t-10d">
            <div class="col-md-12 m-t-20">
              <p>ภาพปกศิลปิน</p>
              <div class="card-img rounded-normal m-t-20">
                <img
                  v-if="imageSrc"
                  :src="imageSrc"
                  :alt="video.name"
                  class="artist-image rounded-normal"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-6 pl-0">
          <div class="row">
            <div class="col-md-12 m-t-20">รายละเอียด</div>
            <div class="col-md-12 m-t-20">
              <div class="card-lyrics rounded-normal">
                <div id="description"></div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 m-t-20">เนื้อเพลง</div>
            <div class="col-md-12 m-t-20">
              <div class="card-lyrics rounded-normal">
                <div id="lyrics"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-6 pr-0">
          <div class="row">
            <div class="col-md-12 m-t-20">
              <p>วิดีโอเพลง</p>
              <div v-if="videoPlay" class="card-video rounded-normal m-t-20">
                <VideoPartner
                  :file="videoPartnerStore.video?.video"
                ></VideoPartner>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12 px-0">
          <div class="card-detail">
            <i class="las la-file-upload icon-upload"></i>
            <p class="font-subtitle-2">รายละเอียดการอัปโหลด</p>
          </div>
          <hr />
          <div class="col-sm-12 col-md-6">
            <div class="row m-t-10d">
              <div class="col-md-4 m-t-20">วันที่สร้าง</div>
              <div class="col-md-8 m-t-20">
                {{ formatDate(video.createdAt) }}
              </div>
              <div class="col-md-4 m-t-20">สร้างโดย</div>
              <div class="col-md-8 m-t-20">
                {{ video.createdBy.firstname ?? "-" }}
                {{ video.createdBy.lastname }}
              </div>
              <div class="col-md-4 m-t-20">แก้ไขล่าสุด</div>
              <div class="col-md-8 m-t-20">
                {{ formatDate(video.updatedAt) }}
              </div>
              <div class="col-md-4 m-t-20">แก้ไขโดย</div>
              <div class="col-md-8 m-t-20">
                {{ video.updatedBy.firstname ?? "-" }}
                {{ video.updatedBy.lastname }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="video?.viewerStats"
        class="row card-component rounded-normal section-card m-t-20"
      >
        <div class="section-chart col-md-12 px-0">
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
            <p class="font-body-2 mb-1">จำนวนการเล่นวิดีโอเพลง</p>
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
  </div>
</template>

<style
  lang="scss"
  src="assets/scss/pages/partner/music/music-detail.scss"
  scoped
></style>
