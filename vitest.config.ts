import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {

        coverage: {
            enabled: true,
            include: ['src/**'],
            exclude: ['coverage', 'dist'],
            reporter: ['html', 'lcov', 'cobertura', 'json'],
            thresholds: {
                autoUpdate: true,
                lines: 93,
                statements: 93,
                branches: 98.12,
                functions: 85.56
            }
        },
    },
})