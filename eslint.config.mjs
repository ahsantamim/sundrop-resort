import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const next = compat.extends("next/core-web-vitals", "next/typescript");

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/dist/**",
      "uploads/**",
      "packages/data/.data/**",
      "**/next-env.d.ts",
    ],
  },
  ...next.map((config) => ({
    ...config,
    files: ["apps/**/*.{js,jsx,ts,tsx}"],
  })),
  {
    files: ["packages/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
