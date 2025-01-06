<script lang="ts" setup>
import { Cropper } from "vue-advanced-cropper";
import { ref, defineProps } from "vue";

const props = defineProps<{
  imageCover: any;
  fileName: string;
  cropPreview: (src: string, fileBlob: any, fileSizeMB: any) => void;
}>();

const cropperWidth = 500;

const defaultSize = ({ imageSize, visibleArea }) => {
  return {
    width: (visibleArea || imageSize).width,
    height: 460,
  };
};

const stencilProps = {
  aspectRatio: 1280 / 460,
  movable: true,
};

const result = ref<{
  coordinates: any;
  image: any;
}>({
  coordinates: null,
  image: null,
});

const onChange = ({ coordinates, canvas }) => {
  result.value = {
    coordinates,
    image: canvas.toDataURL(),
  };
};

const closeModal = () => {
  const modal = document.getElementById("previewImageCoverModal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
};

const getCroppedResult = () => {
  return result.value;
};

const resizeImage = (dataUrl: string, width: number, height: number) => {
  return new Promise<{
    image: string;
    fileBlob: Blob;
    fileSizeMB: number;
  }>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedImage = canvas.toDataURL();
            const fileSize = blob.size;
            resolve({
              image: resizedImage,
              fileBlob: blob,
              fileSizeMB: fileSize,
            });
          }
        });
      }
    };
    img.src = dataUrl;
  });
};

const crop = async () => {
  const croppedResult = getCroppedResult();
  if (croppedResult.image) {
    const {
      image: resizedImage,
      fileBlob: resizedBlob,
      fileSizeMB,
    } = await resizeImage(croppedResult.image, 1280, 460);
    props.cropPreview(resizedImage, resizedBlob, fileSizeMB);
    closeModal();
  }
};
</script>

<template>
  <div class="preview-image-cover-modal">
    <div
      id="previewImageCoverModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="ModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered bg-blur">
        <div class="modal-content">
          <div class="modal-header no-border">
            <p id="ModalLabel" class="font-body-1">กรุณา Crop รูปที่ต้องการ</p>
          </div>
          <div class="modal-body">
            <div
              class="cropper-container"
              :style="{ width: cropperWidth + 'px' }"
            >
              <cropper
                ref="cropperStencil"
                :src="props.imageCover"
                :stencil-props="stencilProps"
                :default-size="defaultSize"
                @change="onChange"
              />
            </div>
          </div>

          <div class="modal-footer no-border">
            <button
              type="button"
              class="btn btn-outline-third m-r-10 px-4 me-2"
              data-bs-dismiss="modal"
              @click="closeModal"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="btn btn-outline-primary px-4"
              @click="crop"
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="/components/modal/preview/PreviewImageCover.scss"
  lang="scss"
  scoped
></style>
