<script lang="ts" setup>
import { ref } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useTeamManagementStore } from "~/store/useTeamManagementStore";
import { useUserStore } from "~/store/useUserStore";
import type { Permission } from "~/interfaces/responses/partner/team-management/Permission";
import { showSweetAlert } from "~/utils/showSweetAlert";

definePageMeta({
  layout: "custom",
});

const route = useRoute();
const queryIdParam = route.params.id.toString();

// Store
const userStore = useUserStore();
const teamManagementStore = useTeamManagementStore();

// SSR CALL API
await useAsyncData(() => teamManagementStore.getById(queryIdParam));
const isLoading = ref<boolean>(false);
const msgError = ref<string>("");

const menu = [
  { menu: userStore.user?.name },
  { menu: "Team Management" },
  { menu: "Edit Member" },
];

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .required("กรุณาระบุอีเมล")
      .email("รูปแบบอีเมลไม่ถูกต้อง"),
    name: yup.string().required("กรุณาระบุชื่อ"),
  }),
  initialValues: {
    id: teamManagementStore.memberList?.id,
    email: teamManagementStore.memberList?.email ?? "",
    name: teamManagementStore.memberList?.name ?? "",
  },
});

const [email, emailAttrs] = defineField("email");
const [name, nameAttrs] = defineField("name");

const onSubmit = handleSubmit(async (value) => {
  const body = {
    id: value.id,
    email: value.email,
    name: value.name,
  };
  await teamManagementStore.updateMember(body);
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

async function deleteMember(id: string) {
  await teamManagementStore.deleteMember(id);
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
}

const handlePermissionsChange = async (value: {
  id: string;
  checked: boolean;
  name: string;
}) => {
  const body = teamManagementStore.memberList?.permissions
    .filter((item: Permission) => item.id === value.id)
    .map((val: Permission) => ({
      id: val.id,
      isCreate: value.name === "isCreate" ? value.checked : val.isCreate,
      isGet: value.name === "isGet" ? value.checked : val.isGet,
      isUpdate: value.name === "isUpdate" ? value.checked : val.isUpdate,
      isDelete: value.name === "isDelete" ? value.checked : val.isDelete,
    }));

  await teamManagementStore.updatePermission(body[0]);
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
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="edit-team-management-page">
    <div class="wrapper-content">
      <h4>Edit Member</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>
      <div class="section-card-member">
        <div class="title-action">
          <p>แก้ไขสมาชิก</p>
          <Button
            data-bs-toggle="modal"
            class="btn btn-delete-member"
            data-bs-target="#deleteModal"
            ><i class="las la-trash-alt icon-trash"></i> ลบสมาชิก</Button
          >
        </div>
        <hr />
        <form class="" @submit="onSubmit">
          <div class="mb-3 row">
            <label for="email" class="col-lg-2 col-form-label"
              >อีเมล <span class="text-danger">*</span></label
            >
            <div class="col-lg-10">
              <input
                id="email"
                v-model="email"
                v-bind="emailAttrs"
                type="text"
                class="form-control-rounded-normal"
                placeholder="กรอกอีเมลสมาชิก"
                autocomplete="off"
                :class="errors.email ? 'is-invalid' : ''"
              />
              <p class="invalid-feedback">{{ errors.email }}</p>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="name" class="col-lg-2 col-form-label"
              >ชื่อสมาชิก <span class="text-danger">*</span></label
            >
            <div class="col-lg-10">
              <input
                id="name"
                v-model="name"
                v-bind="nameAttrs"
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
              >Permission <span class="text-danger">*</span></label
            >
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
                  :disable-checkbox="false"
                  :update-model-value="handlePermissionsChange"
                ></CheckBoxList>
              </div>
            </div>
          </div>
          <div class="action">
            <NuxtLink to="#" class="">ยกเลิก</NuxtLink>
            <Button type="submit" class="btn btn-outline-primary"
              >ยืนยัน</Button
            >
          </div>
        </form>
      </div>

      <ConfirmModal
        :confirm-modal="deleteMember"
        :id-member="queryIdParam"
        :id-modal="'deleteModal'"
        :title="'ยืนยันการลบ'"
        :message="`ยืนยันการลบสมาชิก ‘${teamManagementStore.memberList?.name}’ เมื่อยืนยันแล้วจะไม่สามารถยกเลิกได้`"
      >
      </ConfirmModal>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/team-management/edit/edit-team-management.scss"
  lang="scss"
  scoped
></style>
