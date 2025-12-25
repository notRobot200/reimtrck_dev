<!-- NoRole.vue -->
<template>
  <div class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

    <!-- Background Blobs -->
    <div ref="bgLayer" class="absolute inset-0 pointer-events-none">
      <div
        v-for="(b,i) in blobs"
        :key="i"
        :ref="el => blobEls[i]=el"
        class="blob absolute rounded-full transform will-change-transform"
        :style="b.style"
      ></div>
    </div>

    <!-- Frosted Panel -->
    <div class="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20 text-center">

      <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856C19.403 17.88 20 16.567 20 15V7c0-1.567-.597-2.88-1.582-3.995H5.582C4.597 4.12 4 5.433 4 7v8c0 1.567.597 2.88 1.062 3.995z"/>
        </svg>
      </div>

      <h2 class="text-3xl font-stussy text-gray-800 mb-2">
        No Roles Assigned
      </h2>

      <p class="text-gray-600 mb-6">
        Your account does not have any roles assigned.<br />
        Please contact the administrator.
      </p>

      <!-- Logout Button -->
      <button
        @click="logout"
        class="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
      >
        Logout
      </button>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-4 w-full text-center text-xs text-gray-600">
      notRobot200 – adjhnson.dev • <router-link to="/changelog" class="underline">v1.1</router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useAuth } from "../composables/useAuth.js";

const { logout } = useAuth();

/* -------- Blob Config (same theme as Login.vue) -------- */
const blobs = reactive([
  {
    x: -200, y: -120, size: 520,
    style: {
      background: "linear-gradient(135deg, rgba(239,68,68,0.85), rgba(244,63,94,0.6))",
      filter: "blur(80px)", opacity: 0.88,
      width: "520px", height: "520px", left: "10%", top: "10%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  },
  {
    x: 180, y: -80, size: 380,
    style: {
      background: "linear-gradient(135deg, rgba(244,63,94,0.65), rgba(251,113,133,0.55))",
      filter: "blur(60px)", opacity: 0.85,
      width: "380px", height: "380px", left: "70%", top: "8%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  },
  {
    x: 0, y: 180, size: 260,
    style: {
      background: "linear-gradient(135deg, rgba(239,68,68,0.55), rgba(244,114,182,0.45))",
      filter: "blur(40px)", opacity: 0.75,
      width: "260px", height: "260px", left: "50%", top: "60%",
      transform: "translate3d(0,0,0) scale(1)"
    }
  }
]);

const bgLayer = ref(null);
const blobEls = [];
const state = blobs.map(() => ({ px: 0, py: 0, vx: 0, vy: 0, tx: 0, ty: 0 }));

/* Motion Params */
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
    s.vx += fx; s.vy += fy;
    s.vx *= damping; s.vy *= damping;
    s.px += s.vx; s.py += s.vy;

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
  .blob { opacity: 0.5 !important; }
}
</style>
