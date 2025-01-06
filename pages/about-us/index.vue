<script setup lang="ts">
import { useAboutUsPageStore } from "~/store/useAboutUsPageStore";

const aboutUsPageStore = useAboutUsPageStore();
await useAsyncData(() => aboutUsPageStore.get());

useHead({
  title: "เกี่ยวกับเรา",
});
</script>
<template>
  <div class="about-us-page">
    <CoverInfo
      page-name="เกี่ยวกับเรา"
      :title="aboutUsPageStore.aboutUsData.title_1"
      :description="aboutUsPageStore.aboutUsData.content_1"
    />
    <div class="section-experience">
      <div class="wrapper-full">
        <div class="wrapper-content">
          <h3 class="title-experience text-start">
            {{ aboutUsPageStore.aboutUsData.title_2 }}
          </h3>
          <p class="description">
            {{ aboutUsPageStore.aboutUsData.content_2 }}
          </p>
        </div>
      </div>
    </div>

    <div class="section-story">
      <CoverInfo
        page-name="Our Story"
        :title="aboutUsPageStore.aboutUsData.title_3"
        :description="aboutUsPageStore.aboutUsData.content_3"
      />
    </div>

    <div class="section-image">
      <div class="wrapper-full">
        <img
          :src="aboutUsPageStore.aboutUsData.imagePath"
          alt="cover-image"
          class="cover-image"
        />
      </div>
    </div>

    <div class="section-mission">
      <CoverInfo
        page-name="Our Mission"
        :title="aboutUsPageStore.aboutUsData.title_4"
        :description="aboutUsPageStore.aboutUsData.content_4"
      />
    </div>

    <div class="section-partner">
      <div class="wrapper-full">
        <div class="wrapper-content">
          <h4 class="title-partner">Our Partner</h4>
          <div class="image-partner">
            <img
              v-for="(item, index) in aboutUsPageStore.aboutUsData?.partners"
              :key="index"
              :src="item.image"
              :alt="item.name"
              class="partner-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style
  src="assets/scss/pages/about-us/about-us.scss"
  lang="scss"
  scoped
></style>
