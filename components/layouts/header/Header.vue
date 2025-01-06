<script lang="ts" setup>
import { ref, watchEffect, onMounted, onBeforeUnmount, defineProps } from "vue";
import { debounce } from "@antfu/utils";
import * as CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import { useSidebarStore } from "~/store/useSidebarStore";
import { useSearchStore } from "~/store/useSearchStore";
import { environment } from "~/services/environments";
import type { Result } from "~/interfaces/responses/search/Result";
import type { Item as DropdownSearchItem } from "~/components/layouts/dropdown-search/DropdownSearch.vue";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";
import { useAdsStore } from "~/store/useAdsStore";

// Store
const sidebarStore = useSidebarStore();
const searchStore = useSearchStore();
const headerAdsStore = useAdsStore();

const toggleSidebarStore = sidebarStore.toggleSidebar;
const maxBackgroundColor = "#1B0E30";
const headerBackgroundColor = ref("transparent");
const isDropdownMenu = ref<boolean>(false);
const isSidebarOpen = ref(sidebarStore.isSidebarOpen);

const props = defineProps({
  roleName: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
    default: "",
  },
  imageProfile: {
    type: String,
    default: "",
  },
  showLogin: {
    type: Boolean,
    default: false,
  },
  showSidebar: {
    type: Boolean,
    default: true,
  },
  isPartner: {
    type: Boolean,
    default: false,
  },
  partnerName: {
    type: String,
    default: "",
  },
  partnerImage: {
    type: String,
    default: "",
  },
  isSearch: {
    type: Boolean,
    default: true,
  },
});

function getCoverProfile(path: string) {
  return path
    ? `${environment.urlApiImg}/${path}`
    : `${environment.urlBaseApp}/profile.jpeg`;
}

function getCoverPartner(path: string) {
  return path
    ? `${environment.urlApiImg}/${path}`
    : `${environment.urlBaseApp}/profile.jpeg`;
}

const coverProfile = getCoverProfile(props.imageProfile);
const coverPartner = getCoverPartner(props.partnerImage);

const searchVideo = ref("");
const isShowSearchSizeMobile = ref<boolean>(false);
const isShowSearch = ref(false);

const handleScroll = () => {
  const scrollPosition = window?.scrollY;
  const scrollHold = 10;
  headerBackgroundColor.value =
    scrollPosition > scrollHold || sidebarStore.isSidebarOpen
      ? maxBackgroundColor
      : "transparent";
};

const getSearch = debounce(300, (value: string) => {
  searchStore.get(value);
  searchStore.getHistory(value);
});

watch(searchVideo, (value) => {
  getSearch(value);
});

function openSearchSizeMobile() {
  isShowSearchSizeMobile.value = true;
  (document.getElementById("menu-toggle") as HTMLInputElement).checked = false;
}

function closeSearchSizeMobile() {
  isShowSearchSizeMobile.value = false;
}

function dropdownMenu() {
  isDropdownMenu.value = !isDropdownMenu.value;
}

function closeDropdown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target && !target.closest(".section-profile")) {
    isDropdownMenu.value = false;
  }
  if (target && !target.closest(".card-search")) {
    isShowSearch.value = false;
  }
}

function onLogout() {
  const token = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
  token.value = null;
}

watchEffect(() => {
  isSidebarOpen.value = sidebarStore.isSidebarOpen;
  handleScroll();
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("click", closeDropdown);
});

const toSearchObject = (value: Result) => {
  let link = "";
  let description = "";
  let type = "";
  if (value.type === "artist") {
    link = `${environment.urlBaseApp}/artist/${value.slug}`;
    description = "";
    type = value.type;
  }

  if (value.type === "playlist") {
    link = `${environment.urlBaseApp}/playlist/${value.slug}`;
    description = "";
    type = value.type;
  }

  if (value.type === "video") {
    link = `${environment.urlBaseApp}/karaoke?v=${value.slug}`;
    description = value.artists?.map((value) => `${value.name}`).join() ?? "";
    type = value.type;
  }

  if (value.type === "album") {
    link = `${environment.urlBaseApp}/album/${value.slug}`;
    description = value.artists?.map((value) => `${value.name}`).join() ?? "";
    type = value.type;
  }

  if (value.type === "ads") {
    link = value.slug;
    type = value.type;
  }

  return {
    title: value.name,
    description,
    imageURL: `${environment.urlApiImg}/${value.imagePath}`,
    link,
    type,
  } as DropdownSearchItem;
};

