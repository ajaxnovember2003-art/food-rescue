import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
  // Generated Convex code and build output are not ours to lint.
  { ignores: ["dist", "src/convex/_generated"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Last block wins in flat config. The remaining react-refresh warnings are
    // about HMR granularity, not correctness: shadcn/ui components
    // intentionally co-locate their `*Variants` exports, the demo store exports
    // its context alongside the provider, and the hosting toolbar is not ours.
    // Splitting those would break their documented public imports, so the rule
    // is off for these modules only.
    files: [
      "src/components/ui/**/*.{ts,tsx}",
      "src/store/**/*.tsx",
      "vly-toolbar-readonly.tsx",
    ],
    rules: { "react-refresh/only-export-components": "off" },
  },
);
