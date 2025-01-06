<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps<{
  isHideAlert?: boolean;
  text?: string;
}>();
</script>

<template>
  <div
    class="alert-container"
    :class="{ 'alert-container-hid': props.isHideAlert }"
  >
    {{ props.text }}
  </div>
</template>

<style
  src="/components/pages/karaoke/alert-fullscreen/AlertFullscreen.scss"
  lang="scss"
  scoped
></style>
