// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Toast, { POSITION } from "vue-toastification"; // ⬅️ import toast
import "vue-toastification/dist/index.css"; // ⬅️ import css
import "./assets/main.css";

const app = createApp(App);

app.use(router);

// konfigurasi opsional (boleh disesuaikan)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
});

app.mount("#app");
