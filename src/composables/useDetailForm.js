// src/composables/useDetailForm.js
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { 
  fetchReimbursementDetails, 
  fetchSuccessfulReimbursements,
  submitReimbursementDetail, 
  viewFinanceDocs,
  downloadCertificationDocs,
  fetchStatusByTrackingId,  
  uploadCertification,
} from "../api";

export function useDetailForm() {
  const router = useRouter();
  const toast = useToast();

  // -------------------------
  // State
  // -------------------------
  const form = ref({
    tracking_id: "",
    cost_amount_idr: null,
    files_invoice: [],
    files_bank: [],
    files_certification: [],
    files_yellow_form: [],
    status: null,
  });

  const loading = ref(false);
  const loadingRecords = ref(true);
  const loadingSuccess = ref(false);
  const loadingDownload = ref(false);
  const loadingDownloadCert = ref(false);
  const isLoggingOut = ref(false);

  const details = ref([]);
  const successDetails = ref([]);
  const statusMsg = ref("");
  const statusClass = ref("");

  const fileKey = ref({
    invoice: Date.now(),
    bank: Date.now() + 1,
    cert: Date.now() + 2,
    yellowForm: Date.now() + 3,
  });

  // -------------------------
  // Validation errors
  // -------------------------
  const hasFormError = computed(() => {
    const trackingError = statusMsg.value === "Tracking ID not found or you do not have access"
      || statusClass.value === "text-red-600";

    const costError = form.value.status !== "FREE" 
      && form.value.cost_amount_idr 
      && Number(form.value.cost_amount_idr) > 99_000_000;

    return trackingError || costError;
  });

  // -------------------------
  // Helpers
  // -------------------------
  function resetForm() {
    form.value = {
      tracking_id: null,
      cost_amount_idr: null,
      files_invoice: [],
      files_bank: [],
      files_certification: [],
      files_yellow_form: [],
      status: null,
    };
    statusMsg.value = "";
    statusClass.value = "";
  }

  function validateAndSetFiles(e, targetField) {
    const files = e.target.files;
    for (let f of files) {
      if (f.size > 5 * 1024 * 1024) {
        toast.warning("File too large (maximum 5MB).");
        return;
      }
    }
    form.value[targetField] = files;
  }

  // -------------------------
  // Load data
  // -------------------------
  async function loadRecords() {
    loadingRecords.value = true;
    try {
      details.value = await fetchReimbursementDetails();
    } catch (err) {
      console.error("Failed to load records:", err);
      details.value = [];
      toast.error("Failed to load reimbursement records.");
    } finally {
      loadingRecords.value = false;
    }
  }

  async function loadSuccessful() {
    loadingSuccess.value = true;
    try {
      successDetails.value = await fetchSuccessfulReimbursements();
    } catch (err) {
      console.error("Failed to load successful reimbursements:", err);
      successDetails.value = [];
      toast.error("Failed to load successful reimbursements.");
    } finally {
      loadingSuccess.value = false;
    }
  }

  async function fetchDetails() {
    await loadRecords();
  }

  async function fetchSuccessDetails() {
    await loadSuccessful();
  }

  onMounted(() => {
    loadRecords();
    loadSuccessful();
  });

  // -------------------------
  // Tracking ID check
  // -------------------------
  async function checkTrackingId(trackingId) {
    if (!trackingId) {
      form.value.status = null;
      statusMsg.value = "";
      statusClass.value = "";
      return;
    }

    try {
      const res = await fetchStatusByTrackingId(trackingId);

      if (res.valid) {
        form.value.status = res.status;
        statusMsg.value = `Status: ${res.status}`;
        statusClass.value = "text-green-600";
      } else {
        form.value.status = null;
        statusMsg.value = res.message || "Invalid tracking ID";
        statusClass.value = "text-red-600";
      }
    } catch (err) {
      form.value.status = null;
      statusMsg.value = err.message || "Server error. Please try again later.";
      statusClass.value = "text-red-600";
    }
  }


  watch(() => form.value.tracking_id, checkTrackingId);

  // -------------------------
  // Submit Detail form
  // -------------------------
  async function submitDetail() {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append("tracking_id", form.value.tracking_id);

      if (form.value.status === "FREE") {
        for (let f of form.value.files_certification) {
          formData.append("files_certification", f);
        }
      } else {
        formData.append("cost_amount_idr", form.value.cost_amount_idr);
        for (let f of form.value.files_invoice) {
          formData.append("files_invoice", f);
        }
        for (let f of form.value.files_bank) {
          formData.append("files_bank", f);
        }
        for (let f of form.value.files_certification) {
          formData.append("files_certification", f);
        }
        for (let f of form.value.files_yellow_form) { // <-- baru
          formData.append("files_yellow_form", f);
        }
      }

      const data = await submitReimbursementDetail(formData);
      toast.success(data.message || "Reimbursement submitted successfully!");

      await loadRecords();
      resetForm();
      fileKey.value = {
        invoice: Date.now(),
        bank: Date.now() + 1,
        cert: Date.now() + 2,
        yellowForm: Date.now() + 3,
      };
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error connecting to server.");
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // VIEW Finance Docs (Open only)
  // -------------------------
  async function viewFinance(tracking_id) {
    loadingDownload.value = true;
    try {
      const blob = await viewFinanceDocs(tracking_id); // masih pakai API yang sama
      const url = window.URL.createObjectURL(blob);

      // buka di tab baru
      window.open(url, "_blank");

      // jangan tampilkan toast "downloaded"
      toast.info("Opening finance document...");
    } catch (err) {
      console.error(err);
      toast.error("Unable to open finance document.");
    } finally {
      loadingDownload.value = false;
    }
  }

  async function downloadCertification(tracking_id) {
    loadingDownloadCert.value = true;
    try {
      const blob = await downloadCertificationDocs(tracking_id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certification_${tracking_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Certification document downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while downloading the certification file.");
    } finally {
      loadingDownloadCert.value = false;
    }
  }

  // -------------------------
  // Logout
  // -------------------------
  async function logout() {
    isLoggingOut.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.removeItem("token");
      localStorage.removeItem("full_name");
      toast.warning("You have been logged out.");
      router.push("/login");
    } finally {
      isLoggingOut.value = false;
    }
  }

  return {
    // state
    form,
    loading,
    loadingRecords,
    loadingSuccess,
    loadingDownload,
    loadingDownloadCert,
    isLoggingOut,
    details,
    successDetails,
    statusMsg,
    statusClass,
    hasFormError,
    fileKey,

    // methods
    handleInvoiceUpload: (e) => validateAndSetFiles(e, "files_invoice"),
    handleBankUpload: (e) => validateAndSetFiles(e, "files_bank"),
    handleCertificationUpload: (e) => validateAndSetFiles(e, "files_certification"),
    handleYellowFormUpload: (e) => validateAndSetFiles(e, "files_yellow_form"),
    submitDetail,
    viewFinance,
    downloadCertification,
    logout,
    fetchDetails,
    fetchSuccessDetails,
    uploadCertification,
  };
}
