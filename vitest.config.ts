import angular from '@analogjs/vite-plugin-angular';
import viteSass from 'vite-plugin-sass';
import vitePluginString from 'vite-plugin-string';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular(), vitePluginString({ include: '**/*.html' }), viteSass()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup-tests.ts',
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});
