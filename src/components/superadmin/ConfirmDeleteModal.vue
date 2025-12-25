<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl">
      <h2 class="text-xl font-bold">Confirm Delete</h2>
      <p class="mt-2">
        Are you sure you want to remove role: <b>{{ roleName }}</b>?
      </p>

      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('cancel')"
          :disabled="isLoading"
          class="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          @click="$emit('confirm')"
          :disabled="isLoading"
          class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          <!-- Spinner -->
          <svg
            v-if="isLoading"
            class="animate-spin h-5 w-5 text-white"
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
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>

          <span>
            {{ isLoading ? "Deleting..." : "Delete" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDeleteModal',
  
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    roleName: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['confirm', 'cancel']
};
</script>
