<template>
  <div id="partner-ck">
    <ckeditor
      v-model="data"
      :editor="editor"
      :value="value"
      @input="emitInput"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  value: string;
  edit?: string;
}>();

const data = props.edit ?? "";

const emit = defineEmits(["input"]);
const emitInput = (event) => {
  emit("input", event);
};
const { $ckeditor } = useNuxtApp();
const editor = $ckeditor.customEditor;
</script>
