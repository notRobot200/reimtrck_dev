<template>
  <div class="flex gap-2 mb-3">
    <button
      @click="$emit('download-selected')"
      :disabled="selectedRowsCount === 0 || downloadingZip"
      class="px-4 py-2 rounded-xl bg-indigo-600 text-white shadow 
            hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
    >
      <SpinnerIcon v-if="downloadingZip" />
      <span>
        <span v-if="!downloadingZip">Download Selected ({{ selectedRowsCount }})</span>
        <span v-else>Processing...</span>
      </span>
    </button>

    <button
      @click="$emit('download-csv')"
      :disabled="downloadingCSV"
      class="px-4 py-2 rounded-xl bg-green-600 text-white shadow 
            hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
    >
      <SpinnerIcon v-if="downloadingCSV" />
      <span>
        <span v-if="!downloadingCSV">Download as CSV</span>
        <span v-else>Processing...</span>
      </span>
    </button>
  </div>
</template>

<script setup>
import SpinnerIcon from "./SpinnerIcon.vue";

defineProps({
  selectedRowsCount: Number,
  downloadingZip: Boolean,
  downloadingCSV: Boolean
});

defineEmits(['download-selected', 'download-csv']);
</script>