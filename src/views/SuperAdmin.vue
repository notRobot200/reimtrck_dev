<template>
  <div class="relative min-h-screen flex flex-col p-6 overflow-hidden">

    <!-- BACKGROUND BLOBS -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Left blob -->
      <div
        class="absolute rounded-full blur-3xl opacity-80 mix-blend-screen"
        style="background: linear-gradient(135deg, rgba(99,102,241,0.85), rgba(59,130,246,0.6));
               width: 520px; height: 520px; top: 12%; left: 10%;">
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

    <!-- PAGE CONTENT -->
    <div class="relative z-10">

      <!-- Back Button -->
      <button
        @click="$router.push('/choose-role')"
        class="mb-4 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800"
      >
        ← Back
      </button>

      <h1 class="text-3xl font-bold mb-6">Superadmin - User Management</h1>

      <!-- User Table -->
      <UserTable
        :users="users"
        :loading="loading"
        @edit-user="handleEditUser"
      />

      <!-- Modals -->
      <RoleEditModal
        :is-open="editModal.isOpen.value"
        :user="selectedUser"
        :available-roles="allowedRoles"
        :is-loading="isSaving"
        @add-role="handleAddRole"
        @remove-role="handleRemoveRole"
        @save="handleSaveRoles"
        @cancel="handleCloseEditModal"
      />

      <ConfirmDeleteModal
        :is-open="confirmModal.isOpen.value"
        :role-name="roleToDelete"
        :is-loading="isDeleting"
        @confirm="handleConfirmRemove"
        @cancel="confirmModal.close"
      />

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUsers } from '@/composables/useUsers';
import { useModal } from '@/composables/useModal';
import { fetchAllowedRoles } from '@/api';   // <--- NEW
import UserTable from '@/components/superadmin/UserTable.vue';
import RoleEditModal from '@/components/superadmin/RoleEditModal.vue';
import ConfirmDeleteModal from '@/components/superadmin/ConfirmDeleteModal.vue';
import SnowfallEffect from "@/components/SnowfallEffect.vue";

export default {
  name: 'SuperadminView',

  components: {
    UserTable,
    RoleEditModal,
    ConfirmDeleteModal,
    SnowfallEffect
  },

  setup() {
    // Composables
    const { users, loading, loadUsers, addRoleToUser, removeRoleFromUser } = useUsers();
    const editModal = useModal();
    const confirmModal = useModal();

    // Local state
    const selectedUser = ref({});
    const roleToDelete = ref('');
    const pendingNewRole = ref('');

    // NEW: Allowed roles from backend
    const allowedRoles = ref([]);

    // 🔥 Loading state for delete
    const isDeleting = ref(false);
    const isSaving = ref(false);

    const handleConfirmRemove = async () => {
      isDeleting.value = true;

      try {
        await removeRoleFromUser(selectedUser.value.id, roleToDelete.value);

        selectedUser.value.roles = selectedUser.value.roles.filter(
          (r) => r !== roleToDelete.value
        );

        confirmModal.close();
      } catch (err) {
        console.error('Failed to remove role:', err);
      } finally {
        isDeleting.value = false;
      }
    };

    // Handlers
    const handleEditUser = (user) => {
      selectedUser.value = JSON.parse(JSON.stringify(user)); // deep clone
      editModal.open();
    };

    const handleCloseEditModal = () => {
      editModal.close();
      selectedUser.value = {};
      pendingNewRole.value = '';
    };

    const handleAddRole = (role) => {
      pendingNewRole.value = role;
    };

    const handleRemoveRole = (role) => {
      roleToDelete.value = role;
      confirmModal.open();
    };

    const handleSaveRoles = async () => {
      isSaving.value = true;

      try {
        if (pendingNewRole.value.trim()) {
          await addRoleToUser(
            selectedUser.value.id,
            pendingNewRole.value.trim()
          );
        }

        handleCloseEditModal();
      } catch (err) {
        console.error('Failed to save roles:', err);
      } finally {
        isSaving.value = false;
      }
    };

    // Lifecycle
    onMounted(async () => {
      allowedRoles.value = await fetchAllowedRoles();   // 🔥 load dropdown item
      loadUsers();
    });

    return {
      users,
      loading,
      selectedUser,
      roleToDelete,
      allowedRoles,
      editModal,
      confirmModal,
      isDeleting,
      isSaving,

      handleEditUser,
      handleCloseEditModal,
      handleAddRole,
      handleRemoveRole,
      handleConfirmRemove,
      handleSaveRoles,
    };
  }
};
</script>
