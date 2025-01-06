<script lang="ts" setup>
import { ref, watchEffect, onMounted, onBeforeUnmount, defineProps } from "vue";
import { useSidebarStore } from "~/store/useSidebarStore";

export interface SidebarMenus {
  displayName: string;
  iconMenu: string;
  route?: string;
}

const sidebarStore = useSidebarStore();
const isSidebarOpen = ref(sidebarStore.isSidebarOpen);
const sidebarBackgroundColor = ref("transparent");
const maxBackgroundColor = "#1B0E30";
const sidebarRef = ref<HTMLElement | null>(null);
const isRenderFinish = ref<boolean>(false);
const route = useRoute();
const splitPathUrl = route.path.split("/")[1];

defineProps<{
  sidebarMenus: SidebarMenus[];
}>();

const handleScroll = () => {
  const scrollPosition = window?.scrollY;
  const scrollHold = 10;
  sidebarBackgroundColor.value =
    scrollPosition > scrollHold || isSidebarOpen.value
      ? maxBackgroundColor
      : "transparent";
};

const onClickSidebar = () => {
  sidebarRef.value = document?.querySelector(".nav-list");
  if (sidebarRef.value?.offsetWidth === 80) {
    return false;
  } else {
    sidebarStore.toggleSidebar();
    return sidebarStore.isSidebarOpen;
  }
};

watchEffect(() => {
  isSidebarOpen.value = sidebarStore.isSidebarOpen;
  handleScroll();
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const nuxtApp = useNuxtApp();
nuxtApp.hook("page:finish", () => {
  isRenderFinish.value = true;
});
</script>

<template>
  <div ref="sidebar" class="sidebar-section">
    <ul
      class="nav-list sidebar-container"
      :class="{ open: isSidebarOpen }"
      :style="{ backgroundColor: sidebarBackgroundColor }"
    >
      <li
        v-for="(item, index) in sidebarMenus"
        :key="index"
        :class="{ open: isSidebarOpen }"
        @click="onClickSidebar"
      >
        <NuxtLink :to="item.route" class="menu-link" active-class="link-active">
          <div class="box-menu">
            <img
              v-if="splitPathUrl === 'partner'"
              :src="
                $route.path === item.route
                  ? `/partner/${item.iconMenu}_filled.svg`
                  : `/partner/${item.iconMenu}.svg`
              "
              alt="mic-icon"
              class="icon-menu"
            />
            <img
              v-else
              :src="
                $route.path === item.route
                  ? `/icons/${item.iconMenu}_filled.svg`
                  : `/icons/${item.iconMenu}.svg`
              "
              alt="mic-icon"
              class="icon-menu"
            />
          </div>
          <div
            v-if="isRenderFinish"
            :class="$route.path === item.route ? 'link-active' : 'links'"
          >
            <span class="link-name font-button-2">{{ item.displayName }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style
  src="/components/layouts/sidebar/Sidebar.scss"
  scoped
  lang="scss"
></style>
