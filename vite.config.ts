import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import yaml from '@rollup/plugin-yaml';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'build',
  },

  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.tsx?$/,
    exclude: [],
  },
  //Sets up backend API proxying.
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.ts': 'tsx',
      },
    },
  },

  plugins: [
    react(),
    tailwindcss(),
    yaml()
  ],
  resolve: {
    alias: [
      {
        find: 'src/',
        replacement: `${path.resolve(__dirname, 'src')}/`,
      },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
  },
  server: {
    host: '0.0.0.0',
    port: 5101,
    proxy: {
      // https://vitejs.dev/config/server-options.html
    },
  },
})
