// ============================================
// SHARED ESLINT CONFIG
// Used by all apps and packages
// ============================================

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // Warn on console logs so we don't forget to remove them
    "no-console": "warn",

    // Enforce consistent type imports
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],

    // No unused variables
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_" },
    ],

    // No explicit any
    "@typescript-eslint/no-explicit-any": "error",
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".next/",
    "*.config.js",
    "*.config.ts",
  ],
}