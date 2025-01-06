<script setup lang="ts">
import moment from "moment";
import { useTicketRequestStore } from "~/store/useTicketRequestPageStore.js";
import { environment } from "~/services/environments";
import { useUserStore } from "~/store/useUserStore";

definePageMeta({
  layout: "custom",
});

const route = useRoute();
const queryIdParam = route.params.id.toString();

// Store
const ticketPartnerStore = useTicketRequestStore();
const userStore = useUserStore();

// SSR CALL API
await useAsyncData(() => ticketPartnerStore.getById(queryIdParam));
await useAsyncData(() => userStore.get());

const urlImage = environment.urlApiImg + "/ticket/";

const menu = [
  { menu: userStore.user?.name, link: "/profile" },
  { menu: "Ticket Request", link: "/partner/ticket-request" },
  {
    menu: "Request Detail",
    link: `/partner/ticket-request/detail/${queryIdParam}`,
  },
];
const typeFile = (val: string) => {
  const split = val.split(".");
  return split[1].toUpperCase();
};
</script>
<template>
  <div class="detail-ticket-request-page">
    <div class="wrapper-content">
      <h4>Request Detail</h4>
      <BreadcrumbMenu :list="menu"></BreadcrumbMenu>

      <div class="section-ticket-request">
        <div class="title-action">
          <p>รายละเอียดคำขอ</p>
          <NuxtLink
            :to="
              '/partner/ticket-request/edit/' + ticketPartnerStore.ticket?.id
            "
            class="btn-edit-member"
            ><i class="las la-edit icon-edit"></i> แก้ไข</NuxtLink
          >
        </div>
        <hr />
        <div class="mb-3 row">
          <label for="title" class="col-lg-2 col-form-label">สถานะคำขอ </label>
          <div class="col-lg-10 d-flex align-items-center">
            <StatusPartnerCard
              :status="ticketPartnerStore.ticket?.status"
            ></StatusPartnerCard>
          </div>
        </div>
        <div class="mb-3 row">
          <label for="title" class="col-lg-2 col-form-label">ชื่อหัวข้อ </label>
          <div class="col-lg-10 d-flex align-items-center">
            <p>{{ ticketPartnerStore.ticket?.title }}</p>
          </div>
        </div>
        <div class="mb-3 row">
          <label for="description" class="col-lg-2 col-form-label"
            >รายละเอียด
          </label>
          <div class="col-lg-10 d-flex align-items-center">
            <p
              id="playlist-description"
              v-html="ticketPartnerStore.ticket?.description"
            ></p>
          </div>
        </div>
        <div class="mb-3 row">
          <label for="description" class="col-lg-2 col-form-label"
            >ไฟล์ที่อัปโหลด
          </label>
          <div class="col-lg-10">
            <div
              v-for="(val, index) in ticketPartnerStore.ticket?.file"
              :key="index"
              class="card-image"
            >
              <div class="image-item">
                <i class="las la-file-alt cover-icon"></i>
                <div class="line"></div>
                <div class="detail-item">
                  <p class="font-body-3 text-silver">
                    Type File : {{ typeFile(val.file) }}
                  </p>
                </div>
              </div>
              <a :href="urlImage + val.file" target="_blank">
                <i class="las la-eye icon-del"></i>
              </a>
            </div>
            <div class="form-control-rounded-normal card-no-image d-none">
              <i class="las la-file-upload icon-up"></i>
              <p class="font-body-2">click to upload</p>
              <p class="font-body-3 text-silver">
                Only JPEG and PNG files with max size of 1 MB
              </p>
            </div>
          </div>
        </div>
        <div class="mb-3 row">
          <label for="title" class="col-lg-2 col-form-label"
            >วันที่ส่งคำขอ
          </label>
          <div class="col-lg-10 d-flex align-items-center">
            <p>
              {{
                moment(ticketPartnerStore.ticket?.createdAt).format(
                  "DD/MM/yyyy, hh:mm",
                )
              }}
            </p>
          </div>
        </div>
        <div class="mb-3 row">
          <label for="title" class="col-lg-2 col-form-label">ส่งคำขอโดย </label>
          <div class="col-lg-10 d-flex align-items-center">
            <p class="title-request-by">
              {{ ticketPartnerStore.ticket?.createdBy.firstname }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/partner/ticket-request/detail/detail-ticket-request.scss"
  lang="scss"
  scoped
></style>
