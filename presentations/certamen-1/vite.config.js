import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root,
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: '../../public/materiales/finanzas-corporativas/certamen-1',
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL('./presentacion-certamen-1-finanzas-corporativas.html', import.meta.url)),
    },
  },
});
