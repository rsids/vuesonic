module.exports = {
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/tests/e2e/"],
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.tsx?$": "ts-jest",
    "(vue-intersect).+\\.js$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
