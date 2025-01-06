<script setup lang="ts">
defineProps<{
  pageName?: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="cover-info-component">
    <div class="header-cover-info">
      <p v-if="pageName" class="cover-title-heading font-subtitle-2">
        {{ pageName }}
      </p>
      <h3 :class="{ space: pageName }" class="cover-title">
        {{ title }}
      </h3>
      <p class="cover-description font-body-2">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<style src="/components/cover/CoverInfo.scss" lang="scss" scoped></style>
