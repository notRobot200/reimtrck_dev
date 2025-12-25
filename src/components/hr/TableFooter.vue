<template>
  <div class="mt-4 p-3 bg-gray-100 rounded-xl flex justify-end gap-6 font-semibold">
    <div>Total USD: ${{ totalUSD.toFixed(2) }}</div>
    <div>Total IDR: {{ formatIDR(totalIDR) }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { formatIDR } from "../../composables/useFormatters.js";

const props = defineProps({
  data: Array
});

const totalUSD = computed(() => 
  props.data.reduce((sum, i) => sum + Number(i.cost_amount_usd || 0), 0)
);

const totalIDR = computed(() => 
  props.data.reduce((sum, i) => sum + Number(i.cost_amount_idr || 0), 0)
);
</script>