<script lang="ts" setup>
import { ref } from "vue";
import { useTeamManagementStore } from "~/store/useTeamManagementStore";

definePageMeta({
  layout: "custom",
});

const route = useRoute();
const queryIdParam = route.params.id.toString();
// Store
const teamManagementStore = useTeamManagementStore();

// SSR CALL API
await useAsyncData(() => teamManagementStore.getById(queryIdParam));

const isDisable = ref<boolean>(true);
const menu = [
  { menu: "GMM Grammy" },
  { menu: "Team Management" },
  { menu: "Member Detail" },
];
</script>

<template>
  <div class="detail-team-management-page">
    <div class="wrapper-content">
      <h4>Member Detail</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-card-member">
        <div class="title-action">
          <p>รายละเอียดสมาชิก</p>

          <NuxtLink
            :to="
              '/partner/team-management/edit/' +
              teamManagementStore.memberList?.id
            "
            class="btn-edit-member"
            ><i class="las la-edit icon-edit"></i> แก้ไข</NuxtLink
          >
        </div>
        <hr />
        <div class="mb-3 row d-flex align-items-center">
          <label for="uid" class="col-lg-2 col-form-label">อีเมล </label>
          <div class="col-lg-10">
            <p>{{ teamManagementStore.memberList?.email }}</p>
          </div>
        </div>
        <div class="mb-3 row d-flex align-items-center">
          <label for="uid" class="col-lg-2 col-form-label">ชื่อสมาชิก </label>
          <div class="col-lg-10">
            <p>{{ teamManagementStore.memberList?.name }}</p>
          </div>
        </div>
        <div class="row section-permission-list">
          <label for="permission" class="col-lg-2 col-form-label"
            >Permission
          </label>
          <div class="col-lg-10">
            <div class="permission-list">
              <div class="row permission-header">
                <div class="col-md-4">รายการ</div>
                <div class="col-md-8">
                  <div class="row permission-header-title">
                    <p class="col-md-3 text-center">ดู</p>
                    <p class="col-md-3 text-center">เพิ่ม</p>
                    <p class="col-md-3 text-center">แก้ไข</p>
                    <p class="col-md-3 text-center">ลบ</p>
                  </div>
                </div>
              </div>
              <CheckBoxList
                :permission-list="teamManagementStore.memberList?.permissions"
                :disable-checkbox="isDisable"
              ></CheckBoxList>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/team-management/detail/detail-team-management.scss"
  lang="scss"
  scoped
></style>
