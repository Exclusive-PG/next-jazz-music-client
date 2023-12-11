/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ],
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    curly: ["error", "all"],
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      2,
      { checksVoidReturn: { attributes: false } },
    ],
    "import/no-unused-modules": [
      "warn",
      {
        unusedExports: true,
        ignoreExports: ["**/app/**/page.tsx", "./*.ts", "**/app/**/layout.tsx", "**/app/**/route.ts"],
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "clsx",
            message: "Use `import { cn } from '~/utilities/cn'` instead.",
          },
        ],
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "parent",
          "sibling",
          "index",
          "object",
          "unknown",
        ],
        pathGroups: [
          {
            pattern: "*.{jpg,png,svg}",
            group: "object",
            patternOptions: { matchBase: true },
            position: "after",
          },
          {
            pattern: "*.{css,scss}",
            group: "unknown",
            patternOptions: { matchBase: true },
            position: "after",
          },
          {
            pattern: "~/**",
            group: "parent",
          },
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true,
        ignoreCase: true,
        allowSeparatedGroups: true,
      },
    ],
    "import/newline-after-import": "error",

    "@typescript-eslint/no-floating-promises": "off",
  },
};

module.exports = config;
