<template>
  <div class="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

    <!-- Name -->
    <div class="flex flex-col">
      <label class="text-sm font-semibold text-gray-700 mb-1">Name</label>
      <select
        :value="selectedName"
        @change="$emit('update:selectedName', $event.target.value); $emit('change')"
        class="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
               focus:bg-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
      >
        <option v-for="n in names" :key="n" :value="n">
          {{ n }}
        </option>
      </select>
    </div>

    <!-- Certification Type -->
    <div class="flex flex-col">
      <label class="text-sm font-semibold text-gray-700 mb-1">Certification Type</label>
      <select
        :value="selectedCertType"
        @change="$emit('update:selectedCertType', $event.target.value); $emit('change')"
        class="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
               focus:bg-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
      >
        <option v-for="c in certTypes" :key="c" :value="c">
          {{ c }}
        </option>
      </select>
    </div>

    <!-- Principal -->
    <div class="flex flex-col">
      <label class="text-sm font-semibold text-gray-700 mb-1">Principal</label>
      <select
        :value="selectedPrincipal"
        @change="$emit('update:selectedPrincipal', $event.target.value); $emit('change')"
        class="px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
               focus:bg-white focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
      >
        <option v-for="p in principals" :key="p" :value="p">
          {{ p }}
        </option>
      </select>
    </div>

  </div>
</template>

<script setup>
defineProps({
  selectedName: String,
  selectedCertType: String,
  selectedPrincipal: String,
  names: Array,
  certTypes: Array,
  principals: Array
});

defineEmits([
  "update:selectedName",
  "update:selectedCertType",
  "update:selectedPrincipal",
  "change"
]);
</script>
