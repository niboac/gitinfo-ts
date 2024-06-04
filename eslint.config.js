import js from "@eslint/js";

export default [
  js.configs.recommended, // Recommended config applied to all files
  // File-pattern specific overrides
  {
    ignores: ['./node_modules/*', './dist/*']
  }
];