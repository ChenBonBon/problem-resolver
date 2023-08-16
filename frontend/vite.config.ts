import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import mockDevServerPlugin from "vite-plugin-mock-dev-server";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "^/api": "http://example.com/",
    },
  },
  plugins: [react(), mockDevServerPlugin()],
});
