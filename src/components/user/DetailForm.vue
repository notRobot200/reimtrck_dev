<template>
  <div>
    <!-- Form Input -->
    <form class="space-y-4" @submit.prevent="submitDetail">
      <!-- Tracking ID -->
      <select
        v-model="form.tracking_id"
        required
        class="w-full p-2 border rounded"
      >
        <option disabled value="">--- Select Tracking ID ---</option>

        <option 
          v-for="item in trackingOptions"
          :key="item.tracking_id"
          :value="item.tracking_id"
        >
          {{ item.tracking_id }} — {{ item.name }} ({{ item.certification_name }})
        </option>
      </select>

      <p v-if="statusMsg" :class="statusClass" class="mt-1 text-sm">{{ statusMsg }}</p>

      <!-- Cost Amount IDR -->
      <label class="block text-sm font-medium text-gray-700 mb-1 mt-4">Cost Amount (IDR)</label>
      <input
        v-model.number="form.cost_amount_idr"
        type="number"
        placeholder="Cost Amount (IDR)"
        :required="form.status !== 'FREE' && form.status !== ''"
        :disabled="form.status === 'FREE' || isFormDisabled"
        class="w-full p-2 border rounded"
      />

      <!-- Warning muncul langsung saat input -->
      <p v-if="form.cost_amount_idr && form.cost_amount_idr > 99_000_000" 
        class="text-red-600 text-sm mt-1">
        The cost amount entered exceeds the allowed limit.
      </p>


      <!-- File Upload Sections -->
      <!-- File Upload Sections: tetap ditampilkan semua -->
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Upload Invoice -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload Invoice</label>
          <input 
            type="file" 
            accept=".pdf,.docx" 
            @change="handleInvoiceUpload" 
            class="block w-full" 
            :required="form.status !== 'FREE'" 
            :disabled="form.status === 'FREE' || isFormDisabled" 
            :key="fileKey.invoice"
          />
          <p class="text-xs text-gray-500 mt-1">Supported: PDF (max 5MB)</p>
        </div>

        <!-- Upload Bank Confirmation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload Bank Confirmation</label>
          <input 
            type="file" 
            accept=".pdf,.docx" 
            @change="handleBankUpload" 
            class="block w-full" 
            :required="form.status !== 'FREE'" 
            :disabled="form.status === 'FREE' || isFormDisabled" 
            :key="fileKey.bank"
          />
          <p class="text-xs text-gray-500 mt-1">Supported: PDF (max 5MB)</p>
        </div>

        <!-- Upload Yellow Form -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload Yellow Form</label>
          <input 
            type="file"  
            accept=".pdf,.docx" 
            @change="handleYellowFormUpload" 
            class="block w-full" 
            :required="form.status !== 'FREE'" 
            :disabled="form.status === 'FREE' || isFormDisabled" 
            :key="fileKey.yellowForm"
          />
          <p class="text-xs text-gray-500 mt-1">Supported: PDF (max 5MB)</p>
        </div>

        <!-- Upload Certification Document -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload Certification Document</label>
          <input 
            type="file"  
            accept=".pdf,.docx" 
            @change="handleCertificationUpload" 
            class="block w-full" 
            :disabled="isFormDisabled" 
            :key="fileKey.cert" 
          />
          <p class="text-xs text-gray-500 mt-1">Supported: PDF (max 5MB)</p>
        </div>

      </div>



      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || isFormDisabled || hasFormError || isBusy"
      >
        <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ loading ? "Processing..." : "Submit" }}</span>
      </button>
    </form>

    <!-- Response Message -->
    <p class="mt-4 text-center font-medium" :class="responseClass">{{ responseMsg }}</p>

    <!-- Table Selection Dropdown -->
    <div class="mt-8">
      <label class="block mb-2 font-medium">Select Table:</label>
      <select v-model="selectedTable" class="w-full p-3 border rounded-lg text-base">
        <option value="details">Reimbursement Details</option>
        <option value="success">Successful Reimbursements</option>
      </select>
    </div>

    <!-- Table Section -->
    <div class="mt-4">
      <!-- Reimbursement Details -->
      <div v-if="selectedTable === 'details'">
        <h3 class="text-lg font-bold flex items-center justify-between mb-2">
          <button class="text-sm text-blue-600 hover:underline" @click="showDetails = !showDetails">
            {{ showDetails ? "Hide" : "Show" }}
          </button>
        </h3>
        <div v-if="showDetails">
          <RecordsDetailTable
            :details="details"
            :loading="loadingRecords"
            :is-busy="isBusy"
            @set-busy="isBusy = $event"
            @refresh="fetchDetails"
          />
        </div>
      </div>

      <!-- Successful Reimbursements -->
      <div v-if="selectedTable === 'success'">
        <h3 class="text-lg font-bold flex items-center justify-between mb-2">
          <button class="text-sm text-blue-600 hover:underline" @click="showSuccess = !showSuccess">
            {{ showSuccess ? "Hide" : "Show" }}
          </button>
        </h3>
        <div v-if="showSuccess">
          <RecordsSuccessTable 
            :success-details="successDetails" 
            :loading="loadingSuccess" 
            :is-busy="isBusy"
            @set-busy="isBusy = $event"
          />
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <div class="mt-4 flex justify-start">
      <button
        @click="logout"
        :disabled="isLoggingOut || loading || isBusy"
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
import { ref, computed, onMounted, watch } from "vue";
import RecordsDetailTable from "./RecordsDetailTable.vue";
import RecordsSuccessTable from "./RecordsSuccessTable.vue";
import { useDetailForm } from "../../composables/useDetailForm.js";
import { fetchTrackingIdOptions } from "../../api/index.js";

const {
  form,
  loading,
  loadingRecords,
  loadingSuccess,
  responseMsg,
  responseClass,
  details,
  successDetails,
  handleInvoiceUpload,
  handleBankUpload,
  handleCertificationUpload,
  submitDetail,
  logout,
  isLoggingOut,
  fetchDetails,
  fetchSuccessDetails,
  statusMsg,
  statusClass,
  hasFormError,
  fileKey,
  handleYellowFormUpload  
} = useDetailForm();

// Toggle states
const trackingOptions = ref([]);
const showDetails = ref(true);
const showSuccess = ref(true);
const isBusy = ref(false);

// Dropdown selection
const selectedTable = ref("details");

// Compute if form should be disabled
const isFormDisabled = computed(() => {
  return statusMsg.value === "Tracking ID not found or you do not have access" || form.value.status === '';
});

// Fetch records on mount
onMounted(async () => {
  fetchDetails();
  fetchSuccessDetails();
  trackingOptions.value = await fetchTrackingIdOptions();
});

// Watch dropdown changes
watch(selectedTable, (newTable) => {
  if (newTable === "details") {
    loadingRecords.value = true;
    fetchDetails().finally(() => loadingRecords.value = false);
  } else if (newTable === "success") {
    loadingSuccess.value = true;
    fetchSuccessDetails().finally(() => loadingSuccess.value = false);
  }
});
</script>
