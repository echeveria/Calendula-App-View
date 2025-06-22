export default {
  // Basic formatting options
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,

  // JSX specific options
  jsxSingleQuote: false,

  // HTML specific options
  htmlWhitespaceSensitivity: "css",

  // Override parser for specific file types
  overrides: [
    {
      files: ["*.tsx", "*.jsx"],
      options: {
        parser: "typescript",
      },
    },
  ],
};
