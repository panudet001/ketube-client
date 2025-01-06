<script lang="ts" setup>
import QrcodeVue from "qrcode.vue";

const props = defineProps<{
  url: string | null;
  size: number;
  id: string;
  urlRemote: string | null;
  resetRoom: () => void;
}>();
</script>
<template>
  <div class="gen-qrcode-component">
    <div
      id="qe-code-modal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered bg-blur">
        <div class="modal-content">
          <div class="modal-header">
            <div class="start">
              <img
                src="assets/images/icons/settings_remote.svg"
                alt="icon-verified"
                class="img"
              />
              <p class="modal-text">รีโมทควบคุม</p>
            </div>
            <div class="end" data-bs-dismiss="modal">
              <img
                src="assets/images/icons/close_outline.svg"
                alt="icon-verified"
                class="img"
              />
            </div>
          </div>
          <div class="modal-body">
            <div class="text-title">วิธีการใช้รีโมทควบคุมของ Ketube</div>
            <p class="text-size-14">1.เข้าร่วมรีโมทควบคุมบนอุปกรณ์อื่น</p>
            <ul class="text-size-14">
              <li>
                ไปที่ URL ที่แสดงบนหน้าจออุปกรณ์หลัก หรือสแกน QR Code
                บนหน้าจออุปกรณ์หลัก
              </li>
            </ul>
            <p class="text-size-14">
              2. เมื่อเชื่อมต่อแล้ว คุณสามารถใช้รีโมทควบคุม Ketube ได้ดังนี้
            </p>
            <ul class="text-size-14">
              <li>เล่น หยุดชั่วคราว หรือข้ามเพลง</li>
              <li>เปิด - ปิด (เสียงร้อง) , เพิ่ม -ลด (เสียงเพลง)</li>
              <li>เพิ่มคิวเพลง</li>
              <li>ค้นหาเพลง</li>
              <li>จัดการคิวเพลง</li>
            </ul>
            <div class="qr-code">
              <p class="text-size-14">สแกนเพื่อควบคุมจากมือถือ</p>

              <qrcode-vue
                :value="url"
                :size="size"
                level="H"
                class="qrcode-vue"
              />
              <p class="text-size-14 w-300">{{ url }}</p>
              <div class="center">
                <button class="btn info" @click="props.resetRoom">
                  <p>Reset QR Code</p>
                  <img
                    src="assets/images/icons/reset_remote.svg"
                    alt="icon-verified"
                    class="img"
                  />
                </button>
              </div>
            </div>
            <hr class="modal-hr" />
            <p class="text-title text-title-start">คำแนะนำเพิ่มเติม</p>
            <p class="text-size-14 w-300">
              1.ตรวจสอบให้แน่ใจว่าอุปกรณ์หลักและอุปกรณ์อื่นเชื่อมต่อกับสัญญาณอินเตอร์เน็ตแล้ว
            </p>
            <p class="text-size-14 w-300">
              2.หากคุณพบปัญหาในการเชื่อมต่ออุปกรณ์ ให้ลองรีเฟรชหน้าเว็บหรือสแกน
              QR Code อีกครั้ง
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/modal/qrcode/qrcodeModal.scss"
  lang="scss"
  scoped
></style>
