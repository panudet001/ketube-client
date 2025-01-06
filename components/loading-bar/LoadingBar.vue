<script setup>
const props = defineProps({
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2000,
  },
  height: {
    type: Number,
    default: 3,
  },
});
// Options & Data
const data = reactive({
  percent: 0,
  show: false,
  canSucceed: true,
});
// Local variables
let _timer = null;
let _throttle = null;
let _cut;

const increase = (num) => {
  data.percent = Math.min(100, Math.floor(data.percent + num));
};
// Functions
const clear = () => {
  _timer && clearInterval(_timer);
  _throttle && clearTimeout(_throttle);
  _timer = null;
};

const startTimer = () => {
  data.show = true;
  _cut = 10000 / Math.floor(props.duration);
  _timer = setInterval(() => {
    increase(_cut);
  }, 100);
};

const hide = () => {
  clear();
  setTimeout(() => {
    data.show = false;
    setTimeout(() => {
      data.percent = 0;
    }, 400);
  }, 500);
};

const start = () => {
  clear();
  data.percent = 0;
  data.canSucceed = true;

  if (props.throttle) {
    _throttle = setTimeout(startTimer, props.throttle);
  } else {
    startTimer();
  }
};

const finish = () => {
  data.percent = 100;
  hide();
};

// Hooks
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:start", start);
nuxtApp.hook("page:finish", finish);

onBeforeUnmount(() => clear);
</script>

<template>
  <div class="loading-bar-component">
    <div
      class="nuxt-progress"
      :class="{
        'nuxt-progress-failed': !data.canSucceed,
      }"
      :style="{
        width: data.percent + '%',
        left: data.left,
        height: props.height + 'px',
        opacity: 1,
        backgroundSize: (100 / data.percent) * 100 + '% auto',
      }"
    />
  </div>
</template>

<style src="/components/loading-bar/LoadingBar.scss" lang="scss" scoped></style>
