<script lang="ts" setup>
import type { Permission } from "~/interfaces/responses/partner/team-management/Permission";

defineProps<{
  permissionList: Permission[];
  disableCheckbox: boolean;
  updateModelValue: (id: string, checked: boolean, name: string) => void;
}>();
</script>

<template>
  <div class="checkbox-list-component">
    <div
      v-for="(item, index) in permissionList"
      :key="index"
      class="row permission-title"
    >
      <div class="col-md-4">
        <p>{{ item.menuName }}</p>
        <p class="permission-subtitle">{{ item.subTitle }}</p>
      </div>
      <div class="col-md-8 m-auto">
        <div class="row">
          <p class="col-md-3 text-center checkbox-view">
            <input
              id="view"
              v-model="item.isGet"
              class="form-check-input"
              type="checkbox"
              :checked="item.isGet"
              :disabled="disableCheckbox"
              @change="
                updateModelValue({
                  id: item.id,
                  checked: $event.target.checked,
                  name: 'isGet',
                })
              "
            />
            <label class="form-check-label" for="view"> ดู </label>
          </p>
          <p class="col-md-3 text-center checkbox-create">
            <input
              id="create"
              v-model="item.isCreate"
              class="form-check-input"
              type="checkbox"
              :checked="item.isCreate"
              :disabled="disableCheckbox"
              @change="
                updateModelValue({
                  id: item.id,
                  checked: $event.target.checked,
                  name: 'isCreate',
                })
              "
            />
            <label class="form-check-label" for="create"> เพิ่ม </label>
          </p>
          <p class="col-md-3 text-center checkbox-edit">
            <input
              id="edit"
              v-model="item.isUpdate"
              class="form-check-input"
              type="checkbox"
              :checked="item.isUpdate"
              :disabled="disableCheckbox"
              @change="
                updateModelValue({
                  id: item.id,
                  checked: $event.target.checked,
                  name: 'isUpdate',
                })
              "
            />
            <label class="form-check-label" for="edit"> แก้ไข </label>
          </p>
          <p class="col-md-3 text-center checkbox-delete">
            <input
              id="delete"
              v-model="item.isDelete"
              class="form-check-input"
              type="checkbox"
              :checked="item.isDelete"
              :disabled="disableCheckbox"
              @change="
                updateModelValue({
                  id: item.id,
                  checked: $event.target.checked,
                  name: 'isDelete',
                })
              "
            />
            <label class="form-check-label" for="delete"> ลบ </label>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/pages/partner/team-management/checkbox-list/CheckBoxList.scss"
  lang="scss"
  scoped
></style>
