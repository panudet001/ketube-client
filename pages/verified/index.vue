<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/store/useAuthStore";

definePageMeta({
  layout: false,
});
const MsgError = ref<string>("");
const isLoading = ref<boolean>(false);

const form = ref({
  username: "",
  password: "",
});

const authStore = useAuthStore();

function handleSubmit() {
  MsgError.value = "";
  isLoading.value = true;
  if (form.value.username === "111111" && form.value.password === "111111") {
    authStore.adminLogin();
  } else {
    MsgError.value =
      "username หรือ password ไม่ถูกต้อง กรุณากรองข้อมูลให้ถูกต้อง";
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="layout-container-admin">
    <!-- Content -->
    <div class="section-content">
      <!-- Background -->
      <div class="container-error">
        <div class="card-item">
          <img
            src="assets/images/icons/logo/logo.png"
            alt="Logo Ketube"
            class="logo"
          />
          <form @submit.prevent="handleSubmit">
            <div class="section-form">
              <div class="input-name">
                <label for="full-name" class="form-label">Username</label>
                <input
                  id="full-name"
                  v-model="form.username"
                  type="text"
                  class="form-control-rounded-normal"
                  autocomplete="off"
                  placeholder="กรุณาระบุ username"
                  aria-describedby="username"
                />
              </div>
              <div class="input-name">
                <label for="full-name" class="form-label">Password</label>
                <input
                  id="full-name"
                  v-model="form.password"
                  type="password"
                  class="form-control-rounded-normal"
                  autocomplete="off"
                  placeholder="กรุณาระบุ password"
                  aria-describedby="password"
                />
              </div>
              <p class="text-center text-error">{{ MsgError }}</p>
              <button
                class="btn btn-outline-primary w-100"
                :disabled="isLoading"
              >
                <p v-if="!isLoading">Login</p>
                <p v-if="isLoading">กำลังโหลด...</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped src="assets/scss/pages/admin/admin.scss"></style>
