export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/*.test.ts'],
    cache: true,
    moduleNameMapper: {
        '^set-piece$': '<rootDir>/node_modules/set-piece/src/index.ts',
        '^set-piece/(.*)$': '<rootDir>/node_modules/set-piece/src/$1'
    }
};
