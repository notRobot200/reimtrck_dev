<template>
  <div class="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
    
    <!-- Background blobs (sama seperti ForgotPassword.vue) -->
    <div ref="bgLayer" class="absolute inset-0 pointer-events-none">
      <div
        v-for="(b,i) in blobs"
        :key="i"
        :ref="el => blobEls[i]=el"
        class="blob absolute rounded-full transform will-change-transform"
        :style="b.style"
      ></div>
    </div>

    <SnowfallEffect :count="30" symbol="❄" />

    <!-- Panel -->
    <div class="relative z-10 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20">
      
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">
        Select Access Role
      </h2>

      <p class="text-center text-gray-700 mb-8">
        You have more than one access role. Please select a role to continue.
      </p>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center mb-6">
        <svg class="animate-spin h-8 w-8 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>

      <!-- Role Buttons -->
        <div v-if="!loading" class="space-y-4">
        <button
            v-for="role in roles"
            :key="role"
            @click="selectRole(role)"
            class="w-full py-3 px-4 bg-white/70 hover:bg-gray-100 text-gray-900 font-semibold
                active:scale-[0.98] transition-all rounded-2xl shadow border border-gray-200
                hover:border-gray-300 hover:shadow-lg flex items-center justify-between"
        >
            <span class="text-lg font-semibold capitalize">{{ role }}</span>
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
        </button>
        </div>


      <!-- Logout Spinner -->
      <div v-if="logoutLoading" class="flex justify-center mt-6">
        <svg class="animate-spin h-8 w-8 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>

      <!-- Logout Button -->
      <button
        v-if="!logoutLoading"
        @click="logout"
        class="mt-8 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold
                rounded-2xl shadow transition-all active:scale-[0.97]"
      >
        Logout
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import SnowfallEffect from "../components/SnowfallEffect.vue";

const router = useRouter();
const roles = JSON.parse(localStorage.getItem("roles")) || [];

const loading = ref(false);
const logoutLoading = ref(false);

// Jika tidak ada role → arahkan ke login
if (!roles.length) {
  router.push("/login");
}

/* -------------------------
   Role Selection Logic
------------------------- */
function selectRole(role) {
  loading.value = true;

  localStorage.setItem("active_role", role);

  const routeMap = {
    user: "/home",
    hr: "/hr/reimburse",
    admin: "/admin/users/create",
    superadmin: "/superadmin",
  };

  const target = routeMap[role] || "/home";

  setTimeout(() => {
    router.push(target);
  }, 600);
}

function logout() {
  logoutLoading.value = true;
  localStorage.clear();

  setTimeout(() => {
    router.push("/login");
  }, 700);
}

/* -------------------------
   BACKGROUND BLOBS (FULL)
   Copy–paste from Login/ForgotPassword
------------------------- */

const blobs = reactive([
  {
    x: -200, y: -120, size: 520,
    style: {
      background: "linear-gradient(135deg, rgba(99,102,241,0.85), rgba(59,130,246,0.6))",
      filter: "blur(80px)",
      opacity: 0.9,
      width: "520px", height: "520px", left: "10%", top: "10%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  },
  {
    x: 180, y: -80, size: 380,
    style: {
      background: "linear-gradient(135deg, rgba(99,102,241,0.65), rgba(139,92,246,0.55))",
      filter: "blur(60px)",
      opacity: 0.85,
      width: "380px", height: "380px", left: "70%", top: "8%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  },
  {
    x: 0, y: 180, size: 260,
    style: {
      background: "linear-gradient(135deg, rgba(16,185,129,0.6), rgba(34,211,238,0.45))",
      filter: "blur(40px)",
      opacity: 0.8,
      width: "260px", height: "260px", left: "50%", top: "60%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  }
]);

const bgLayer = ref(null);
const blobEls = [];

const state = blobs.map(() => ({
  px: 0, py: 0, vx: 0, vy: 0,
  tx: 0, ty: 0
}));

const intensity = 0.15;
const stiffness = 0.12;
const damping = 0.82;
const scaleFactor = 0.06;

let rafId = null;

function onMove(e) {
  const rect = bgLayer.value.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const nx = (clientX - cx) / rect.width;
  const ny = (clientY - cy) / rect.height;

  state.forEach((s, i) => {
    const depth = (i + 1) / state.length;
    s.tx = nx * rect.width * intensity * (0.6 + depth * 1.2);
    s.ty = ny * rect.height * intensity * (0.6 + (1 - depth) * 1.2);
  });
}

function onLeave() {
  state.forEach(s => { s.tx = 0; s.ty = 0; });
}

function update() {
  for (let i = 0; i < state.length; i++) {
    const s = state[i];

    const fx = (s.tx - s.px) * stiffness;
    const fy = (s.ty - s.py) * stiffness;

    s.vx += fx;
    s.vy += fy;

    s.vx *= damping;
    s.vy *= damping;

    s.px += s.vx;
    s.py += s.vy;

    const el = blobEls[i];
    if (!el) continue;

    const dist = Math.hypot(s.tx - s.px, s.ty - s.py);
    const scale = 1 + Math.min(dist / 600, 1) * scaleFactor;

    el.style.transform = `translate3d(${s.px}px, ${s.py}px, 0) scale(${scale})`;
  }
  rafId = requestAnimationFrame(update);
}

onMounted(() => {
  rafId = requestAnimationFrame(update);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onLeave, { passive: true });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerleave", onLeave);
  window.removeEventListener("touchmove", onMove);
  window.removeEventListener("touchend", onLeave);
});
</script>

<style scoped>
.blob {
  will-change: transform, opacity;
  transition: opacity 0.25s linear;
  mix-blend-mode: screen;
  pointer-events: none;
}
.blob[style] {
  transform-origin: center;
  backface-visibility: hidden;
}
@media (max-width: 640px) {
  .blob { opacity: 0.6 !important; }
}
</style>
