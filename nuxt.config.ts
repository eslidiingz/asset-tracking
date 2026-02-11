import Aura from "@primeuix/themes/aura";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@primevue/nuxt-module",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@pinia/nuxt"
  ],
  css: ["~/assets/css/main.css"],
  primevue: {
    usePrimeVue: true,
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  fonts: {
    provider: 'google',
    families: [
      {
        name: 'Noto Sans Thai',
        weights: [400, 500, 600, 700, 800, 900],
      }
    ]
  },
  vite: {
    plugins: [tailwindcss() as any],
  },
  typescript: {
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        types: ["@types/bun"]
      }
    }
  },
});