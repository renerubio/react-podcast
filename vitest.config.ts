import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, './src'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/context': path.resolve(__dirname, './src/context'),
      '@/locale': path.resolve(__dirname, './src/locale'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8'
    }
  }
})
