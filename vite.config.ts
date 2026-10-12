import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // "./" = rutas de assets relativas: el mismo build funciona en
  // la raíz de un dominio Y en https://usuario.github.io/lilo-home/
  base: "./",
  plugins: [react()],
  server: {
    allowedHosts: [".muleusercontent.com"],
  },
  build: {
    emptyOutDir: true,
    outDir: "dist",
  },
});
