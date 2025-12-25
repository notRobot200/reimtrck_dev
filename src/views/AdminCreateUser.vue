<!-- src/views/AdminCreateUser.vue -->
<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">

    <SnowfallEffect :count="30" symbol="❄" />
    
    <!-- BACK BUTTON (only if multiple roles) -->
    <!-- Back Button → only if user has multiple roles -->
    <button
      v-if="hasMultipleRoles"
      @click="goBack"
      class="absolute top-6 left-6 bg-gray-800/70 hover:bg-gray-800 text-white 
            px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 z-20"
    >
      ← Back
    </button>


    <!-- Background blobs -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute rounded-full blur-3xl opacity-80 mix-blend-screen"
        style="background: linear-gradient(135deg, rgba(99,102,241,0.85), rgba(59,130,246,0.6));
               width: 520px; height: 520px; top: 10%; left: 10%;">
      </div>
      <div
        class="absolute rounded-full blur-2xl opacity-75 mix-blend-screen"
        style="background: linear-gradient(135deg, rgba(99,102,241,0.65), rgba(139,92,246,0.55));
               width: 380px; height: 380px; top: 15%; right: 8%;">
      </div>
      <div
        class="absolute rounded-full blur-2xl opacity-70 mix-blend-screen"
        style="background: linear-gradient(135deg, rgba(16,185,129,0.6), rgba(34,211,238,0.45));
               width: 300px; height: 300px; bottom: 10%; left: 50%; transform: translateX(-50%);">
      </div>
    </div>

    <!-- Card -->
    <div class="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/20">

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 
                 018 0zM12 14a7 7 0 00-7 
                 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold font-stussy text-gray-800 mb-2">Create New User</h2>
        <p class="text-gray-600">Fill in the details below to create a new account</p>
      </div>

      <!-- Form -->
      <CreateUserForm
        :form="form"
        :errors="errors"
        :loading="formLoading"
        @submit="handleCreateUser"
      />

      <!-- Go to Tracking Page Button -->
      <button
        type="button"
        @click="goToTracking"
        class="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 
              hover:from-green-600 hover:to-teal-600 
              text-white font-semibold py-3 px-4 rounded-xl 
              transition duration-200 transform hover:scale-105 active:scale-95 
              shadow-lg hover:shadow-xl flex justify-center items-center"
      >
        📄 Go to Tracking Page
      </button>


      <!-- Logout Button -->
      <button
        type="button"
        @click="handleLogout"
        :disabled="logoutLoading"
        class="mt-6 w-full bg-gradient-to-r from-red-500 to-pink-500 
              hover:from-red-600 hover:to-pink-600 
              text-white font-semibold py-3 px-4 rounded-xl 
              transition duration-200 transform hover:scale-105 active:scale-95 
              shadow-lg hover:shadow-xl flex justify-center items-center
              disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          v-if="logoutLoading"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 
                  0 5.373 0 12h4zm2 5.291A7.962 
                  7.962 0 014 12H0c0 3.042 1.135 
                  5.824 3 7.938l3-2.647z" />
        </svg>

        {{ logoutLoading ? "Logging out..." : "Logout" }}
      </button>
    </div>
  </div>
</template>

<script>
import { registerUser } from "../api";
import CreateUserForm from "../components/CreateUserForm.vue";
import SnowfallEffect from "../components/SnowfallEffect.vue";
import { useToast } from "vue-toastification";
import { computed } from "vue";

export default {
  name: "AdminCreateUser",
  components: { CreateUserForm },

  data() {
    return {
      form: {
        full_name: "",
        username: "",
        password: "",
        gmail: "",
      },
      formLoading: false,
      logoutLoading: false,
      errors: {},
      toast: useToast(),
      roles: JSON.parse(localStorage.getItem("roles")) || [],
    };
  },

  computed: {
    hasMultipleRoles() {
      return this.roles.length > 1;
    },
  },

  methods: {
    goToTracking() {
      this.$router.push("/admin/reimburse");
    },

    goBack() {
      this.$router.push("/choose-role");
    },

    async handleCreateUser() {
      this.formLoading = true;
      this.errors = {};

      if (!this.form.full_name) this.errors.full_name = "Full name is required";
      if (!this.form.username) this.errors.username = "Username is required";
      if (!this.form.password) this.errors.password = "Password is required";
      if (!this.form.gmail) this.errors.gmail = "Gmail is required";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.form.gmail && !emailRegex.test(this.form.gmail)) {
        this.errors.gmail = "Invalid email format";
      }

      if (Object.keys(this.errors).length > 0) {
        this.toast.error("❌ Please fill in all required fields correctly.");
        this.formLoading = false;
        return;
      }

      try {
        const data = await registerUser(this.form);
        this.toast.success(data.message || "✅ User created successfully!");
        this.form = { full_name: "", username: "", password: "", gmail: "" };
      } catch (err) {
        const message =
          err.response?.data?.message || "❌ An unexpected error occurred";
        this.toast.error(message);
      } finally {
        this.formLoading = false;
      }
    },

    async handleLogout() {
      this.logoutLoading = true;
      try {
        localStorage.clear();
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.toast.warning("⚠️ You have been logged out.");
        this.$router.push("/login");
      } finally {
        this.logoutLoading = false;
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  .absolute.rounded-full {
    opacity: 0.6 !important;
    filter: blur(2rem);
  }
}
</style>
