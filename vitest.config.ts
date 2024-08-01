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
            all: true,
            thresholds: {
                autoUpdate: true,
                lines: 87.68,
                statements: 87.27,
                branches: 87.85,
                functions: 86.32
            }
        },
    },
})