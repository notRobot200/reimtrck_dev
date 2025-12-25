// composables/useSnowfall.js
import { ref, onMounted } from 'vue';

/**
 * Composable untuk efek salju turun
 * @param {Object} options - Konfigurasi salju
 * @param {number} options.count - Jumlah kepingan salju (default: 20)
 * @param {number} options.minDuration - Durasi minimum animasi dalam detik (default: 5)
 * @param {number} options.maxDuration - Durasi maksimum animasi dalam detik (default: 15)
 * @param {number} options.minSize - Ukuran minimum dalam rem (default: 0.8)
 * @param {number} options.maxSize - Ukuran maksimum dalam rem (default: 1.5)
 * @param {number} options.minOpacity - Opacity minimum (default: 0.6)
 * @param {number} options.maxOpacity - Opacity maksimum (default: 1)
 * @returns {Object} - snowflakes array dan helper functions
 */
export function useSnowfall(options = {}) {
  const {
    count = 20,
    minDuration = 5,
    maxDuration = 15,
    minSize = 0.8,
    maxSize = 1.5,
    minOpacity = 0.6,
    maxOpacity = 1,
  } = options;

  const snowflakes = ref([]);

  // Generate random number dalam range
  const random = (min, max) => Math.random() * (max - min) + min;

  // Generate style untuk satu kepingan salju
  const generateSnowflakeStyle = () => ({
    left: `${random(0, 100)}%`,
    animationDelay: `${random(0, 5)}s`,
    animationDuration: `${random(minDuration, maxDuration)}s`,
    fontSize: `${random(minSize, maxSize)}rem`,
    opacity: random(minOpacity, maxOpacity),
  });

  // Initialize snowflakes
  const initSnowflakes = () => {
    snowflakes.value = Array.from({ length: count }, (_, i) => ({
      id: `snowflake-${i}`,
      style: generateSnowflakeStyle(),
    }));
  };

  // Reset dan regenerate snowflakes (jika diperlukan)
  const resetSnowflakes = () => {
    initSnowflakes();
  };

  // Auto-initialize saat mounted
  onMounted(() => {
    initSnowflakes();
  });

  return {
    snowflakes,
    resetSnowflakes,
  };
}