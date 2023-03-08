import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Orna/map/',
  build: {
    outDir: '../dist/map'
  },
  plugins: [svelte()]
})
