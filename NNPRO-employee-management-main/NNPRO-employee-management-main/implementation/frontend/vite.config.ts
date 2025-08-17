import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,             // Listen on all network interfaces
    watch: {
      usePolling: true,     // Use polling to watch for changes
      interval: 1000,
    },
    port: 5173,
  },
})