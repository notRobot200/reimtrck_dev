<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">

    <!-- Back Button → only if user has multiple roles -->
    <button
      v-if="hasMultipleRoles"
      @click="goBack"
      class="absolute top-6 left-6 bg-gray-800/70 hover:bg-gray-800 text-white 
             px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 z-20"
    >
      ← Back
    </button>

    <!-- Background blobs (match Login.vue theme) -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Left blob -->
      <div
        class="absolute rounded-full blur-3xl opacity-80 mix-blend-screen"
        style="background: linear-gradient(135deg, rgba(99,102,241,0.85), rgba(59,130,246,0.6));
               width: 520px; height: 520px; top: 10%; left: 10%;">
      </div>

      <!-- Right blob -->
      <div
        class="absolute rounded-full blur-2xl opacity-75 mix-blend-screen"
        style="background: linear-gradient(135deg, rgba(99,102,241,0.65), rgba(139,92,246,0.55));
               width: 380px; height: 380px; top: 15%; right: 8%;">
      </div>

      <!-- Bottom blob -->
      <div
        class="absolute rounded-full blur-2xl opacity-70 mix-blend-screen"
        style="background: linear-gradient(135deg, rgba(16,185,129,0.6), rgba(34,211,238,0.45));
               width: 300px; height: 300px; bottom: 10%; left: 50%; transform: translateX(-50%);">
      </div>
    </div>

    <SnowfallEffect :count="30" symbol="❄" />

    <!-- Main Card -->
    <div class="relative z-10 w-full max-w-4xl bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/20">
      <h2 class="text-3xl font-bold mb-8 font-stussy text-gray-800 text-start">
        Reimbursement System
      </h2>

      <!-- Dropdown Form Selector -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Form
        </label>
        <select 
          v-model="selectedForm"
          class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
        >
          <option value="request">Reimbursement Request</option>
          <option value="detail">Reimbursement Detail</option>
        </select>
      </div>

      <!-- Conditional Render -->
      <RequestForm v-if="selectedForm === 'request'" />
      <DetailForm v-else />
    </div>

  </div>
</template>

<script>
import { useRouter } from "vue-router";
import RequestForm from "../components/user/RequestForm.vue";
import DetailForm from "../components/user/DetailForm.vue";
import SnowfallEffect from "../components/SnowfallEffect.vue";

export default {
  name: "Home",
  components: { RequestForm, DetailForm, SnowfallEffect },

  data() {
    return {
      selectedForm: "request",
      roles: JSON.parse(localStorage.getItem("roles")) || [],
    };
  },

  computed: {
    // muncul jika role > 1
    hasMultipleRoles() {
      return this.roles.length > 1;
    },
  },

  setup() {
    const router = useRouter();

    const goBack = () => {
      router.push("/choose-role");
    };

    return { goBack };
  },
};
</script>

<style scoped>
/* Responsiveness: reduce blob intensity on small screens */
@media (max-width: 640px) {
  .absolute.rounded-full {
    opacity: 0.6 !important;
    filter: blur(2rem);
  }
}
</style>
