<template>
  <div class="mt-4 flex gap-3">
    <button
      @click="$emit('logout')"
      :disabled="isLoggingOut"
      class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold shadow hover:shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg v-if="isLoggingOut" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{{ isLoggingOut ? "Logging Out..." : "Logout" }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isLoggingOut: Boolean
});

defineEmits(['logout']);
</script>