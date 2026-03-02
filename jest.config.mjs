export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'js', 'tsx', 'mjs'],
    testMatch: ['**/*.test.ts'],
    cache: true,
    cacheDirectory: '.jest',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                module: 'ESNext',
                moduleResolution: 'node'
            }
        }],
        '^.+\\.m?js$': ['ts-jest', {
            useESM: true
        }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!(set-piece)/)'
    ],
    moduleNameMapper: {
        '^set-piece$': '<rootDir>/node_modules/set-piece/dist/index.js',
        '^set-piece/(.*)$': '<rootDir>/node_modules/set-piece/dist/$1'
    }
}; 