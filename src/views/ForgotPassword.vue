<!-- ForgotPassword.vue -->
<template>
  <div class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
    <!-- Background blobs (sama seperti Login.vue) -->
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
    
    <!-- Frosted panel -->
    <div class="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 12a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold font-stussy text-gray-800 mb-2">Forgot Password</h2>
        <p class="text-gray-600">Enter your email to receive a reset link</p>
      </div>

      <!-- Form -->
      <ForgotPasswordForm
        v-model="email"
        :loading="loading"
        @submit="handleForgotPassword"
      />

      <!-- Back Link -->
      <div class="mt-4 text-center">
        <router-link to="/login" class="text-blue-600 hover:underline text-sm">
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import ForgotPasswordForm from "../components/ForgotPasswordForm.vue";
import { forgotPassword } from "../api/index.js";
import { useToast } from "vue-toastification";
import SnowfallEffect from "../components/SnowfallEffect.vue";

const email = ref("");
const loading = ref(false);
const toast = useToast();

async function handleForgotPassword() {
  loading.value = true;
  try {
    const data = await forgotPassword(email.value);
    toast.success(data.message || "Reset link sent successfully!");
  } catch (err) {
    console.error("Axios error:", err);
    toast.error(err.response?.data?.message || "Something went wrong.");
  } finally {
    loading.value = false;
  }
}

/* -------- Blob config (sama seperti Login.vue) -------- */
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

/* --- Physics state (sama dengan Login.vue) --- */
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
