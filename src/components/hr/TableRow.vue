<template>
  <tr class="hover:bg-indigo-50/60 transition">
    <td class="p-3 border-b">{{ item.tracking_id }}</td>
    <td class="p-3 border-b max-w-[150px]">{{ item.name }}</td>
    <td class="p-3 border-b max-w-[150px]">{{ item.principal_name }}</td>
    <td class="p-3 border-b whitespace-normal break-words max-w-[180px]">{{ item.certification_name }}</td>
    <td class="p-3 border-b">{{ formatDate(item.exam_regist_date) }}</td>
    <td class="p-3 border-b">{{ formatDate(item.exam_date) }}</td>
    <td class="p-3 border-b">${{ item.cost_amount_usd }}</td>
    <td class="p-3 border-b">{{ formatIDR(item.cost_amount_idr) }}</td>
    <td class="p-3 border-b">{{ item.payment_method }}</td>
    <td class="p-3 border-b">{{ item.paid_by }}</td>
    <td class="p-3 border-b">
      <template v-if="item.has_cert">
        <button
          @click="$emit('download-cert')"
          class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs shadow 
                hover:bg-indigo-700 active:scale-95 transition flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isDownloading"
        >
          <SpinnerIcon v-if="isDownloading" class="h-4 w-4" />
          <span>
            <span v-if="!isDownloading">Download</span>
            <span v-else>Loading...</span>
          </span>
        </button>
      </template>
      <template v-else>
        <span class="text-gray-400 text-xs">No file</span>
      </template>
    </td>
    <td class="p-3 border-b">
      <input
        type="checkbox"
        :checked="isSelected"
        @change="$emit('toggle-selection')"
        :disabled="!item.has_cert"
        class="h-4 w-4"
        :class="{
          'opacity-40 cursor-not-allowed': !item.has_cert
        }"
      />
    </td>
  </tr>
</template>

<script setup>
import SpinnerIcon from "./SpinnerIcon.vue";
import { formatDate, formatIDR } from "../../composables/useFormatters.js";

defineProps({
  item: Object,
  isSelected: Boolean,
  isDownloading: Boolean
});

defineEmits(['download-cert', 'toggle-selection']);
</script>