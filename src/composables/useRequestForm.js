import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import {
  fetchReimbursements,
  submitReimbursementRequest,
  fetchNamesOptions,
  fetchPrincipalsOptions,
  fetchPaymentMethodsOptions,
  fetchPaidByOptions,
  fetchCertificationTypesOptions, // ✅ new
} from "../api";

export function useRequestForm() {
  const router = useRouter();
  const toast = useToast();

  // 🧾 Form model
  const form = ref({
    name: localStorage.getItem("full_name") || "",
    principal_name: "",
    certification_name: "",
    certification_type: "",  // ✅ Dropdown now
    exam_regist_date: "",
    exam_date: "",
    cost_amount_usd: null,
    payment_method: "",
    paid_by: "",
    is_free: false,
    is_voucher: false,
  });

  // 🔄 State
  const loading = ref(false);
  const loadingRecords = ref(true);
  const records = ref([]);
  const isLoggingOut = ref(false);

  // 🔽 Dropdown options
  const namesOptions = ref([]);
  const principalsOptions = ref([]);
  const paymentMethodsOptions = ref([]);
  const paidByOptions = ref([]);
  const certificationTypesOptions = ref([]); // ✅ new

  // 📜 Load reimbursement records
  async function loadRecords() {
    loadingRecords.value = true;
    try {
      records.value = await fetchReimbursements();
    } catch (err) {
      console.error("Failed to load reimbursements:", err);
      records.value = [];
      if (err?.status === 401) await logout();
      toast.error("Failed to load reimbursements.");
    } finally {
      loadingRecords.value = false;
    }
  }

  // 🔧 Load dropdown options
  async function loadOptions() {
    try {
      const [names, principals, payments, paidBy, certTypes] = await Promise.all([
        fetchNamesOptions(),
        fetchPrincipalsOptions(),
        fetchPaymentMethodsOptions(),
        fetchPaidByOptions(),
        fetchCertificationTypesOptions(), // ✅ fetch
      ]);

      namesOptions.value = names.map((r) => (typeof r === "string" ? r : r.name));
      principalsOptions.value = principals.map((r) =>
        typeof r === "string" ? r : r.principal_name
      );
      paymentMethodsOptions.value = payments.map((r) =>
        typeof r === "string" ? r : r.method_name
      );
      paidByOptions.value = paidBy.map((r) =>
        typeof r === "string" ? r : r.paid_by_name
      );
      certificationTypesOptions.value = certTypes.map((r) =>
        typeof r === "string" ? r : r.type_name
      ); // ✅ map
    } catch (err) {
      console.error("Failed to load select options:", err);
      toast.error("Failed to load dropdown options.");
    }
  }

  onMounted(() => {
    loadRecords();
    loadOptions();
  });

  // 🚀 Submit reimbursement request
  async function submitRequest() {
    loading.value = true;
    try {
      const payload = { ...form.value, name: localStorage.getItem("full_name") };

      // Jika tidak ada cost, set 0
      if (!payload.cost_amount_usd) {
        payload.cost_amount_usd = 0;
      }

      // 🔥 Convert voucher percent → string "xx%"
      if (payload.is_voucher && payload.payment_method) {
        payload.payment_method = `${payload.payment_method}%`;
      }

      const data = await submitReimbursementRequest(payload);

      if (data.status === "FREE") {
        toast.info("Certification recorded (FREE, no reimbursement needed).");
      } else {
        toast.success(data.message || "Reimbursement request submitted!");
      }

      await loadRecords();

      // Reset form (tetap simpan nama)
      const savedName = form.value.name;
      Object.keys(form.value).forEach((k) => (form.value[k] = ""));
      form.value.name = savedName;
      form.value.is_free = false;
      form.value.is_voucher = false;

    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error connecting to server."
      );
      if (err.response?.status === 401) await logout();
    } finally {
      loading.value = false;
    }
  }

  // 🚪 Logout
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

  // ✅ Return everything to the component
  return {
    form,
    loading,
    loadingRecords,
    records,
    submitRequest,
    logout,
    isLoggingOut,
    namesOptions,
    principalsOptions,
    paymentMethodsOptions,
    paidByOptions,
    certificationTypesOptions, // ✅ return
  };
}
