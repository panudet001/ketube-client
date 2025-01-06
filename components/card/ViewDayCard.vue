<script lang="ts" setup>
import { useForm } from "vee-validate";
import { defineProps } from "vue";
import * as yup from "yup";

const props = defineProps<{
  title: string;
  start: string;
  end: string;
  iconLas: string;
  amount: string;
  selectView: (startDate: string, endDate: string) => void;
}>();
const select = ref<string>("AllDay");
const isShowInput = ref<boolean>(false);
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
  isShowInput.value = false;
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
  if (val === "Other") {
    isShowInput.value = true;
  }
}

function AllDay() {
  props.selectView("", "");
}

function AgoWeek() {
  const startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  props.selectView(startDate, endDate);
}

function AgoMonth() {
  const startDate = new Date(new Date().getTime() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  props.selectView(startDate, endDate);
}

function Month() {
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
  props.selectView(startDate, endDate);
}

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    startDate: yup.string().required("กรุณาระบุวันที่เริ่มต้น"),
    endDate: yup.string().required("กรุณาระบุวันที่สิ้นสุด"),
  }),
});

const [startDate] = defineField("startDate");
const [endDate] = defineField("endDate");

// eslint-disable-next-line require-await
const Other = handleSubmit(async (value: any) => {
  isShowInput.value = false;
  props.selectView(value.startDate, value.endDate);
});
</script>
<template>
  <div class="visit-card-component rounded-normal">
    <div class="card-item">
      <div class="card-button">
        <button
          v-for="(item, index) in buttonData"
          :key="index"
          class="btn-day rounded font-body-2"
          :class="select === item.status ? 'action' : ''"
          @click="selectButton(item.status)"
        >
          <i v-if="select === item.status" class="las la-check icon-menu"></i>
          {{ item.name }}
        </button>
      </div>
      <div class="card-body">
        <div id="dateDisplay"></div>
        <p class="font-button-2 mb-2">{{ title }}</p>
        <p class="font-body-3 text-silver mb-2">
          ตั้งแต่ {{ start }} ถึง {{ end }}
        </p>
        <div class="card-icon">
          <div class="rounded icon">
            <span class="material-symbols-outlined"> play_circle </span>
          </div>
          <h5>{{ amount }}</h5>
        </div>
      </div>
      <div v-if="isShowInput">
        <form class="card-other rounded-normal w-100" @submit="Other">
          <p>วันที่เริ่มต้น</p>
          <input
            v-model="startDate"
            name="startDate"
            type="date"
            class="form-control-rounded-normal"
            autocomplete="off"
            placeholder="YYYY-MM-DD"
            :class="errors.startDate ? 'is-invalid' : ''"
          />
          <p class="invalid-feedback">{{ errors.startDate }}</p>
          <p>วันที่สิ้นสุด</p>
          <input
            v-model="endDate"
            name="endDate"
            type="date"
            class="form-control-rounded-normal"
            autocomplete="off"
            placeholder="YYYY-MM-DD"
            :class="errors.endDate ? 'is-invalid' : ''"
          />
          <p class="invalid-feedback">{{ errors.endDate }}</p>
          <button class="btn btn-outline-primary" @click="Other">ค้นหา</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style src="/components/card/ViewDayCard.scss" lang="scss" scoped></style>
