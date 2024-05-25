import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {

        coverage: {
            provider: 'istanbul',
            enabled: true,
            include: ['src/**'],
            exclude: ['coverage', 'dist', 'src/**/*.spec.ts'],
            reporter: ['html', 'lcov', 'cobertura', 'json'],
            reportOnFailure: true,
            thresholds: {
                autoUpdate: true,
                lines: 85.49,
                statements: 85.3,
                branches: 85.04,
                functions: 85.18
            }
        },
    },
})