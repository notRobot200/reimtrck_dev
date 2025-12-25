<!-- src/components/CreateUserForm.vue -->
<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <!-- Full Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
      <input
        v-model="form.full_name"
        type="text"
        placeholder="Full Name"
        :class="['w-full p-2 border rounded', errors.full_name ? 'border-red-500' : 'border-gray-300']"
        required
      />
      <p v-if="errors.full_name" class="text-red-500 text-sm mt-1">{{ errors.full_name }}</p>
    </div>

    <!-- Gmail -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Gmail</label>
      <input
        v-model="form.gmail"
        type="email"
        placeholder="user@gmail.com"
        :class="['w-full p-2 border rounded', errors.gmail ? 'border-red-500' : 'border-gray-300']"
        required
      />
      <p v-if="errors.gmail" class="text-red-500 text-sm mt-1">{{ errors.gmail }}</p>
    </div>

    <!-- Username -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
      <input
        v-model="form.username"
        type="text"
        placeholder="Username"
        :class="['w-full p-2 border rounded', errors.username ? 'border-red-500' : 'border-gray-300']"
        required
      />
      <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
    </div>

    <!-- Password -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="Password"
        :class="['w-full p-2 border rounded', errors.password ? 'border-red-500' : 'border-gray-300']"
        required
      />
      <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
    </div>

    <!-- Submit Button -->
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

      {{ loading ? "Creating..." : "Create User" }}
    </button>
  </form>
</template>

<script>
export default {
  name: "CreateUserForm",
  props: {
    form: Object,
    errors: Object,
    loading: Boolean,
  },
  emits: ["submit"],
  methods: {
    onSubmit() {
      this.$emit("submit");
    },
  },
};
</script>
