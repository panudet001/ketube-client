<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Chart } from "chart.js/auto";

const props = defineProps<{
  chartData: {
    type: Object;
    required: true;
  };
}>();

onMounted(() => {
  if (props.chartData) {
    renderChart();
  }
});

const chart = ref<Chart>();
const chartCanvas = ref<HTMLCanvasElement>();

function renderChart() {
  const ctx = chartCanvas.value?.getContext("2d");
  if (ctx) {
    Chart.defaults.font.family = "SukhumvitSet";

    chart.value = new Chart(ctx, {
      type: "line",
      data: props.chartData,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#B2B8B8",
            },
          },
          y: {
            ticks: {
              color: "#B2B8B8",
            },
            grid: {
              display: true,
              color: "rgba(249 249 249 / 20%)",
            },
          },
        },
      },
    });
  }
}

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>
<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
