<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps<{
  isHideInfo?: boolean;
  openInfo: () => void;
}>();
</script>

<template>
  <div class="group-info">
    <div
      class="help-container"
      :class="{ 'control-main-hid': props.isHideInfo }"
    >
      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/developer_guide.svg"
            class="img"
            alt="developer_guide"
          />ปิดโหมดแนะนำ
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">fn + F1</div>
          <div class="item-button font-body-4">F1</div>
        </div>
      </div>
      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/vertical_align_top.svg"
            class="img"
            alt="developer_guide"
          />เลื่อนขึ้นด้านบน
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">
            <img
              src="../../../../assets/images/icons/arrow_up.svg"
              alt="developer_guide"
              class="arrow-right"
            />
          </div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/vertical_align_bottom.svg"
            class="img"
            alt="developer_guide"
          />เลื่อนลงด้านล่าง
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">
            <img
              src="../../../../assets/images/icons/arrow_right.svg"
              alt="developer_guide"
              class="arrow-right"
            />
          </div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/highlight_mouse_cursor.svg"
            class="img"
            alt="developer_guide"
          />เลือกเข้าคิว
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">enter</div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/chat_error.svg"
            class="img"
            alt="developer_guide"
          />เคลียร์ช่องค้นหา
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">backspace</div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/next_yes_queue.svg"
            class="img"
            alt="developer_guide"
          />เล่นเพลงถัดไป
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">
            <img
              src="../../../../assets/images/icons/arrow_rights.svg"
              alt="developer_guide"
              class="arrow-right"
            />
          </div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/play_pause.svg"
            class="img"
            alt="developer_guide"
          />เล่นเพลง/หยุดเพลง
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">space</div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/volume_up.svg"
            class="img"
            alt="developer_guide"
          />เพิ่มเสียง/ลดเสียง
        </div>
        <div class="item-end">
          <div class="item-button font-body-4 sound">+</div>
          <div class="item-button font-body-4 sound">-</div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/mic_remote.svg"
            class="img"
            alt="developer_guide"
          />เปิด/ปิดเสียงนักร้อง
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">fn + F10</div>
          <div class="item-button font-body-4">F10</div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/search.svg"
            class="img"
            alt="developer_guide"
          />ค้นหาเพลง
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">fn + F2</div>
          <div class="item-button font-body-4">F2</div>
        </div>
      </div>

      <div class="help-item">
        <div class="item-start font-body-2">
          <img
            src="../../../../assets/images/icons/zoom_in_map.svg"
            class="img"
            alt="developer_guide"
          />ออกจากจอใหญ่
        </div>
        <div class="item-end">
          <div class="item-button font-body-4">esc</div>
        </div>
      </div>
      <div class="triangle"></div>
    </div>
    <div class="help">
      <img
        src="../../../../assets/images/icons/help.svg"
        class="img-help"
        alt="developer_guide"
        @click="props.openInfo()"
      />
    </div>
  </div>
</template>

<style
  src="/components/pages/karaoke/help/Help.scss"
  lang="scss"
  scoped
></style>
