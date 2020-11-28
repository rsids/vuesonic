module.exports = {
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/tests/e2e/"],
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["./tests/setup-unittest.ts"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,vue}",
    "!src/main.ts", // No need to cover bootstrap file
  ],
};
