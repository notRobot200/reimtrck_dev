<template>
  <div class="relative min-h-screen p-4 sm:p-6 flex justify-center items-start overflow-hidden">
    <SnowfallEffect :count="30" symbol="❄" />
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-200/50 to-blue-100/40 backdrop-blur-lg"></div>

    <div class="relative z-10 w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-6 sm:p-8 mt-10 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Changelog</h1>
          <p class="text-sm text-gray-500">Latest updates and improvements</p>
        </div>
      </div>

      <!-- ================= v1.2 ================= -->
      <div class="mb-12">
        <div class="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 rounded-r-2xl p-4 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-1">Update v1.2 – Summary</h2>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Release Date: 14 December 2025</span>
          </div>
        </div>

        <div class="space-y-6">
          <!-- SUPERADMIN -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span class="text-2xl">🛡️</span>
              </div>
              <h3 class="font-bold text-gray-900 text-lg">Superadmin Update</h3>
            </div>
            <div class="ml-13 space-y-3 text-sm text-gray-700">
              <div class="bg-gradient-to-r from-red-50 to-orange-50 border-l-2 border-red-400 rounded-r-xl p-3">
                <div class="font-semibold text-gray-900 mb-1">Role & Authority Management</div>
                <ul class="space-y-1">
                  <li>• Added a dedicated Superadmin page for managing access permissions.</li>
                  <li>• Authority is restricted and assigned specifically to Pak Anton.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- ADMIN -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <span class="text-2xl">👨‍💼</span>
              </div>
              <h3 class="font-bold text-gray-900 text-lg">Admin Update</h3>
            </div>
            <div class="ml-13 space-y-3 text-sm text-gray-700">
              <div class="bg-gradient-to-r from-orange-50 to-red-50 border-l-2 border-orange-400 rounded-r-xl p-3">
                <div class="font-semibold text-gray-900 mb-1">Download Data Without Certification Cost</div>
                <ul class="space-y-1">
                  <li>• Admin can download data entries that do not have certification values.</li>
                  <li>• Helps data validation and follow-up processing.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= v1.1 (Previous) ================= -->
      <!-- v1.1 content remains unchanged below -->

      <!-- Back Button -->
      <div class="mt-6">
        <button
          @click="goBack"
          :disabled="isLoading"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 disabled:bg-indigo-400 hover:bg-indigo-700 text-white font-semibold shadow transition duration-200"
        >
          <span v-if="!isLoading">← Back to Login</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span class="ml-2">Loading...</span>
          </span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SnowfallEffect from "../components/SnowfallEffect.vue";

const router = useRouter();
const isLoading = ref(false);

const goBack = () => {
  isLoading.value = true;
  setTimeout(() => router.push("/"), 1200);
};
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in .4s ease-out;
}
</style>
