module.exports = {
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"],
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel"
};
