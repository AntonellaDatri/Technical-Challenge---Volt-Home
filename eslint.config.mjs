import globals from "globals";
import pluginJs from "@eslint/js";
import { configs as tsConfigs } from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["*.{js,mjs,cjs,ts}"], // Filtro de archivos correcto
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "prefer-const": "error",
      "max-len": ["error", { code: 120 }],
      "@typescript-eslint/no-explicit-any": "off", // Desactiva la regla que prohíbe el uso de `any`
    },
    ...pluginJs.configs.recommended,
    ...tsConfigs.recommended,
  },
];