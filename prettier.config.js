module.exports = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: false,
  printWidth: 100,
  semi: true,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: true,
  svelteSortOrder: "options-scripts-markup-styles",
  svelteIndentScriptAndStyle: true,
  plugins: [
    require.resolve("prettier-plugin-svelte", {
      // @lj: i tried everything on my end. no other solution works. some deno+node+emacs weirdness. i dont know why. gotta be hardcoded.
      paths: ["/Users/finn/.nvm/versions/node/v20.17.0/lib/node_modules"],
    }),
  ],

  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
