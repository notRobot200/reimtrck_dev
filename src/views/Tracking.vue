<template>
  <div class="relative min-h-screen p-4 sm:p-6 flex justify-center items-start overflow-hidden">
    <BackgroundBlobs />

    <SnowfallEffect :count="30" symbol="❄" />

    <!-- Back Button (hanya jika role > 1) -->
    <button
      v-if="hasMultipleRoles"
      @click="goBack"
      class="absolute top-6 left-6 bg-gray-800/70 hover:bg-gray-800 text-white 
             px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 z-20"
    >
      ← Back
    </button>

    <!-- Tombol Admin Create User -->
    <button
      v-if="currentRole === 'admin'"
      @click="goToAdminCreateUser"
      class="absolute top-6 right-6 bg-green-600 hover:bg-green-700 text-white 
            px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 z-20"
    >
      + Create User
    </button>

    <div 
      :class="[
        'relative z-10 w-full max-w-8xl bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-8 fade-in',
        hasMultipleRoles ? 'mt-20' : 'mt-4'
      ]"
    >
      <DashboardHeader />

      <DashboardFilters
        v-model:selectedName="selectedName"
        v-model:selectedCertType="selectedCertType"
        v-model:selectedPrincipal="selectedPrincipal"
        :names="names"
        :certTypes="certTypes"
        :principals="principals"
        @change="loadData"
      />

      <LoadingSpinner v-if="loading" />

      <DataTable
        v-else
        :data="data"
        :selectedRows="selectedRows"
        :downloadingSingle="downloadingSingle"
        :downloadingZip="downloadingZip"
        :downloadingCSV="downloadingCSV"
        :role="currentRole"              
        @toggle-select-all="toggleSelectAll"
        @download-cert="downloadCert"
        @download-selected="downloadSelected"
        @download-csv="handleDownloadCSV"
        @update:selectedRows="selectedRows = $event"
      />

      <EmptyState v-if="!loading && data.length === 0" />

      <LogoutButton
        :isLoggingOut="isLoggingOut"
        @logout="handleLogout"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";

// API
import { 
  fetchAllNamesOptions, 
  fetchSuccessfulReimbursementsByName, 
  adminDownloadCertification,
  fetchCertificationTypes,
  adminDownloadCertificationsZip,
  downloadFilteredReimbursementsCSV,
  fetchPrincipalsOptions
} from "../api/index.js";

// Components
import BackgroundBlobs from "../components/hr/BackgroundBlobs.vue";
import DashboardHeader from "../components/hr/DashboardHeader.vue";
import DashboardFilters from "../components/hr/DashboardFilters.vue";
import LoadingSpinner from "../components/hr/LoadingSpinner.vue";
import DataTable from "../components/hr/DataTable.vue";
import EmptyState from "../components/hr/EmptyState.vue";
import LogoutButton from "../components/hr/LogoutButton.vue";
import SnowfallEffect from "../components/SnowfallEffect.vue";

const toast = useToast();
const router = useRouter();
const route = useRoute();

// ===============================
// 🔥 Ambil role dari routing
// ===============================
const roles = ref(JSON.parse(localStorage.getItem("roles")) || []);
const currentRole = ref(localStorage.getItem("active_role") || roles.value[0] || "hr");

const isLoggingOut = ref(false);
const downloadingSingle = ref(null);
const downloadingZip = ref(false);
const downloadingCSV = ref(false);

const names = ref([]);
const certTypes = ref([]);
const principals = ref([]);

const selectedRows = ref([]);

const selectedName = ref("All");
const selectedCertType = ref("All");
const selectedPrincipal = ref("All");

const data = ref([]);
const loading = ref(true);

const hasMultipleRoles = computed(() => roles.value.length > 1);

const goBack = () => {
  router.push("/choose-role");
};

const goToAdminCreateUser = () => {
  router.push("/admin/users/create");
};

async function handleLogout() {
  isLoggingOut.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  toast.warning("You have been logged out.");
  router.push("/login");
  isLoggingOut.value = false;
}

async function loadData() {
  loading.value = true;
  selectedRows.value = [];

  try {
    const res = await fetchSuccessfulReimbursementsByName(
      selectedName.value,
      selectedCertType.value,
      selectedPrincipal.value
    );
    data.value = res;
  } catch (err) {
    console.error(err);
    toast.error("Failed to load reimbursements.");
  } finally {
    loading.value = false;
  }
}

async function loadNames() {
  try {
    const res = await fetchAllNamesOptions();
    names.value = ["All", ...res];
  } catch (err) {
    console.error("Failed to load names options:", err);
  }
}

async function loadCertTypes() {
  try {
    const res = await fetchCertificationTypes();
    certTypes.value = ["All", ...res];
  } catch (err) {
    console.error("Failed to load certification types:", err);
  }
}

async function loadPrincipals() {
  try {
    const res = await fetchPrincipalsOptions();
    principals.value = ["All", ...res];
  } catch (err) {
    console.error("Failed to load principals:", err);
  }
}

async function downloadCert(trackingId) {
  try {
    downloadingSingle.value = trackingId;
    await adminDownloadCertification(trackingId);
  } catch (err) {
    console.error(err);
    toast.error("Failed to download certification.");
  } finally {
    downloadingSingle.value = null;
  }
}

async function downloadSelected() {
  const validTrackingIds = data.value
    .filter(i => selectedRows.value.includes(i.tracking_id) && i.has_cert)
    .map(i => i.tracking_id);

  if (validTrackingIds.length === 0) {
    toast.error("No selected items with certification");
    return;
  }

  try {
    downloadingZip.value = true;
    await adminDownloadCertificationsZip(validTrackingIds);
    toast.success("ZIP downloaded successfully!");
  } catch (err) {
    console.error("ZIP download failed:", err);
    toast.error("Failed to download ZIP");
  } finally {
    downloadingZip.value = false;
  }
}

const handleDownloadCSV = async () => {
  try {
    downloadingCSV.value = true;
    await downloadFilteredReimbursementsCSV(
      selectedName.value,
      selectedCertType.value,
      selectedPrincipal.value
    );
  } catch (err) {
    console.error("Error downloading CSV:", err);
    toast.error("Failed to download CSV");
  } finally {
    downloadingCSV.value = false;
  }
};

function toggleSelectAll(checked) {
  if (checked) {
    selectedRows.value = data.value
      .filter(i => i.has_cert)
      .map(i => i.tracking_id);
  } else {
    selectedRows.value = [];
  }
}

onMounted(async () => {
  await loadNames();
  await loadCertTypes();
  await loadPrincipals();
  await loadData();
});
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
