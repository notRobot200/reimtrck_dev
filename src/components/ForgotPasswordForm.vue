<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="email"
        placeholder="Your email"
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 
            hover:from-blue-600 hover:to-indigo-700 
            text-white font-semibold py-3 px-4 rounded-xl 
            transition duration-200 transform hover:scale-105 active:scale-95 
            shadow-lg hover:shadow-xl flex justify-center items-center
            disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
        />
      </svg>

      {{ loading ? "Sending..." : "Send Reset Link" }}
    </button>
  </form>
</template>

<script>
export default {
  name: "ForgotPasswordForm",
  props: {
    modelValue: String,
    loading: Boolean,
  },
  emits: ["update:modelValue", "submit"],
};
</script>
