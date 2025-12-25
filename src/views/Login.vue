<!-- Login.vue - Updated Version -->
<template>
  <div class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
    <!-- Background layer (blobs) -->
    <div ref="bgLayer" class="absolute inset-0 pointer-events-none">
      <div
        v-for="(b,i) in blobs"
        :key="i"
        :ref="el => blobEls[i]=el"
        class="blob absolute rounded-full transform will-change-transform"
        :style="b.style"
      ></div>
    </div>

    <!-- Snowfall Effect Component -->
    <SnowfallEffect :count="20" />

    <!-- Christmas decorations -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-5">
    </div>

    <!-- Frosted panel -->
    <div class="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
      <!-- Christmas Banner -->
      <div class="text-center mb-4 py-3 px-4 bg-gradient-to-r from-red-500/20 via-green-500/20 to-red-500/20 rounded-xl border border-red-300/30">
        <div class="flex items-center justify-center gap-2 mb-1">
          <span class="text-2xl">🎄</span>
          <h3 class="text-lg font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
            Merry Christmas!
          </h3>
          <span class="text-2xl">🎄</span>
        </div>
        <p class="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          & Happy New Year 2026! 
        </p>
      </div>

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center relative">
          <!-- Santa hat on icon -->
          <div class="absolute -top-2 -right-1 text-2xl">🎅</div>
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-4xl font-stussy text-gray-800 mb-2">Hello There!</h2>
        <p class="text-gray-600">Sign in to your account</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
            required
          />
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Sign In
        </button>

        <div class="text-center">
          <router-link to="/forgot-password" class="text-blue-600 hover:underline text-sm">Forgot Password?</router-link>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-4 w-full text-center text-xs text-gray-600">
      notRobot200 – adjhnson.dev • <router-link to="/changelog" class="underline">v1.2</router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useAuth } from "../composables/useAuth.js";
import SnowfallEffect from "../components/SnowfallEffect.vue";

const { username, password, isLoading, handleLogin } = useAuth();

/* -------- Blob config -------- */
const blobs = reactive([
  { // big soft blob (left)
    x: -200, y: -120, size: 520,
    style: {
      background: "linear-gradient(135deg, rgba(99,102,241,0.85), rgba(59,130,246,0.6))",
      filter: "blur(80px)",
      opacity: 0.9,
      width: "520px", height: "520px", left: "10%", top: "10%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  },
  { // mid blob (right)
    x: 180, y: -80, size: 380,
    style: {
      background: "linear-gradient(135deg, rgba(99,102,241,0.65), rgba(139,92,246,0.55))",
      filter: "blur(60px)",
      opacity: 0.85,
      width: "380px", height: "380px", left: "70%", top: "8%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  },
  { // small accent (bottom)
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

/* --- Spring physics state per blob --- */
const state = blobs.map(() => ({
  px: 0, py: 0, vx: 0, vy: 0, // current pos & velocity
  tx: 0, ty: 0 // target pos
}));

/* Tunable params */
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