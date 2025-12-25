// src/composables/useAuth.js
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/index.js";
import { useToast } from "vue-toastification";

export function useAuth() {
  const router = useRouter();
  const toast = useToast();

  const username = ref("");
  const password = ref("");
  const fullName = ref("");
  const isLoading = ref(false);

  const token = ref(localStorage.getItem("token") || "");
  const roles = ref(JSON.parse(localStorage.getItem("roles") || "[]"));
  const activeRole = ref(localStorage.getItem("active_role") || "");

  fullName.value = localStorage.getItem("full_name") || "";

  /* ----------------------------------------
     Redirect helper based on active role
  ---------------------------------------- */
  function redirectAccordingToRole(role) {
    if (!role) return router.push("/home");

    switch (role) {
      case "superadmin":
      case "admin":
        return router.push("/admin/users/create");
      case "hr":
        return router.push("/hr/reimburse");
      case "user":
      default:
        return router.push("/home");
    }
  }

  /* ----------------------------------------
     Auto login if token found
  ---------------------------------------- */
  onMounted(() => {
    if (!token.value) return;

    // ⛔ Jika tidak punya role sama sekali
    if (roles.value.length === 0) {
      return router.push("/no-role");
    }

    // Jika sudah punya activeRole → direct
    if (activeRole.value) {
      return redirectAccordingToRole(activeRole.value);
    }

    // Jika roles > 1 → pilih role dulu
    if (roles.value.length > 1) {
      return router.push("/choose-role");
    }

    // Roles cuma 1 → auto-pick
    if (roles.value.length === 1) {
      const r = roles.value[0];
      localStorage.setItem("active_role", r);
      activeRole.value = r;
      return redirectAccordingToRole(r);
    }
  });

  /* ----------------------------------------
     Login Handler
  ---------------------------------------- */
  async function handleLogin() {
    isLoading.value = true;

    try {
      const data = await login(username.value, password.value);

      const userRoles = Array.isArray(data.roles) ? data.roles : [];

      // Simpan ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("full_name", data.full_name || "");
      localStorage.setItem("roles", JSON.stringify(userRoles));
      localStorage.removeItem("active_role");

      token.value = data.token;
      roles.value = userRoles;
      fullName.value = data.full_name || "";
      activeRole.value = "";

      toast.success("Login successful!");

      // ⛔ Jika tidak punya role → redirect ke halaman khusus
      if (userRoles.length === 0) {
        return router.push("/no-role");
      }

      // Jika punya > 1 role → pilih dulu
      if (userRoles.length > 1) {
        return router.push("/choose-role");
      }

      // Jika hanya 1 role → auto-pick
      const picked = userRoles[0];
      localStorage.setItem("active_role", picked);
      activeRole.value = picked;

      redirectAccordingToRole(picked);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      isLoading.value = false;
    }
  }

  /* ----------------------------------------
     Logout
  ---------------------------------------- */
  function logout() {
    localStorage.clear();
    token.value = "";
    roles.value = [];
    activeRole.value = "";
    fullName.value = "";

    toast.info("You have been logged out.");
    router.push("/login");
  }

  return {
    username,
    password,
    fullName,
    isLoading,
    roles,
    token,
    activeRole,
    handleLogin,
    logout,
  };
}
