<script lang="ts" setup>
import { defineProps } from "vue";

defineProps<{
  partnerName: string;
  partnerImage: string;
}>();
</script>
<template>
  <div class="container-partner">
    <div class="tooltips-container">
      <div class="card-partner">
        <img
          src="assets/images/icons/verified.png"
          alt="icon-verified"
          class="icon-verified"
        />
        <span class="text-partner font-button-3">
          {{ partnerName }}
        </span>
      </div>
      <div class="tooltips card-too-partner">
        <img :src="partnerImage" class="image-partner" />
        <p class="font-button-3">{{ partnerName }}</p>
      </div>
    </div>
  </div>
</template>
<style src="/components/card/PartnerCard.scss" lang="scss" scoped></style>
