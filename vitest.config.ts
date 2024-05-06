import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
    
        coverage: {
            include: ['src/**'],
            enabled: true,
            reporter: ['html', 'lcov', 'cobertura'],
        },
    },
})

