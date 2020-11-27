module.exports = {
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/(?!vue-intersect)", "/tests/e2e/"],
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.tsx?$": "ts-jest",
    "(vue-intersect).+\\.js$": "babel-jest",
  },
};
