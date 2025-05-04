// functions/eslint.config.cjs
const { FlatCompat } = require("@eslint/eslintrc");
const js               = require("@eslint/js");
const tsParser         = require("@typescript-eslint/parser");
const tsPlugin         = require("@typescript-eslint/eslint-plugin");
const importPlugin     = require("eslint-plugin-import");

// Initialize FlatCompat with the actual recommendedConfig object
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

// Flatten each shareable config so there’s no "extends" key
const importErrors     = compat.config({ extends: ["plugin:import/errors"] });
const importWarnings   = compat.config({ extends: ["plugin:import/warnings"] });
const importTypescript = compat.config({ extends: ["plugin:import/typescript"] });
const googleConfig     = compat.config({ extends: ["google"] });
const tsRecommended    = compat.config({ extends: ["plugin:@typescript-eslint/recommended"] });

module.exports = [
  // 1) Base ESLint JS recommended rules
  js.configs.recommended,

  // 2) All flattened plugin:import, Google, and TS configs
  ...importErrors,
  ...importWarnings,
  ...importTypescript,
  ...googleConfig,
  ...tsRecommended,

  // 3) Your custom overrides, only on real source files
  {
    files: ["src/**/*.js", "src/**/*.ts"],
    ignores: ["lib/**", "generated/**"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module"
      }
    },

    plugins: {
      import: importPlugin,
      "@typescript-eslint": tsPlugin
    },

    rules: {
      // Keep your existing style
      quotes: ["error", "single"],
      indent: ["error", 2],
      "import/no-unresolved": "off",

      // Relax these so your current code in src/ passes without changes
      "max-len": "off",
      "object-curly-spacing": "off"
    }
  }
];
