<script lang="ts" setup>
import { defineProps } from "vue";
const props = defineProps<{
  title: string;
  startDate: string;
  endDate: string;
  iconLas: string;
  amount: number;
  link: () => void;
  isLink: boolean;
}>();

function onClickLink() {
  props.link();
}
</script>
<template>
  <div class="total-card-component rounded-normal">
    <div class="card-body">
      <p class="font-button-2">{{ title }}</p>
      <p class="font-body-3 text-silver">
        ตั้งแต่ {{ startDate }} ถึง {{ endDate }}
      </p>
      <div class="card-icon">
        <div class="rounded icon">
          <span class="material-symbols-outlined"> music_note </span>
        </div>
        <h5>{{ amount }}</h5>
      </div>
    </div>
    <div v-if="isLink" class="card-footer d-none">
      <div class="text-link" @click="onClickLink">
        <p class="text-blue font-button-2">ดูรายละเอียดเพิ่มเติม</p>
      </div>
      <i class="las la-arrow-right icon-arrow"></i>
    </div>
  </div>
</template>
<style src="/components/card/TotalItemCard.scss" lang="scss" scoped></style>
