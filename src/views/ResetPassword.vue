<!-- src/views/ResetPassword.vue -->
<template>
  <div class="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
    <!-- Background blobs (same as Login.vue) -->
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
    
    <!-- Card -->
    <div class="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold font-stussy text-gray-800 mb-2">Reset Password</h2>
        <p class="text-gray-600">Set a new password for your account</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="New password"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
            required
          />

          <!-- Strength meter -->
          <div class="mt-2 h-2 w-full bg-gray-200 rounded">
            <div
              class="h-2 rounded transition-all duration-300"
              :class="strengthColor"
              :style="{ width: strengthPercent + '%' }"
            ></div>
          </div>
          <p class="text-xs mt-1 text-gray-600">{{ strengthMessage }}</p>

          <!-- Checklist rules -->
          <ul class="mt-2 text-sm space-y-1">
            <li :class="hasMinLength ? 'text-green-600' : 'text-gray-400'">
              <span v-if="hasMinLength">✔</span> Minimum 8 characters
            </li>
            <li :class="hasUpperCase ? 'text-green-600' : 'text-gray-400'">
              <span v-if="hasUpperCase">✔</span> At least one uppercase letter (A-Z)
            </li>
            <li :class="hasLowerCase ? 'text-green-600' : 'text-gray-400'">
              <span v-if="hasLowerCase">✔</span> At least one lowercase letter (a-z)
            </li>
            <li :class="hasNumber ? 'text-green-600' : 'text-gray-400'">
              <span v-if="hasNumber">✔</span> At least one number (0-9)
            </li>
            <li :class="hasSpecialChar ? 'text-green-600' : 'text-gray-400'">
              <span v-if="hasSpecialChar">✔</span> At least one special character (!@#$%^&*)
            </li>
          </ul>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
            required
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50"
          :disabled="loading"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 inline-block mr-2 text-white"
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
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 
                0 5.373 0 12h4zm2 5.291A7.962 
                7.962 0 014 12H0c0 3.042 1.135 
                5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>
      </form>

      <!-- Response Message -->
      <p v-if="message" :class="messageClass" class="mt-4 text-center text-sm">{{ message }}</p>

      <!-- Back Link -->
      <div class="mt-4 text-center">
        <router-link to="/login" class="text-indigo-600 hover:underline text-sm">
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { resetPassword } from "../api/index.js";
import { useToast } from "vue-toastification"; // ✅ import toast
import SnowfallEffect from "../components/SnowfallEffect.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast(); // ✅ inisialisasi toast

const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const token = ref("");

// Strength meter
const strengthPercent = ref(0);
const strengthMessage = ref("");
const strengthColor = ref("bg-red-500");

onMounted(() => {
  token.value = route.query.token || "";
  if (!token.value) {
    toast.error("Invalid or missing token.");
    router.push("/login");
  }
});

const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasUpperCase = computed(() => /[A-Z]/.test(newPassword.value));
const hasLowerCase = computed(() => /[a-z]/.test(newPassword.value));
const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?\":{}|<>]/.test(newPassword.value));

watch(newPassword, () => {
  let score = 0;
  if (hasMinLength.value) score++;
  if (hasUpperCase.value) score++;
  if (hasLowerCase.value) score++;
  if (hasNumber.value) score++;
  if (hasSpecialChar.value) score++;
  strengthPercent.value = (score / 5) * 100;
  switch (score) {
    case 0:
    case 1:
      strengthMessage.value = "Very Weak"; strengthColor.value = "bg-red-500"; break;
    case 2:
      strengthMessage.value = "Weak"; strengthColor.value = "bg-orange-500"; break;
    case 3:
      strengthMessage.value = "Medium"; strengthColor.value = "bg-yellow-400"; break;
    case 4:
      strengthMessage.value = "Strong"; strengthColor.value = "bg-blue-500"; break;
    case 5:
      strengthMessage.value = "Very Strong"; strengthColor.value = "bg-green-500"; break;
  }
});

function isStrongPassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include at least one number.";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Password must include at least one special character.";
  return "";
}

async function handleResetPassword() {
  if (!token.value) return;

  if (newPassword.value !== confirmPassword.value) {
    toast.error("Passwords do not match.");
    return;
  }

  const error = isStrongPassword(newPassword.value);
  if (error) {
    toast.warning(error);
    return;
  }

  loading.value = true;

  try {
    const data = await resetPassword(token.value, newPassword.value);
    toast.success(data.message || "Password reset successful!");
    setTimeout(() => router.push("/login"), 2000);
  } catch (err) {
    toast.error(err.message || "An error occurred. Try again.");
  } finally {
    loading.value = false;
  }
}
</script>


<style scoped>
@media (max-width: 640px) {
  .absolute.rounded-full {
    opacity: 0.6 !important;
    filter: blur(2rem);
  }
}
</style>
