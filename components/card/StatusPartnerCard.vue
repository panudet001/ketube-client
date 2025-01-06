<script setup lang="ts">
import { defineProps } from "vue";
import { StatusPartner } from "~/enums/partner/statusPartner.enums";
defineProps<{
  status: string;
}>();
</script>
<template>
  <div class="status-card-component">
    <div
      v-if="status === StatusPartner.waiting"
      class="bg-card waiting rounded-medium font-body-2"
    >
      รออนุมัติ
    </div>
    <div
      v-if="status === StatusPartner.inProgress"
      class="bg-card pending rounded-medium font-body-2"
    >
      รอดำเนินการ
    </div>
    <div
      v-if="status === StatusPartner.approve"
      class="bg-card success rounded-medium font-body-2"
    >
      อนุมัติแล้ว
    </div>
    <div
      v-if="status === StatusPartner.reject"
      class="bg-card error rounded-medium font-body-2"
    >
      ถูกปฏิเสธ
    </div>
    <div
      v-if="status === StatusPartner.cancel"
      class="bg-card close rounded-medium font-body-2"
    >
      ยกเลิกแล้ว
    </div>
    <div
      v-if="status === StatusPartner.true"
      class="bg-card success rounded-1 font-body-2"
    >
      เปิดใช้งาน
    </div>
    <div
      v-if="status === StatusPartner.false"
      class="bg-card error rounded-1 font-body-2"
    >
      ปิดใช้งาน
    </div>
  </div>
</template>
<style src="/components/card/StatusPartnerCard.scss" lang="scss" scoped></style>