const saveHistory = (event: KeyboardEvent) => {
  isShowSearch.value = true;
  const text = searchVideo.value;
  if (text) {
    if (event.key === "Enter") {
      searchStore.setHistory(text);
      window.location.href = "/search/" + text;
    }
  }
};
const clearInput = () => {
  searchVideo.value = "";
  isShowSearch.value = false;
};

function showHistory() {
  isShowSearch.value = true;
  searchStore.getHistory();
}

function deleteHistory(val: string) {
  searchStore.delHistory(searchVideo.value, val);
}

const goToSearch = () => {
  const text = searchVideo.value;
  if (text) {
    searchStore.setHistory(searchVideo.value);
    window.location.href = "/search/" + searchVideo.value;
  }
};
</script>

<template>
  <div
    class="header-container"
    :class="{ open: sidebarStore.isSidebarOpen }"
    :style="{ backgroundColor: headerBackgroundColor }"
  >
    <!-- Logo -->
    <div class="section-left">
      <button
        v-if="showSidebar"
        id="btn"
        class="btn btn-icon btn-sidebar"
        @click="toggleSidebarStore"
      >
        <i
          :style="[sidebarStore.isSidebarOpen && { display: 'none' }]"
          class="las la-bars icon-bars"
        ></i>
        <i
          :style="[!sidebarStore.isSidebarOpen && { display: 'none' }]"
          class="las la-times icon-close"
        ></i>
      </button>
      <a href="/">
        <img
          src="assets/images/icons/logo/logo.png"
          alt="Logo Ketube"
          class="logo"
        />
        <h1 class="text-header">Ketuber</h1>
      </a>
      <div v-if="isPartner" class="role-name font-body-2">{{ roleName }}</div>
    </div>

    <!-- Search -->
    <div v-if="isSearch" class="section-center card-search">
      <div class="search">
        <!-- Input search -->

        <div class="input-group">
          <input
            v-model="searchVideo"
            type="text"
            class="form-control"
            placeholder="ค้นหาเพลง เพลย์ลิสต์ และศิลปิน"
            @keyup="saveHistory($event)"
            @click="showHistory"
          />
          <span class="input-group-text card-icon">
            <i
              v-if="searchVideo || isShowSearch"
              class="las la-times close-icon"
              @click="clearInput"
            ></i>
            <div class="card-search">
              <i class="las la-search search-icon" @click="goToSearch"></i>
            </div>
          </span>
        </div>
        <!-- Dropdown value search -->
        <div
          v-if="
            isShowSearch &&
            (searchStore.filterHistory.length > 0 ||
              (searchStore.searchResult &&
                searchStore.searchResult.results.length > 0))
          "
          class="select-item"
          :style="{ display: 'block' }"
        >
          <DropdownSearch
            :items="
              searchStore?.searchResult?.results.map((value) => {
                return toSearchObject(value);
              })
            "
            :history="searchStore.filterHistory"
            :on-click-item="
              () => {
                searchVideo = '';
                searchStore.searchResult = null;
              }
            "
            :on-click-ads="
              () => {
                var id = uuid4();
                headerAdsStore.postClick(
                  searchStore.idAdsSearch!,
                  CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
                );
              }
            "
            :on-click-delete-history="deleteHistory"
          ></DropdownSearch>
        </div>
      </div>
    </div>

    <!-- Login & Profile -->
    <div class="section-right">
      <div v-if="!showLogin" class="section-profile" @click="dropdownMenu()">
        <span class="full-name">{{ fullName }}</span>
        <img :src="coverProfile" alt="cover-profile" class="cover-profile" />
        <ul v-if="isDropdownMenu" class="dropdown">
          <a v-if="isPartner" href="/profile">
            <li
              class="d-flex align-items-center justify-content-between px-3 py-1"
            >
              <div class="d-flex align-items-center">
                <img :src="coverProfile" alt="logo partner" class="logo-user" />
                <div class="ps-2">
                  <p class="font-body-2">{{ fullName }}</p>
                </div>
              </div>
              <i class="las la-angle-right"></i>
            </li>
          </a>
          <hr v-if="isPartner" class="dropdown-divider" />
          <a v-if="isPartner" href="/partner/music">
            <li class="d-flex align-items-center p-3">
              <img
                src="assets/images/icons/logo/logo.png"
                alt="Logo Ketube"
                class="logo m-0"
              />
              <div class="role-name font-body-3">{{ roleName }}</div>
            </li>
            <li class="d-flex align-items-center px-3 pb-1">
              <img
                :src="coverPartner"
                alt="logo partner"
                class="logo-partner"
              />
              <div class="font-body-2 ps-2">{{ partnerName }}</div>
            </li>
          </a>
          <a v-else href="/profile">
            <li
              class="d-flex align-items-center justify-content-between px-3 py-1"
            >
              <div class="d-flex align-items-center">
                <img :src="coverProfile" alt="logo partner" class="logo-user" />
                <div class="ps-2">
                  <p class="font-body-2">{{ fullName }}</p>
                </div>
              </div>
              <i class="las la-angle-right"></i>
            </li>
          </a>
          <hr class="dropdown-divider" />
          <div v-if="!showLogin">
            <div class="music-container">
              <p class="font-subtitle-3 music-item">คลังเพลงของฉัน</p>
              <NuxtLink
                :to="{ path: '/music', query: { tag: 'like' } }"
                class="music-item-icon"
              >
                <span class="material-symbols-outlined"> favorite </span>

                ถูกใจแล้ว
              </NuxtLink>
              <NuxtLink
                :to="{ path: '/music', query: { tag: 'playlist' } }"
                class="music-item-icon"
              >
                <span class="material-symbols-outlined"> playlist_play </span>

                เพลย์ลิสต์ของฉัน
              </NuxtLink>
              <NuxtLink
                :to="{ path: '/music', query: { tag: 'history' } }"
                class="music-item-icon"
              >
                <span class="material-symbols-outlined"> update </span>

                ร้องล่าสุด
              </NuxtLink>
            </div>
          </div>
          <hr class="dropdown-divider" />
          <NuxtLink :to="'/login'" @click="onLogout">
            <li>
              <a class="dropdown-item dropdown-log-out" href="#">ออกจากระบบ</a>
            </li>
          </NuxtLink>
        </ul>
      </div>

      <div v-if="showLogin" class="section-login">
        <NuxtLink to="/login">
          <button class="btn btn-login font-body-2">เข้าสู่ระบบ</button>
        </NuxtLink>
        <NuxtLink to="/sign-up">
          <button class="btn btn-outline-primary font-body-2">ลงทะเบียน</button>
        </NuxtLink>
      </div>
    </div>

    <div class="mobile">
      <span
        v-if="!isShowSearchSizeMobile && isSearch"
        id="search-icon"
        class="material-symbols-outlined search-icon"
        @click="openSearchSizeMobile"
      >
        search
      </span>
      <div v-if="isShowSearchSizeMobile" class="form-wrap">
        <div class="row-warp">
          <div class="input-group input-mobile">
            <input
              v-model="searchVideo"
              type="text"
              class="form-control"
              placeholder="ค้นหาเพลง เพลย์ลิสต์ และศิลปิน"
              @keyup="saveHistory($event)"
              @click="showHistory"
            />
            <span class="input-group-text">
              <i
                v-if="searchVideo || isShowSearch"
                class="las la-times close-icon"
                @click="clearInput"
              ></i>
              <div class="card-search">
                <i class="las la-search search-icon" @click="goToSearch"></i>
              </div>
            </span>
          </div>
          <div class="input-cancel link" @click="closeSearchSizeMobile()">
            Cancel
          </div>
        </div>

        <div
          v-if="
            isShowSearch &&
            (searchStore.filterHistory.length > 0 ||
              (searchStore.searchResult &&
                searchStore.searchResult.results.length > 0))
          "
          class="select-item"
          :style="{ display: 'block' }"
        >
          <DropdownSearch
            :items="
              searchStore.searchResult?.results.map((value) => {
                return toSearchObject(value);
              })
            "
            :history="searchStore.filterHistory"
            :on-click-item="
              () => {
                searchVideo = '';
                searchStore.searchResult = null;
              }
            "
            :on-click-ads="
              () => {
                var id = uuid4();
                headerAdsStore.postClick(
                  searchStore.idAdsSearch!,
                  CryptoJS.AES.encrypt(id, environment.tokenOtt).toString(),
                );
              }
            "
            :on-click-delete-history="deleteHistory"
          ></DropdownSearch>
        </div>
      </div>

      <i
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
        class="las la-bars icon-sidebar"
      ></i>

      <div
        id="offcanvasRight"
        class="offcanvas offcanvas-end"
        tabindex="-1"
        data-bs-dismiss="offcanvas"
        aria-labelledby="offcanvasRightLabel"
      >
        <div class="offcanvas-body">
          <div class="icon-sidebar-container">
            <i
              class="las la-times icon-time"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
              @click="closeSearchSizeMobile()"
            ></i>
          </div>

          <div
            v-if="!showLogin"
            class="section-profile d-flex justify-content-between"
            @click="dropdownMenu()"
          >
            <a href="/profile" class="d-flex align-items-center">
              <div class="d-flex align-items-center">
                <img
                  :src="coverProfile"
                  alt="cover-profile"
                  class="cover-profile"
                />
                <span class="full-name font-subtitle-3">{{ fullName }}</span>
              </div>
              <i class="las la-angle-right icon-right"></i>
            </a>
          </div>
          <hr v-if="isPartner" class="line-hr" />
          <a v-if="isPartner" href="/partner/music">
            <div class="d-flex align-items-center p-3">
              <img
                src="assets/images/icons/logo/logo.png"
                alt="Logo Ketube"
                class="logo m-0"
              />
              <div class="role-name font-body-3">{{ roleName }}</div>
            </div>
            <div class="d-flex align-items-center px-3 pb-3">
              <img
                :src="coverPartner"
                alt="logo partner"
                class="logo-partner"
              />
              <div class="font-subtitle-3 ps-2">{{ partnerName }}</div>
            </div>
          </a>
          <hr v-if="!showLogin" class="line-hr" />
          <div v-if="!showLogin">
            <div class="d-flex align-items-center p-3">
              <p class="font-subtitle-3 text-title-music">คลังเพลงของฉัน</p>
            </div>
            <div class="d-flex align-items-center pb-3">
              <ul class="menu">
                <li class="p-l-27 font-body-2">
                  <span class="material-symbols-outlined"> favorite </span>
                  <NuxtLink
                    :to="{ path: '/music', query: { tag: 'like' } }"
                    class="link"
                  >
                    ถูกใจแล้ว
                  </NuxtLink>
                </li>
                <li class="p-l-27 font-body-2">
                  <span class="material-symbols-outlined"> playlist_play </span>
                  <NuxtLink
                    :to="{ path: '/music', query: { tag: 'playlist' } }"
                    class="link"
                  >
                    เพลย์ลิสต์ของฉัน
                  </NuxtLink>
                </li>
                <li class="p-l-27 font-body-2">
                  <span class="material-symbols-outlined"> update </span>
                  <NuxtLink
                    :to="{ path: '/music', query: { tag: 'history' } }"
                    class="link"
                  >
                    ร้องล่าสุด
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <ul class="menu">
            <li v-if="showLogin" class="font-body-2">
              <NuxtLink to="/login" class="link" active-class="link-active">
                เข้าสู่ระบบ
              </NuxtLink>
            </li>
            <li v-if="showLogin" class="font-body-2">
              <NuxtLink to="/sign-up" class="link" active-class="link-active">
                ลงทะเบียน
              </NuxtLink>
            </li>
            <hr class="line-hr" />
            <li class="font-body-2">
              <NuxtLink to="/" class="link" active-class="link-active">
                หน้าแรก
              </NuxtLink>
            </li>
            <li class="font-body-2">
              <NuxtLink to="/artists" class="link" active-class="link-active">
                ศิลปินรวม
              </NuxtLink>
            </li>
            <li class="font-body-2">
              <NuxtLink to="/playlists" class="link" active-class="link-active">
                เพลย์ลิสต์
              </NuxtLink>
            </li>
            <li class="font-body-2">
              <NuxtLink to="/karaoke" class="link" active-class="link-active">
                คาราโอเกะ
              </NuxtLink>
            </li>
            <li v-if="!showLogin" class="log-out">
              <NuxtLink
                :to="'/login'"
                class="w-100 text-log-out"
                @click="onLogout"
              >
                ออกจากระบบ
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="/components/layouts/header/Header.scss" scoped lang="scss"></style>
