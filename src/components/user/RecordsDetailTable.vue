<template>
  <div class="mt-8">
    <div class="border border-gray-300 rounded-lg overflow-x-auto">
      <div class="max-h-96 overflow-y-auto">
        <table class="min-w-full text-sm border-collapse">
          <thead class="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th class="border px-4 py-2">ID</th>
              <th class="border px-4 py-2">Name</th>
              <th class="border px-4 py-2">Principal</th>
              <th class="border px-4 py-2">Certification</th>
              <th class="border px-4 py-2 min-w-[130px]">Exam Regist Date</th>
              <th class="border px-4 py-2 min-w-[130px]">Exam Date</th>
              <th class="border px-4 py-2">Cost (USD)</th>
              <th class="border px-4 py-2">Cost (IDR)</th>
              <th class="border px-4 py-2">Payment Method/Discount</th>
              <th class="border px-4 py-2">Paid By</th>
              <th class="border px-4 py-2">Finance Docs</th>
              <th class="border px-4 py-2">Certification Docs</th>
              <th class="border px-4 py-2">Claimed</th>
            </tr>
          </thead>

          <tbody>
            <!-- Spinner -->
            <tr v-if="loading">
              <td colspan="13" class="text-center py-6">
                <div class="flex justify-center items-center space-x-2 text-blue-600">
                  <svg class="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <span>Loading details...</span>
                </div>
              </td>
            </tr>

            <!-- No data -->
            <tr v-else-if="details.length === 0">
              <td colspan="13" class="text-center py-4">No details available</td>
            </tr>

            <!-- Data rows -->
            <tr v-else v-for="(detail, index) in details" :key="index">
              <td class="border px-4 py-2">{{ detail.tracking_id }}</td>
              <td class="border px-4 py-2">{{ detail.name }}</td>
              <td class="border px-4 py-2">{{ detail.principal_name }}</td>
              <td class="border px-4 py-2">{{ detail.certification_name }}</td>
              <td class="border px-4 py-2 min-w-[130px]">{{ formatDate(detail.exam_regist_date) }}</td>
              <td class="border px-4 py-2 min-w-[130px]">{{ formatDate(detail.exam_date) }}</td>
              <td class="border px-4 py-2">{{ formatUSD(detail.cost_amount_usd) }}</td>
              <td class="p-2 border whitespace-nowrap">{{ formatIDR(detail.cost_amount_idr) }}</td>
              <td class="border px-4 py-2">{{ detail.payment_method }}</td>
              <td class="border px-4 py-2">{{ detail.paid_by }}</td>

              <!-- Finance Docs -->
              <td class="border px-4 py-2 text-center">
                <button
                  v-if="detail.has_finance_docs"
                  @click="handleViewFinance(detail.tracking_id)"
                  :disabled="isBusy"
                  class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 items-center justify-center disabled:opacity-50 inline-flex"
                >
                  <svg v-if="downloadingId === detail.tracking_id" class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <span>{{ downloadingId === detail.tracking_id ? "Opening..." : "View" }}</span>
                </button>
                <span v-else class="text-gray-400 italic">No Finance Docs</span>
              </td>

              <!-- Certification Docs -->
              <td class="border px-4 py-2 text-center space-y-2">

                <!-- Download Certification (jika ada) -->
                <button
                  v-if="detail.has_cert_docs"
                  @click="handleDownloadCert(detail.tracking_id)"
                  :disabled="isBusy"
                  class="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50 inline-flex items-center"
                >
                  <svg v-if="downloadingCertId === detail.tracking_id" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke-color="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <span>{{ downloadingCertId === detail.tracking_id ? "Downloading..." : "Download" }}</span>
                </button>

                <!-- UPLOAD CERTIFICATION DOC -->
                <input 
                  type="file"
                  accept=".pdf,.docx"
                  class="hidden"
                  :id="'upload-cert-' + detail.tracking_id"
                  @change="event => handleUploadCert(event, detail.tracking_id)"
                />

                <label 
                  :for="'upload-cert-' + detail.tracking_id"
                  class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer inline-flex items-center justify-center disabled:opacity-50"
                  :class="{ 'pointer-events-none opacity-50': uploadingCertId === detail.tracking_id || isBusy }"
                >

                  <!-- Spinner saat upload -->
                  <svg
                    v-if="uploadingCertId === detail.tracking_id"
                    class="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>

                  <span>
                    {{ uploadingCertId === detail.tracking_id ? "Uploading..." : "Upload" }}
                  </span>

                </label>

              </td>


              <!-- Mark Success -->
              <td class="border px-4 py-2 text-center">
                <button
                  @click="handleMarkSuccess(detail.tracking_id)"
                  :disabled="isBusy"
                  class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 items-center justify-center disabled:opacity-50 inline-flex"
                >
                  <svg v-if="markingId === detail.tracking_id" class="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <span>{{ markingId === detail.tracking_id ? "Marking..." : "Complete" }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDetailForm } from "../../composables/useDetailForm.js";
import { moveReimbursementToSuccessful } from "../../api/index.js";
import { uploadCertification } from "../../api/index.js";

const props = defineProps({
  details: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  isBusy: { type: Boolean, default: false } 
});

// emit event ke parent
const emit = defineEmits(["refresh", "set-busy"]);

// composable → fungsi download sudah siap dengan blob & download
const { viewFinance, downloadCertification } = useDetailForm();

const downloadingId = ref(null);
const downloadingCertId = ref(null);
const markingId = ref(null);
const uploadingCertId = ref(null);


// Finance Download
const handleViewFinance = async (tracking_id) => {
  emit("set-busy", true);
  downloadingId.value = tracking_id;
  try {
    await viewFinance(tracking_id);
  } finally {
    downloadingId.value = null;
    emit("set-busy", false);
  }
};

// Certification Download
const handleDownloadCert = async (tracking_id) => {
  emit("set-busy", true);
  downloadingCertId.value = tracking_id;
  try {
    await downloadCertification(tracking_id);
  } finally {
    downloadingCertId.value = null;
    emit("set-busy", false);
  }
};

const handleUploadCert = async (event, tracking_id) => {
  const file = event.target.files[0];
  if (!file) return;

  emit("set-busy", true);
  uploadingCertId.value = tracking_id;

  try {
    await uploadCertification(tracking_id, file);
    emit("refresh");
  } finally {
    uploadingCertId.value = null;
    emit("set-busy", false);
    event.target.value = null;
  }
};


// Mark Success
const handleMarkSuccess = async (tracking_id) => {
  emit("set-busy", true);
  markingId.value = tracking_id;
  try {
    await moveReimbursementToSuccessful(tracking_id);
    emit("refresh");
  } finally {
    markingId.value = null;
    emit("set-busy", false);
  }
};

// formatters
const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getMonth()];

  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
const formatUSD = (value) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
};
const formatIDR = (value) => {
  if (value == null) return "-";
  return "Rp " + new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(value);
};
</script>