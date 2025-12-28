import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      ...configDefaults.exclude,
      '**/testdata.spec.ts',
      '**/test-support.spec.ts',
      '**/local-firebase.spec.ts',
      '**/local-testdata.spec.ts', // Included based on the 'local-<filename>' error pattern
    ],
    reporters: ['default'],
  },
  // Setting publicDir to 'src' allows assets in 'src/assets' to be accessed
  // via '/assets/...' in tests, consistent with Karma's asset serving.
  publicDir: 'src',
});
