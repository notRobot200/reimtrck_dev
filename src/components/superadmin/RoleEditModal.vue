<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
  >
    <div class="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
      <h2 class="text-xl font-bold mb-4">
        Manage Roles - {{ user.full_name }}
      </h2>

      <!-- Current Roles -->
      <div class="mb-4">
        <label class="font-semibold">Current Roles:</label>

        <div class="mt-2">
          <div
            v-for="role in user.roles"
            :key="role"
            class="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
          >
            <span>{{ role }}</span>

            <button
              @click="$emit('remove-role', role)"
              class="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <!-- Add New Role -->
      <div class="mb-4">
        <label class="font-semibold">Add New Role:</label>

        <select
          v-model="selectedRole"
          class="w-full p-2 mt-2 rounded-lg border"
        >
          <option disabled value="">-- Select Role --</option>

          <!-- daftar role dari backend -->
          <option
            v-for="role in availableRoles"
            :key="role"
            :value="role"
            :disabled="user.roles.includes(role)"
          >
            {{ role }}
          </option>
        </select>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>

        <button
          @click="handleSave"
          :disabled="isLoading"
          class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <!-- Normal -->
          <span v-if="!isLoading">Save</span>

          <!-- Loading -->
          <span v-else class="flex items-center gap-2">
            <svg
              class="animate-spin h-5 w-5"
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

            Saving...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "RoleEditModal",

  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      required: true,
    },

    // roles dari backend (superadmin fetch via API)
    availableRoles: {
      type: Array,
      required: true,
    },
  },

  emits: ["add-role", "remove-role", "save", "cancel"],

  setup(props, { emit }) {
    const selectedRole = ref("");

    // reset dropdown ketika modal dibuka ulang
    watch(
      () => props.isOpen,
      (isOpen) => {
        if (isOpen) {
          selectedRole.value = "";
        }
      }
    );

    const handleSave = () => {
      if (selectedRole.value.trim()) {
        emit("add-role", selectedRole.value);
      }

      emit("save");
    };

    return {
      selectedRole,
      handleSave,
    };
  },
};
</script>
