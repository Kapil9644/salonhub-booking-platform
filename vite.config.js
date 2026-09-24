import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
      },

      manifest: {
        name: "Rupiva",
        short_name: "Rupiva",
        description: "Book trusted salons, parlours and spas near you.",
        theme_color: "#7c3aed",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/icons/rupiva-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/rupiva-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],

        screenshots: [
          {
            src: "/screenshots/rupiva-desktop.png",
            sizes: "1366x768",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshots/rupiva-mobile.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],

  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
