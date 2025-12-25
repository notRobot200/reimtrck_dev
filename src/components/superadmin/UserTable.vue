<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin h-10 w-10 border-t-2 border-indigo-600 rounded-full"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="text-center py-10 text-gray-500">
      No users found.
    </div>

    <!-- Table -->
    <div
      v-else
      class="bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-4 border border-white/20"
    >
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100/60 backdrop-blur-sm text-left">
            <th class="p-3">ID</th>
            <th class="p-3">Name</th>
            <th class="p-3">Email</th>
            <th class="p-3">Roles</th>
            <th class="p-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t hover:bg-gray-50/60"
          >
            <td class="p-3">{{ user.id }}</td>
            <td class="p-3">{{ user.full_name }}</td>
            <td class="p-3">{{ user.gmail }}</td>

            <td class="p-3">
              <span
                v-for="role in user.roles"
                :key="role"
                class="px-2 py-1 text-sm rounded-lg mr-2 bg-blue-100/70 text-blue-800 backdrop-blur-sm"
              >
                {{ role }}
              </span>
            </td>

            <td class="p-3 text-right">
              <button
                @click="$emit('edit-user', user)"
                class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  name: 'UserTable',
  
  props: {
    users: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  emits: ['edit-user']
};
</script>