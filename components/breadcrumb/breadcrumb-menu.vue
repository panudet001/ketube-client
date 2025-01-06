<script setup lang="ts">
import { defineProps } from "vue";

interface BreadcrumbList {
  menu: string;
  link: string;
}

defineProps<{
  list: BreadcrumbList[];
  prefixMenu?: string;
  menu?: string;
}>();
</script>
<template>
  <div class="breadcrumb-component">
    <nav v-if="list && list.length > 0" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li
          v-for="(item, index) in list"
          :key="index"
          class="breadcrumb-item font-body-4"
        >
          <a :href="item.link" class="menu-link">
            {{ item.menu }}
          </a>
        </li>
      </ol>
    </nav>
  </div>
</template>

<style
  src="/components/breadcrumb/breadcrumb-menu.scss"
  lang="scss"
  scoped
></style>
