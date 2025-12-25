<!-- components/SnowfallEffect.vue -->
<template>
  <div class="snowfall-container">
    <div
      v-for="snow in snowflakes"
      :key="snow.id"
      class="snowflake"
      :style="snow.style"
    >
      {{ symbol }}
    </div>
  </div>
</template>

<script setup>
import { useSnowfall } from '../composables/useSnowfall.js';

const props = defineProps({
  count: {
    type: Number,
    default: 20,
  },
  symbol: {
    type: String,
    default: '❄',
  },
  minDuration: {
    type: Number,
    default: 5,
  },
  maxDuration: {
    type: Number,
    default: 15,
  },
  minSize: {
    type: Number,
    default: 0.8,
  },
  maxSize: {
    type: Number,
    default: 1.5,
  },
  minOpacity: {
    type: Number,
    default: 0.6,
  },
  maxOpacity: {
    type: Number,
    default: 1,
  },
});

const { snowflakes } = useSnowfall({
  count: props.count,
  minDuration: props.minDuration,
  maxDuration: props.maxDuration,
  minSize: props.minSize,
  maxSize: props.maxSize,
  minOpacity: props.minOpacity,
  maxOpacity: props.maxOpacity,
});
</script>

<style scoped>
.snowfall-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

.snowflake {
  position: absolute;
  top: -20px;
  color: white;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: fall linear infinite;
  pointer-events: none;
  user-select: none;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
}

@media (max-width: 640px) {
  .snowflake {
    font-size: 0.6rem !important;
  }
}
</style>