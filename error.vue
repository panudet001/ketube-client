<script setup>
import { ref, onMounted } from "vue";

const isRenderFinish = ref(false);

onMounted(() => {
  isRenderFinish.value = true;
});
</script>
<template>
  <NuxtLayout v-if="isRenderFinish" :name="'404'"></NuxtLayout>
</template>
