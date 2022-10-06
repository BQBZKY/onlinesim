import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'node:path'

export default defineConfig({
  plugins: [vue({reactivityTransform: true})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
