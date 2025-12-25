<template>
  <div>
    <form class="space-y-4" @submit.prevent="submitRequest">

      <!-- Name -->
      <input
        v-model="form.name"
        type="text"
        readonly
        class="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
      />

      <!-- Principal -->
      <select v-model="form.principal_name" required class="w-full p-2 border rounded">
        <option disabled value="">-- Select Principal --</option>
        <option v-for="principal in principalsOptions" :key="principal" :value="principal">
          {{ principal }}
        </option>
      </select>

      <!-- Certification -->
      <input
        v-model="form.certification_name"
        type="text"
        placeholder="Certification Name"
        required
        class="w-full p-2 border rounded"
      />

      <!-- Certification Type Dropdown -->
      <select 
        v-model="form.certification_type" 
        required 
        class="w-full p-2 border rounded"
      >
        <option disabled value="">-- Select Certification Type --</option>
        <option 
          v-for="type in certificationTypesOptions" 
          :key="type" 
          :value="type"
        >
          {{ type }}
        </option>
      </select>


      <!-- Exam Registration Date -->
      <label class="block text-sm text-gray-600">Exam Registration Date</label>
      <input v-model="form.exam_regist_date" type="date" required class="w-full p-2 border rounded" />

      <!-- Free & Voucher -->
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <input id="is_free" type="checkbox" v-model="form.is_free" class="h-4 w-4" />
          <label for="is_free" class="text-sm text-gray-700">Free Certification</label>
        </div>
        <div class="flex items-center space-x-2">
          <input id="is_voucher" type="checkbox" v-model="form.is_voucher" class="h-4 w-4" />
          <label for="is_voucher" class="text-sm text-gray-700">Voucher Certification</label>
        </div>
      </div>

      <!-- Cost USD -->
      <input
        v-model.number="form.cost_amount_usd"
        type="number"
        min="0"
        step="0.01"
        placeholder="Cost Amount (USD)"
        class="w-full p-2 border rounded"
        :disabled="form.is_free"
        :required="!form.is_free"
      />

      <!-- Exam Date -->
      <label class="block text-sm text-gray-600">Exam Date</label>
      <input v-model="form.exam_date" type="date" required class="w-full p-2 border rounded" />

      <!-- Payment Method -->
      <div v-if="!form.is_voucher">
        <select 
          v-model="form.payment_method" 
          class="w-full p-2 border rounded bg-gray-50"
          :disabled="form.is_free"
          :required="!form.is_free"
        >
          <option disabled value="">-- Select Payment Method --</option>
          <option v-for="method in paymentMethodsOptions" :key="method" :value="method">
            {{ method }}
          </option>
        </select>
      </div>

      <!-- Voucher Coverage Input -->
      <div v-else>
        <label class="block text-sm text-gray-600">Voucher Coverage (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          v-model.number="form.payment_method"
          placeholder="Enter coverage e.g. 100, 90, 85"
          class="w-full p-2 border rounded"
        />
        <p v-if="form.payment_method" class="text-sm text-gray-500 mt-1">
          Coverage: {{ form.payment_method }}%
        </p>
      </div>

      <!-- Paid By -->
      <select 
        v-model="form.paid_by" 
        class="w-full p-2 border rounded bg-gray-50"
        :disabled="form.is_free"
        :required="!form.is_free"
      >
        <option disabled value="">-- Select Paid By --</option>
        <option v-for="paid in paidByOptions" :key="paid" :value="paid">
          {{ paid }}
        </option>
      </select>

      <!-- Submit -->
      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || (form.is_free && form.is_voucher)"
      >
        <svg
          v-if="loading"
          class="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ loading ? "Processing..." : "Submit" }}</span>
      </button>
    </form>

    <p class="mt-4 text-center font-medium" :class="responseClass">{{ responseMsg }}</p>

    <RecordsTable :records="records" :loading="loadingRecords" :currentUserName="form.name" />

    <div class="mt-4 flex justify-start">
      <button
        @click="logout"
        :disabled="isLoggingOut || loading"
        class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="isLoggingOut" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ isLoggingOut ? "Logging Out..." : "Logout" }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import RecordsTable from "./RecordsTable.vue";
import { useRequestForm } from "../../composables/useRequestForm.js";
import { watch } from "vue";

const {
  form,
  loading,
  loadingRecords,
  responseMsg,
  responseClass,
  records,
  submitRequest,
  logout,
  isLoggingOut,
  principalsOptions,
  paymentMethodsOptions,
  paidByOptions,
  certificationTypesOptions
} = useRequestForm();

// 🔄 Free watcher
watch(() => form.is_free, (newVal) => {
  if (newVal) {
    form.is_voucher = false;
    form.cost_amount_usd = 0;
    form.payment_method = "Free";
    form.paid_by = "N/A";
  } else if (!form.is_voucher) {
    form.cost_amount_usd = "";
    form.payment_method = "";
    form.paid_by = "";
  }
});

// 🔄 Voucher watcher
watch(() => form.is_voucher, (newVal) => {
  if (newVal) {
    form.is_free = false;
    form.cost_amount_usd = "";     
    form.payment_method = "";      
    form.paid_by = "";             
  } else if (!form.is_free) {
    form.cost_amount_usd = "";
    form.payment_method = "";
    form.paid_by = "";
  }
});
</script>
