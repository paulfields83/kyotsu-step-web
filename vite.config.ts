import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/kyotsu-step-web/',
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/katex') || id.includes('node_modules/react-katex')) return 'math-renderer'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react-core'
          if (id.includes('node_modules/zod')) return 'schema'
          if (id.includes('node_modules/zustand')) return 'state'
          if (id.includes('node_modules/lucide-react')) return 'icons'
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: { reporter: ['text', 'html'] },
  },
})