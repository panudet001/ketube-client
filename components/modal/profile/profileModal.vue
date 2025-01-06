<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import moment from "moment/moment";
import { ref } from "vue";
import { useUserStore } from "~/store/useUserStore";
import type { User } from "~/interfaces/responses/user/User";

const userStore = useUserStore();
await useAsyncData(() => userStore.get());

const props = defineProps<{
  submitData: () => void;
}>();

const { errors, handleSubmit, defineField, values } = useForm({
  validationSchema: yup.object({
    name: yup.string().required("กรุณาระบุชื่อ"),
    gender: yup.string().required("กรุณาระบุเพศ"),
    day: yup.string().required("กรุณาระบุวันที่"),
    month: yup.string().required("กรุณาระบุเดือน"),
    year: yup.string().required("กรุณาระบุปี"),
  }),
  initialValues: {
    name: userStore.user?.name ?? "",
    gender: userStore.user?.gender ?? "",
    day: moment(userStore.user?.dateOfBirth).date() ?? "",
    month: moment(userStore.user?.dateOfBirth).format("MMM") ?? "",
    year: moment(userStore.user?.dateOfBirth).year() ?? "",
  },
});

const [name, nameAttrs] = defineField("name");
const [gender] = defineField("gender");
const [day] = defineField("day");
const [month] = defineField("month");
const [year] = defineField("year");
const isResetClicked = ref(false);
const fileProfile = ref<File>();
const isLoading = ref<boolean>(false);

const dateList = Array.from({ length: 31 }, (_, index) => index + 1);
const currentYear = new Date().getFullYear();
const yearList = Array.from({ length: 100 }, (_, index) => currentYear - index);
const monthList = Array.from({ length: 12 }, (_, i) =>
  moment().month(i).format("MMM"),
);

const onSubmit = handleSubmit(async (value: any) => {
  if (!isResetClicked.value) {
    isLoading.value = true;
    const sumDate = moment(
      `${values.year}-${values.month}-${values.day}`,
      "YYYY-MMMM-DD",
    );

    const dateOfBirth = sumDate.isValid() ? sumDate.toISOString() : "";

    const formProfile: User = {
      name: value.name,
      gender: value.gender,
      dateOfBirth: dateOfBirth ?? "",
      profileImage: fileProfile.value!,
    };
    await userStore.updateProfile(formProfile);
    isLoading.value = false;
    props.submitData();
    const clickButton = document.getElementById(
      "submit-profile",
    ) as HTMLElement;
    clickButton.click();
  }
});
</script>
<template>
  <div class="profile-component">
    <div
      id="profile-modal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered bg-blur">
        <div class="modal-content">
          <div class="modal-header">
            <h6>แก้ไขโปรไฟล์</h6>
            <span
              class="material-symbols-outlined icon-close"
              data-bs-dismiss="modal"
            >
              close
            </span>
          </div>
          <div class="modal-body">
            <form class="form-profile" @submit="onSubmit">
              <div class="input-name text-start">
                <label for="full-name" class="form-label font-body-2"
                  >ชื่อที่แสดง <span class="text-red">*</span></label
                >
                <input
                  v-model="name"
                  name="name"
                  v-bind="nameAttrs"
                  type="text"
                  class="form-control-rounded-normal"
                  autocomplete="off"
                  placeholder="กรุณาระบุชื่อ"
                  :class="errors.name ? 'is-invalid' : ''"
                />
                <p class="invalid-feedback">{{ errors.name }}</p>
              </div>
              <div class="select">
                <label for="gender" class="title-label text-start font-body-2"
                  >เพศ <span class="text-red">*</span></label
                >
                <select
                  v-model="gender"
                  name="gender"
                  class="form-select"
                  :class="errors.gender ? 'is-invalid' : ''"
                >
                  <option value="">กรุณาระบุเพศ</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="NoIdentify">NoIdentify</option>
                  <option value="Transgender">Transgender</option>
                </select>
                <p class="invalid-feedback">{{ errors.gender }}</p>
              </div>
              <div class="title-label text-start font-body-2">วันเกิด</div>
              <div class="section-date">
                <div class="w-100">
                  <select
                    v-model="day"
                    name="day"
                    class="form-select"
                    :class="errors.day ? 'is-invalid' : ''"
                  >
                    <option value="">กรุณาระบุวันที่</option>
                    <option v-for="date in dateList" :key="date" :value="date">
                      {{ date }}
                    </option>
                  </select>
                  <p class="invalid-feedback text-start">{{ errors.day }}</p>
                </div>
                <div class="w-100">
                  <select
                    v-model="month"
                    name="month"
                    class="form-select"
                    :class="errors.month ? 'is-invalid' : ''"
                  >
                    <option value="">กรุณาระบุเดือน</option>
                    <option v-for="(item, index) in monthList" :key="index + 1">
                      {{ item }}
                    </option>
                  </select>
                  <p class="invalid-feedback text-start">{{ errors.month }}</p>
                </div>
                <div class="w-100">
                  <select
                    v-model="year"
                    name="year"
                    class="form-select"
                    :class="errors.year ? 'is-invalid' : ''"
                  >
                    <option value="">กรุณาระบุปี</option>
                    <option v-for="item in yearList" :key="item">
                      {{ item }}
                    </option>
                  </select>
                  <p class="invalid-feedback text-start">{{ errors.year }}</p>
                </div>
              </div>
              <button class="btn btn-info font-button-2" :disabled="isLoading">
                {{ isLoading ? "กำลังบันทึก..." : "บันทัก" }}
              </button>
            </form>
            <button
              id="submit-profile"
              class="btn d-none"
              data-bs-dismiss="modal"
            >
              บันทัก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.profile-component {
  .modal-content {
    background-color: #1c2331;
    padding: 20px;
    .modal-header {
      border-bottom: 1px solid rgba(249, 249, 249, 0.25);
      display: flex;
      justify-content: space-between;

      .icon-close {
        font-size: 24px;
        cursor: pointer;
      }
    }
    .form-profile {
      .text-red {
        color: $red;
      }
      .select {
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: left;
      }
      .section-date {
        display: flex;
        flex-direction: row;
        gap: 10px;
      }
      .btn-info {
        margin-top: 20px;
        width: 100%;
        color: $white;
        background-color: $pastel-blue;
        border: 1px solid $pastel-blue;
        border-radius: 22.5px;
      }
    }
  }
}
</style>
