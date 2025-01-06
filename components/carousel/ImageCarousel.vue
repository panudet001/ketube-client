<script setup lang="ts">
const sliderRef = ref(null);

export interface Item {
  name: string;
  imageDesktopURL: string;
  imageIPadURL: string;
  imageMobile: string;
  link: string;
}

defineProps<{
  items: Item[];
  onClickBtn?: () => void;
}>();

onMounted(() => {
  const sliderElement = sliderRef.value;
  $(sliderElement).slick({
    dots: true,
    infinite: true,
    centerMode: true,
    arrows: true,
    variableWidth: true,
    slidesToShow: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  });
});
</script>

<template>
  <div class="image-carousel-component">
    <div ref="sliderRef" class="slider-image">
      <div v-for="(slide, index) in items" :key="index" class="slider-items">
        <NuxtLink v-if="index != 0" :to="slide.link" target="_blank">
          <picture>
            <source
              v-if="slide.imageIPadURL"
              media="(max-width: 680px)"
              :srcset="slide.imageIPadURL"
            />
            <img
              :src="slide.imageDesktopURL"
              class="rounded"
              :alt="slide.name"
            />
          </picture>
        </NuxtLink>
        <NuxtLink
          v-if="index == 0 && onClickBtn"
          :to="slide.link"
          target="_blank"
          @click="onClickBtn()"
        >
          <picture>
            <source
              v-if="slide.imageIPadURL"
              media="(max-width: 680px)"
              :srcset="slide.imageIPadURL"
            />
            <img
              :src="slide.imageDesktopURL"
              class="rounded"
              :alt="slide.name"
            />
          </picture>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style src="/components/carousel/ImageCarousel.scss" lang="scss" scoped></style>
