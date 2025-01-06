<script lang="ts" setup>
const props = defineProps<{
  confirmModal: (id: string) => void;
  idModal: string;
  idMember: string;
  title: string;
  message: string;
}>();

function onDeleteMember(id: string) {
  props.confirmModal(id);
}
</script>
<template>
  <div class="confirm-modal-component">
    <div
      :id="idModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered bg-blur">
        <div class="modal-content">
          <div class="modal-header no-border">
            <h6 id="ModalLabel">{{ title }}</h6>
          </div>
          <div class="modal-body">{{ message }}</div>
          <div class="modal-footer no-border">
            <button
              type="button"
              class="btn btn-cancel m-r-10"
              data-bs-dismiss="modal"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="btn btn-outline-primary"
              data-bs-dismiss="modal"
              @click="onDeleteMember(idMember)"
            >
              {{ title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="/components/modal/ConfirmModal.scss" lang="scss" scoped></style>
