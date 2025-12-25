import { ref } from 'vue';
import { fetchAllUsers, updateUserRoles, addUserRole, deleteUserRole } from '@/api';

export function useUsers() {
  const users = ref([]);
  const loading = ref(true);

  const loadUsers = async () => {
    try {
      loading.value = true;
      users.value = await fetchAllUsers();
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      loading.value = false;
    }
  };

  const addRoleToUser = async (userId, role) => {
    try {
      await addUserRole(userId, role);
      await loadUsers();
    } catch (err) {
      console.error('Error adding role:', err);
      throw err;
    }
  };

  const removeRoleFromUser = async (userId, role) => {
    try {
      await deleteUserRole(userId, role);
      await loadUsers();
    } catch (err) {
      console.error('Error removing role:', err);
      throw err;
    }
  };

  const updateRoles = async (userId, roles) => {
    try {
      await updateUserRoles(userId, roles);
      await loadUsers();
    } catch (err) {
      console.error('Error updating roles:', err);
      throw err;
    }
  };

  return {
    users,
    loading,
    loadUsers,
    addRoleToUser,
    removeRoleFromUser,
    updateRoles
  };
}