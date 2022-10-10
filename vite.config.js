import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'node:path'

export default defineConfig({
  publicDir: path.resolve(__dirname, 'src/public'),

  plugins: [vue({reactivityTransform: true})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
