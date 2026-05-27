import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  base: "/projets/vanlive/", 

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        connexion: resolve(__dirname, "connexion.html"),
        onboarding: resolve(__dirname, "onboarding.html"),
        plan: resolve(__dirname, "plan.html"),
      }
    }
  }
})