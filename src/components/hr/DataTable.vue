<template>
  <div
    class="overflow-x-auto -mx-2 sm:mx-0 bg-white/70 backdrop-blur-md
           border border-gray-200 rounded-2xl shadow"
  >
    <!-- Action Buttons (Download ZIP, CSV, Delete, etc.) -->
    <TableActionButtons
      class="mb-3"
      :selectedRowsCount="selectedRows.length"
      :downloadingZip="downloadingZip"
      :downloadingCSV="downloadingCSV"
      @download-selected="$emit('download-selected')"
      @download-csv="$emit('download-csv')"
    />

    <!-- Table container: Scrollable -->
    <div class="overflow-y-auto max-h-[70vh]">
      <table class="min-w-full text-sm">
        
        <!-- Header -->
        <TableHeader
          :isAllSelected="
            selectedRows.length === data.filter(i => i.has_cert).length &&
            data.filter(i => i.has_cert).length > 0
          "
          @toggle-select-all="handleToggleSelectAll"
        />

        <!-- Rows -->
        <tbody>
          <TableRow
            v-for="item in data"
            :key="item.tracking_id"
            :item="item"
            :isSelected="selectedRows.includes(item.tracking_id)"
            :isDownloading="downloadingSingle === item.tracking_id"
            :disabled="!item.has_cert"
            @download-cert="$emit('download-cert', item.tracking_id)"
            @toggle-selection="toggleRowSelection(item.tracking_id)"
          />
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <TableFooter :data="data" />
  </div>
</template>

<script setup>
import TableActionButtons from "./TableActionButtons.vue";
import TableHeader from "./TableHeader.vue";
import TableRow from "./TableRow.vue";
import TableFooter from "./TableFooter.vue";

/* ===== Props ===== */
const props = defineProps({
  data: { type: Array, required: true },
  selectedRows: { type: Array, required: true },
  downloadingSingle: { type: [String, Number, null], default: null },
  downloadingZip: { type: Boolean, default: false },
  downloadingCSV: { type: Boolean, default: false }
});

/* ===== Emits ===== */
const emit = defineEmits([
  "toggle-select-all",
  "download-cert",
  "download-selected",
  "download-csv",
  "update:selectedRows"
]);

/* ===== Methods ===== */
function handleToggleSelectAll(checked) {
  emit("toggle-select-all", checked);
}

function toggleRowSelection(trackingId) {
  const updated = [...props.selectedRows];
  const index = updated.indexOf(trackingId);

  if (index > -1) {
    updated.splice(index, 1);
  } else {
    updated.push(trackingId);
  }

  emit("update:selectedRows", updated);
}
</script>
