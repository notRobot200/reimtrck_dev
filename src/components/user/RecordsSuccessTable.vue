<template>
  <div class="mt-6">
    <div class="overflow-x-auto border border-gray-300 rounded-lg">
      <div class="max-h-96 overflow-y-auto">
        <table class="min-w-full text-sm border-collapse">
          <thead class="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th class="p-2 border text-left">ID</th>
              <th class="p-2 border text-left">Name</th>
              <th class="p-2 border text-left">Principal</th>
              <th class="p-2 border text-left">Certification</th>
              <th class="p-2 border text-left">Exam Regist Date</th>
              <th class="p-2 border text-left">Exam Date</th>
              <th class="p-2 border text-left">Cost (USD)</th>
              <th class="p-2 border text-left">Cost (IDR)</th>
              <th class="p-2 border text-left">Payment Method/Discount</th>
              <th class="p-2 border text-left">Paid By</th>
              <th class="p-2 border text-left">Moved At</th>
              <th class="p-2 border text-left">Finance Docs</th>
              <th class="p-2 border text-left">Certification Docs</th>
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
                  <span>Loading successful reimbursements...</span>
                </div>
              </td>
            </tr>

            <!-- No data -->
            <tr v-else-if="successDetails.length === 0">
              <td colspan="13" class="text-center py-4 text-gray-500">
                No successful reimbursements found.
              </td>
            </tr>

            <!-- Data rows -->
            <tr v-else v-for="item in localSuccess" :key="item.tracking_id" class="hover:bg-gray-100">
              <td class="p-2 border whitespace-nowrap">{{ item.tracking_id }}</td>
              <td class="p-2 border whitespace-nowrap">{{ item.name }}</td>
              <td class="p-2 border whitespace-nowrap">{{ item.principal_name }}</td>
              <td class="p-2 border whitespace-nowrap">{{ item.certification_name }}</td>
              <td class="p-2 border whitespace-nowrap">{{ formatDate(item.exam_regist_date) }}</td>
              <td class="p-2 border whitespace-nowrap">{{ formatDate(item.exam_date) }}</td>
              <td class="p-2 border whitespace-nowrap">{{ formatUSD(item.cost_amount_usd) }}</td>
              <td class="p-2 border whitespace-nowrap">{{ formatIDR(item.cost_amount_idr) }}</td>
              <td class="p-2 border whitespace-nowrap">{{ item.payment_method }}</td>
              <td class="p-2 border whitespace-nowrap">{{ item.paid_by }}</td>
              <td class="p-2 border whitespace-nowrap">{{ formatDate(item.moved_at) }}</td>

              <!-- Finance Docs -->
              <td class="p-2 border text-center">
                <!-- Tampilkan tombol hanya kalau status ≠ free -->
                <button
                  v-if="item.status !== 'FREE'"
                  @click="handleViewFinance(item.tracking_id)"
                  :disabled="isBusy"
                  class="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center justify-center disabled:opacity-50"
                >
                  <svg
                    v-if="downloadingId === item.tracking_id"
                    class="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>{{ downloadingId === item.tracking_id ? "Opening..." : "View" }}</span>
                </button>

                <!-- Kalau status free, ganti teks abu-abu -->
                <span v-else class="text-gray-400 italic">No Finance Docs</span>
              </td>

              <td class="p-2 border text-center space-y-2">

                <!-- Kalau ADA certificate -->
                <button
                  v-if="item.hasCertificate"
                  @click="handleDownloadCert(item.tracking_id)"
                  :disabled="isBusy || uploadingId === item.tracking_id"
                  class="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 flex items-center justify-center disabled:opacity-50"
                >
                  <svg
                    v-if="downloadingCertId === item.tracking_id"
                    class="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  <span>{{ downloadingCertId === item.tracking_id ? "Downloading..." : "Download" }}</span>
                </button>

                <!-- Upload button tetap -->
                <input
                  type="file"
                  accept=".pdf,.docx"
                  class="hidden"
                  :id="'upload-cert-' + item.tracking_id"
                  @change="event => handleUploadCert(event, item.tracking_id)"
                />

                <label
                  :for="'upload-cert-' + item.tracking_id"
                  class="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center justify-center cursor-pointer disabled:opacity-50"
                  :class="{ 'opacity-50 cursor-not-allowed': isBusy || uploadingId === item.tracking_id }"
                >
                  <svg
                    v-if="uploadingId === item.tracking_id"
                    class="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>

                  <span>{{ uploadingId === item.tracking_id ? "Uploading..." : "Upload" }}</span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { viewFinanceDocs, downloadCertificationDocs } from "../../api/index.js";

const props = defineProps({
  loading: { type: Boolean, default: false },
  isBusy: { type: Boolean, default: false },
  successDetails: { type: Array, required: true },
});

// buat local reactive copy
const localSuccess = ref([]);

const emit = defineEmits(["set-busy"]);

const downloadingId = ref(null);
const downloadingCertId = ref(null);
const uploadingId = ref(null);

// Format functions
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
const formatUSD = (value) => value != null ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value) : "-";
const formatIDR = (value) => {
  if (value == null) return "-";
  return "Rp " + new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(value);
};

const handleViewFinance = async (tracking_id) => {
  emit("set-busy", true);
  downloadingId.value = tracking_id;

  try {
    const blob = await viewFinanceDocs(tracking_id);
    const url = URL.createObjectURL(blob);

    // Buka file di tab baru (VIEW ONLY)
    window.open(url, "_blank");

    // Tidak revoke langsung supaya file tetap bisa dibuka
    setTimeout(() => URL.revokeObjectURL(url), 20000);

  } catch (err) {
    console.error(err);
    alert("Failed to open finance docs");
  } finally {
    downloadingId.value = null;
    emit("set-busy", false);
  }
};

const handleDownloadCert = async (tracking_id) => {
  emit("set-busy", true);
  downloadingCertId.value = tracking_id;
  try {
    const blob = await downloadCertificationDocs(tracking_id);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `certification_docs_${tracking_id}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error(err);
    alert("Failed to download certification docs");
  } finally {
    downloadingCertId.value = null;
    emit("set-busy", false);
  }
};

import { uploadCertification, checkCertificateExists } from "../../api/index.js";

const handleUploadCert = async (event, tracking_id) => {
  const file = event.target.files[0];
  if (!file) return;

  emit("set-busy", true);
  uploadingId.value = tracking_id;

  try {
    await uploadCertification(tracking_id, file);

    // Update reactive supaya tombol download langsung muncul
    const row = localSuccess.value.find(i => i.tracking_id === tracking_id);
    if (row) {
      row.hasCertificate = true;
    }

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  } finally {
    uploadingId.value = null;
    emit("set-busy", false);
    event.target.value = null;
  }
};

// Cek certificate untuk semua row
const checkAllCertificates = async () => {
  for (let item of localSuccess.value) {
    try {
      const res = await checkCertificateExists(item.tracking_id);
      item.hasCertificate = res.exists; // reactive sekarang
    } catch (err) {
      item.hasCertificate = false;
    }
  }
};
watch(
  () => props.successDetails,
  (newVal) => {
    localSuccess.value = newVal.map(item => ({ ...item }));
    checkAllCertificates();
  },
  { immediate: true }
);
</script>

