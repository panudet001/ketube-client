<script setup lang="ts">
import type { Pagination } from "~/interfaces/responses/partner/video/Video";

const props = defineProps<{
  pagination: Pagination;
  page: number;
  title: string;
  pages: (page: number) => void;
  size: (size: Event) => void;
}>();

const lastPage = props.pagination.lastPage < 5 ? props.pagination.lastPage : 4;
const agoStart = 4;
const agoEnd = props.pagination.lastPage - 3;
const step = ref(1);
const agoLast = ref(0);

function nextStep(val: number) {
  if (val <= agoStart) {
    step.value = 1;
    agoLast.value = 4;
  }
  if (val > agoStart && val !== agoStart && val !== agoEnd) {
    step.value = 2;
    agoLast.value = val + 1;
  }
  if (val >= agoEnd || val === props.pagination.lastPage) {
    step.value = 3;
    agoLast.value = props.pagination.lastPage;
  }
}
</script>
<template>
  <div class="container-pagination">
    <div class="card-pagination">
      <div class="option-item">
        <p class="title font-body-3">แสดง{{ title }}ต่อหน้า</p>
        <select class="form-select" @change="size($event)">
          <option value="30" selected>30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <p class="title font-body-3">
          กำลังแสดง {{ page + 1 }} ถึง {{ Number(pagination.lastPage) }} จาก
          {{ pagination.length }}
          {{ title }}
        </p>
      </div>
      <nav aria-label="Page navigation example">
        <div class="pagination-item">
          <button
            class="page-item card-page m-r-5"
            @click="nextStep(1), pages(0)"
          >
            <p class="page-link">
              <i class="las la-angle-left"></i>
            </p>
          </button>
          <div v-if="step === 1" class="d-flex gap-1">
            <div v-for="val in lastPage" :key="val">
              <button
                :class="
                  page === val - 1
                    ? 'page-item-action card-page'
                    : 'page-item card-page'
                "
                @click="pages(val - 1)"
              >
                <p class="page-link">
                  {{ val }}
                </p>
              </button>
            </div>
            <button
              v-if="pagination.lastPage > 5"
              class="page-item"
              @click="nextStep(5)"
            >
              <p class="page-link">...</p>
            </button>
            <button
              v-if="pagination.lastPage > 5"
              :class="
                page === pagination.lastPage - 1
                  ? 'page-item-action card-page m-r-5'
                  : 'page-item card-page m-r-5'
              "
              @click="
                nextStep(pagination.lastPage - 1),
                  pages(Number(pagination.lastPage) - 1)
              "
            >
              <p class="page-link">
                {{ pagination.lastPage }}
              </p>
            </button>
          </div>
          <div v-if="step === 2">
            <button
              v-if="pagination.lastPage > 5"
              class="page-item m-r-5"
              @click="nextStep(1), pages(0)"
            >
              <p class="page-link">1</p>
            </button>
            <button class="page-item m-r-5" @click="nextStep(agoLast - 3)">
              <p class="page-link">...</p>
            </button>
            <span v-for="val in agoLast" :key="val">
              <button
                v-if="val > agoLast - 2"
                :class="
                  page === val - 1
                    ? 'page-item-action m-r-5'
                    : 'page-item m-r-5'
                "
                @click="pages(val - 1)"
              >
                <p class="page-link">
                  {{ val }}
                </p>
              </button>
            </span>
            <button class="page-item m-r-5" @click="nextStep(agoLast + 1)">
              <p class="page-link">...</p>
            </button>
            <button
              v-if="pagination.lastPage > 5"
              :class="
                page === pagination.lastPage - 1
                  ? 'page-item-action card-page m-r-5'
                  : 'page-item card-page m-r-5'
              "
              @click="
                nextStep(pagination.lastPage), pages(pagination.lastPage - 1)
              "
            >
              <p class="page-link">
                {{ pagination.lastPage }}
              </p>
            </button>
          </div>
          <div v-if="step === 3">
            <button
              v-if="pagination.lastPage > 5"
              class="page-item m-r-5"
              @click="nextStep(1), pages(0)"
            >
              <p class="page-link">1</p>
            </button>
            <button
              v-if="pagination.lastPage > 5"
              class="page-item m-r-5"
              @click="nextStep(agoLast - 5)"
            >
              <p class="page-link">...</p>
            </button>
            <span v-for="val in agoLast" :key="val">
              <button
                v-if="val > agoLast - 4"
                :class="
                  page === val - 1
                    ? 'page-item-action m-r-5'
                    : 'page-item m-r-5'
                "
                @click="pages(val - 1)"
              >
                <p class="page-link">
                  {{ val }}
                </p>
              </button>
            </span>
          </div>

          <button
            class="page-item card-page"
            @click="
              nextStep(pagination.lastPage - 1),
                pages(Number(pagination.lastPage) - 1)
            "
          >
            <p class="page-link">
              <i class="las la-angle-right"></i>
            </p>
          </button>
        </div>
      </nav>
    </div>
    <div class="card-pagination-mobile">
      <div class="option-item">
        <p class="title">แสดง{{ title }}ต่อหน้า</p>
        <select class="form-select" @change="size($event)">
          <option value="30" selected>30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div class="pagination-item">
        <button
          class="page-item card-page m-r-5"
          @click="nextStep(1), pages(0)"
        >
          <p class="page-link">
            <i class="las la-angle-left"></i>
          </p>
        </button>
        <div v-if="step === 1" class="d-flex gap-1">
          <div v-for="val in pagination.lastPage" :key="val">
            <button
              :class="
                page === val - 1
                  ? 'page-item-action card-page'
                  : 'page-item card-page'
              "
              @click="pages(val - 1)"
            >
              <p class="page-link">
                {{ val }}
              </p>
            </button>
          </div>
          <button
            v-if="pagination.lastPage > 5"
            class="page-item"
            @click="nextStep(5)"
          >
            <p class="page-link">...</p>
          </button>
          <button
            v-if="pagination.lastPage > 5"
            :class="
              page === pagination.lastPage - 1
                ? 'page-item-action  m-r-5'
                : 'page-item m-r-5'
            "
            @click="
              nextStep(pagination.lastPage - 1),
                pages(Number(pagination.lastPage) - 1)
            "
          >
            <p class="page-link">
              {{ pagination.lastPage }}
            </p>
          </button>
        </div>
        <div v-if="step === 2">
          <button
            v-if="pagination.lastPage > 5"
            class="page-item m-r-5"
            @click="nextStep(1), pages(0)"
          >
            <p class="page-link">1</p>
          </button>
          <button class="page-item m-r-5" @click="nextStep(agoLast - 3)">
            <p class="page-link">...</p>
          </button>
          <span v-for="val in agoLast" :key="val">
            <button
              v-if="val > agoLast - 2"
              :class="
                page === val - 1 ? 'page-item-action m-r-5' : 'page-item m-r-5'
              "
              @click="pages(val - 1)"
            >
              <p class="page-link">
                {{ val }}
              </p>
            </button>
          </span>
          <button class="page-item m-r-5" @click="nextStep(agoLast + 1)">
            <p class="page-link">...</p>
          </button>
          <button
            v-if="pagination.lastPage > 5"
            class="page-item m-r-5"
            @click="
              nextStep(pagination.lastPage), pages(pagination.lastPage - 1)
            "
          >
            <p class="page-link">
              {{ pagination.lastPage }}
            </p>
          </button>
        </div>
        <div v-if="step === 3">
          <button
            v-if="pagination.lastPage > 5"
            class="page-item m-r-5"
            @click="nextStep(1), pages(0)"
          >
            <p class="page-link">1</p>
          </button>
          <button
            v-if="pagination.lastPage > 5"
            class="page-item m-r-5"
            @click="nextStep(agoLast - 5)"
          >
            <p class="page-link">...</p>
          </button>
          <span v-for="val in agoLast" :key="val">
            <button
              v-if="val > agoLast - 4"
              :class="
                page === val - 1 ? 'page-item-action m-r-5' : 'page-item m-r-5'
              "
              @click="pages(val - 1)"
            >
              <p class="page-link">
                {{ val }}
              </p>
            </button>
          </span>
        </div>

        <button
          class="page-item card-page"
          @click="
            nextStep(pagination.lastPage - 1),
              pages(Number(pagination.lastPage) - 1)
          "
        >
          <p class="page-link">
            <i class="las la-angle-right"></i>
          </p>
        </button>
      </div>
    </div>
  </div>
</template>
<style
  src="/components/pages/partner/table/pagination.scss"
  lang="scss"
  scoped
></style>
