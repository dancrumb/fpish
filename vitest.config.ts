import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {

        coverage: {
            enabled: true,
            include: ['src/**'],
            exclude: ['coverage', 'dist', 'src/**/*.spec.ts'],
            reporter: ['html', 'lcov', 'cobertura', 'json'],
            thresholds: {
                autoUpdate: true,
                lines: 93.41,
                statements: 93.41,
                branches: 98.8,
                functions: 86.73
            }
        },
    },
})