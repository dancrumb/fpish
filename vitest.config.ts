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
                lines: 87.04,
                statements: 86.72,
                branches: 86.91,
                functions: 86.11
            }
        },
    },
})