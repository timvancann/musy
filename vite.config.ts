/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: './',
  server: { host: true, port: 5174 }, // 5174: cuby's dev server owns 5173
  test: { include: ['src/**/*.test.ts'] },
});
