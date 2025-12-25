import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import AdminCreateUser from "../views/AdminCreateUser.vue"; 
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },

  // Public route
  { 
    path: "/changelog", 
    component: () => import("../views/Changelog.vue") 
  },

  // User home
  { 
    path: "/home", 
    component: Home, 
    meta: { requiresAuth: true, role: "user" } 
  },

  {
    path: "/no-role",
    name: "NoRole",
    component: () => import("../views/NoRole.vue")
  },

  // Admin create user
  { 
    path: "/admin/users/create", 
    component: AdminCreateUser, 
    meta: { requiresAuth: true, role: "admin" } 
  },

  // ============================
  // HR Tracking page
  // ============================
  { 
    path: "/hr/reimburse", 
    name: "hr-tracking",
    component: () => import("../views/Tracking.vue"), 
    meta: { requiresAuth: true, role: "hr" }
  },

  // ============================
  // ADMIN Tracking page
  // (menggunakan file Tracking.vue yang sama)
  // ============================
  { 
    path: "/admin/reimburse", 
    name: "admin-tracking",
    component: () => import("../views/Tracking.vue"), 
    meta: { requiresAuth: true, role: "admin" }
  },

  { path: "/forgot-password", component: ForgotPassword },
  { path: "/reset-password", component: ResetPassword },

  {
    path: "/choose-role",
    component: () => import("../views/ChooseRole.vue"),
    meta: { requiresAuth: true }
  },

  // Superadmin
  {
    path: "/superadmin",
    component: () => import("../views/SuperAdmin.vue"),
    meta: { requiresAuth: true, role: "superadmin" }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const activeRole = localStorage.getItem("active_role");

  // 1. butuh login tapi tidak login
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // 2. user memiliki multiple roles → wajib pilih active role dulu
  if (token && roles.length > 1 && !activeRole && to.path !== "/choose-role") {
    return next("/choose-role");
  }

  // 3. cek role access
  if (to.meta.role && activeRole && to.meta.role !== activeRole) {
    alert("Anda tidak memiliki akses ke halaman ini!");
    return next(`/${activeRole}`); 
  }

  // 4. reset password harus ada token
  if (to.path === "/reset-password") {
    if (!to.query.token) {
      alert("Invalid or missing reset link!");
      return next("/login");
    }
  }

  next();
});

export default router;
