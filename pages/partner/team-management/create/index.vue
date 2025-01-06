<script lang="ts" setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { useTeamManagementStore } from "~/store/useTeamManagementStore";
import { showSweetAlert } from "~/utils/showSweetAlert";

definePageMeta({
  layout: "custom",
});
const menu = [
  { menu: "GMM Grammy" },
  { menu: "Team Management" },
  { menu: "Add Member" },
];

// Store
const teamManagementStore = useTeamManagementStore();

const permissionList = [
  {
    menuName: "Musics",
    isGet: false,
    isCreate: false,
    isUpdate: false,
    isDelete: false,
  },
  {
    menuName: "Tickets",
    isGet: false,
    isCreate: false,
    isUpdate: false,
    isDelete: false,
  },
];

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .required("กรุณาระบุอีเมล")
      .email("รูปแบบอีเมลไม่ถูกต้อง"),
    name: yup.string().required("กรุณาระบุชื่อ"),
  }),
});

const [email] = defineField("email");
const [name] = defineField("name");

const isLoading = ref<boolean>(false);
const msgError = ref<string>("");

const onSubmit = handleSubmit(async (value) => {
  const body = {
    email: value.email,
    name: value.name,
    permissions: permissionList,
  };

  await teamManagementStore.createMember(body);
  if (teamManagementStore.error) {
    const errMsg = teamManagementStore.error.message;
    msgError.value = errMsg;
    showSweetAlert(errMsg, "error", 4000, true, "top-end");
    isLoading.value = false;
  } else {
    showSweetAlert(
      "สำเร็จ! บันทึกข้อมูลเรียบร้อยแล้ว",
      "success",
      4000,
      true,
      "top-end",
    );
    navigateTo("/partner/team-management");
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="create-team-management-page">
    <div class="wrapper-content">
      <h4>Add Member</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-card-member">
        <p>เพิ่มสมาชิก</p>
        <hr />
        <form class="" @submit="onSubmit">
          <div class="mb-3 row">
            <label for="uid" class="col-lg-2 col-form-label"
              >อีเมล <span class="text-danger">*</span></label
            >
            <div class="col-lg-10">
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control-rounded-normal"
                placeholder="กรอกอีเมลสมาชิก"
                autocomplete="off"
                :class="errors.email ? 'is-invalid' : ''"
              />
              <p class="invalid-feedback">{{ errors.email }}</p>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="uid" class="col-lg-2 col-form-label"
              >ชื่อสมาชิก <span class="text-danger">*</span></label
            >
            <div class="col-lg-10">
              <input
                id="name"
                v-model="name"
                type="text"
                class="form-control-rounded-normal"
                placeholder="ชื่อสมาชิก"
                autocomplete="off"
                :class="errors.name ? 'is-invalid' : ''"
              />
              <p class="invalid-feedback">{{ errors.name }}</p>
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
                <CheckBoxList :permission-list="permissionList"></CheckBoxList>
              </div>
            </div>
          </div>
          <div class="action">
            <a href="/partner/team-management">
              <button type="button" class="btn btn-cancel">ยกเลิก</button>
            </a>
            <button class="btn btn-outline-primary" :disabled="isLoading">
              {{ isLoading ? "กำลังบันทึก..." : "ยืนยัน" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/team-management/create/create-team-management.scss"
  lang="scss"
  scoped
></style>
