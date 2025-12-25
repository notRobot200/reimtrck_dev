// src/api/index.js


import axios from "axios";

// Base API Config
const api = axios.create({
  baseURL: "https://reim-track-826572489341.us-central1.run.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// Interceptors: attach token automatically
// ==========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================
// Auth: Login
// ==========================
export async function login(username, password) {
  const res = await api.post("/auth/login", { username, password });
  return res.data; // token, full_name, role, dll.
}

// ==========================
// Register User
// ==========================
export async function registerUser(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

// ==========================
// Forgot Password
// ==========================
export async function forgotPassword(email) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data; // { message: "..." }
}

// ==========================
// Reset Password
// ==========================
export async function resetPassword(token, newPassword) {
  const res = await api.post("/auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return res.data;
}

// ==========================
// Fetch reimbursements
// ==========================
export async function fetchReimbursements() {
  const res = await api.get("/reimburse/");
  return res.data;
}

export async function fetchReimbursementDetails() {
  const res = await api.get("/reimburse_detail");
  return res.data;
}

export async function fetchSuccessfulReimbursements() {
  const res = await api.get("/reimburse_detail/success");
  return res.data;
}

// ==========================
// Fetch all successful reimbursements (HR ONLY)
// ==========================
export async function fetchAllSuccessfulReimbursements() {
  const res = await api.get("/reimburse_detail/all_success");
  return res.data;
}

export async function fetchSuccessfulReimbursementsByName(name, certType, principal) {
  const params = {};

  if (name !== "All") params.name = name;
  if (certType !== "All") params.cert_type = certType;
  if (principal !== "All") params.principal = principal;

  const res = await api.get("/filter", { params });
  return res.data;
}


// ==========================
// Submit reimbursements
// ==========================
export async function submitReimbursementRequest(payload) {
  const payloadWithName = {
    ...payload,
    name: localStorage.getItem("full_name"),
  };
  const res = await api.post("/reimburse/", payloadWithName);
  return res.data;
}

export async function submitReimbursementDetail(formData) {
  const res = await api.post("/reimburse_detail", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ==========================
// Upload Certification File
// ==========================
export const uploadCertification = async (tracking_id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/api/upload/certification/${tracking_id}`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data"
    }
  });
};

// ==========================
// Download files
// ==========================
export async function viewFinanceDocs(trackingId) {
  const res = await api.get(`/merge/${trackingId}`, { responseType: "blob" });
  return res.data;
}

export async function downloadCertificationDocs(trackingId) {
  const res = await api.get(`/download/certification/${trackingId}`, { responseType: "blob" });
  return res.data;
}

export async function adminDownloadCertification(trackingId) {
  const res = await api.get(`/admin/download/certification/${trackingId}`, {
    responseType: "blob",
  });

  // Convert blob ke file download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `certification_${trackingId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function downloadFilteredReimbursementsCSV(name, certType, principal) {
  const params = {};

  if (name && name !== "All") params.name = name;
  if (certType && certType !== "All") params.cert_type = certType;
  if (principal && principal !== "All") params.principal = principal; // ⬅ tambah ini

  const res = await api.get("/filter/download_csv", {
    params,
    responseType: "blob",
  });

  // Ambil filename dari header Content-Disposition
  const disposition = res.headers["content-disposition"];
  let filename = "reimbursements.csv";

  if (disposition) {
    const match = disposition.match(/filename="([^"]+)"/);
    if (match && match[1]) filename = match[1];
  }

  // Download file
  const blob = new Blob([res.data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

// ==========================
// Download Multiple Certifications as ZIP
// ==========================
export async function adminDownloadCertificationsZip(trackingIds) {
  const res = await api.post(
    "/download/certifications-zip",
    { tracking_ids: trackingIds },
    { responseType: "blob" }
  );

  const blob = new Blob([res.data], { type: "application/zip" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "certifications.zip");
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

// ==========================
// Tracking status
// ==========================
export async function fetchStatusByTrackingId(trackingId) {
  try {
    const res = await api.get(`/reimburse_status/${trackingId}`);
    return res.data; // langsung { valid, status?, message? }
  } catch (err) {
    console.error("Error fetching tracking status:", err);
    // kalau backend balikin 400/404/500 axios tetap masuk catch
    throw err.response?.data || { valid: false, message: "Server error" };
  }
}

// ==========================
// Move reimbursement to successful
// ==========================
export async function moveReimbursementToSuccessful(trackingId) {
  const res = await api.post("/reimburse_detail/success", {
    tracking_id: trackingId,
  });
  return res.data;
}

// ==========================
// Dropdown options
// ==========================
export async function fetchNamesOptions() {
  const res = await api.get("/reimburse/names");
  return res.data;
}

// ==========================
// HR: Fetch all user names (HR ONLY)
// ==========================
export async function fetchAllNamesOptions() {
  const res = await api.get("/reimburse/all_names");
  return res.data;
}

export async function fetchCertificationTypes() {
  const res = await api.get("/reimburse/cert_types");
  return res.data;
}

export async function fetchPrincipalsOptions() {
  const res = await api.get("/reimburse/principals");
  return res.data;
}

export async function fetchPaymentMethodsOptions() {
  const res = await api.get("/reimburse/payment-methods");
  return res.data;
}

export async function fetchPaidByOptions() {
  const res = await api.get("/reimburse/paid-by");
  return res.data;
}

export async function fetchCertificationTypesOptions() {
  const res = await api.get("/reimburse/certification-types");
  return res.data;
}

// ==========================
// Check if certificate exists
// ==========================
export async function checkCertificateExists(trackingId) {
  const res = await api.get(`/check_certificate/${trackingId}`);
  return res.data; // { exists: true/false }
}

export async function fetchTrackingIdOptions() {
  const res = await api.get("/tracking_ids");
  return res.data; // list tracking IDs
}

// ==========================
// SUPERADMIN: User Management
// ==========================

// Get all users with roles
export async function fetchAllUsers() {
  const res = await api.get("/superadmin/users");
  return res.data;
}

// Replace all roles for a user
export async function updateUserRoles(userId, roles) {
  const res = await api.put(`/superadmin/users/${userId}/roles`, { roles });
  return res.data;
}

// Add one role
export async function addUserRole(userId, role) {
  const res = await api.post(`/superadmin/users/${userId}/roles`, { role });
  return res.data;
}

// Delete one role
export async function deleteUserRole(userId, role) {
  const res = await api.delete(`/superadmin/users/${userId}/roles/${role}`);
  return res.data;
}

// Get allowed roles from backend (ENUM)
export async function fetchAllowedRoles() {
  const res = await api.get("/superadmin/roles");
  return res.data.roles;   // karena backend mengirim { roles: [...] }
}
