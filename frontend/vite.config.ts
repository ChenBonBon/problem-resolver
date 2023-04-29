import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svg from "vite-plugin-svgo";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react(), svg()],
});
