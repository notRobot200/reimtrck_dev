<template>
  <thead>
    <tr class="bg-gray-100 text-left text-gray-700 text-xs sm:text-sm">
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Tracking ID</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Name</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Principal</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Certification</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Exam Reg Date</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Exam Date</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Cost USD/$</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Cost IDR/Rupiah</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Payment <br> Method/Discount</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Paid By</th>
      <th class="p-3 border-b whitespace-nowrap sticky top-0 bg-gray-100 z-20">Certification</th>
      <th class="p-3 border-b sticky top-0 bg-gray-100 z-20">
        <input 
          type="checkbox"
          @change="$emit('toggle-select-all', $event.target.checked)"
          :checked="isAllSelected"
        />
      </th>
    </tr>
  </thead>
</template>

<script setup>
defineProps({
  isAllSelected: Boolean
});

defineEmits(['toggle-select-all']);
</script>