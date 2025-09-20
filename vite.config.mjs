import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
    include: ['tests/ui/**/*.test.jsx'],
    coverage: {
      provider: 'v8',
      include: ['src/ui/**/*.{js,jsx}'],
      reports: ['text', 'lcov'],
      thresholds: {
        statements: 80,
        lines: 80,
      },
    },
  },
});
