## What is this?

Easy way to sort imports on js, ts, and tsx files by regex matching the whole import line.

### Why does this exist?

This eslint plugin was created after researching and finding that import ordering plugins only check the import path and not the whole line, which is needed if you need to differentiate _what_ is imported from a file/library.

In my case, it was important to tell apart hooks (ie. React components starting with `use`) from components.

Plugins considered before this:

- eslint-plugin-import's [order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
- perfectionist's [sort-imports](https://perfectionist.dev/rules/sort-imports)

### Usage

In the eslintrc file, a rule that defines the regexPatterns should be added like so:

```json
{
  // ...
  "plugins": ["sort-imports-by-regex"],
  "rules": {
    "sort-imports-by-regex/regexPatterns": [
      "warn",
      {
        "regexPatterns": [
          // Example patterns
          "from.*react", // (react)
          "from.*react.*", // (react-hook-form, react-i18next, react-query, etc)
          "use.*from\\s*[\"'][^/.]+[\"']", // (library hooks)
          "use.*from", // (custom hooks)
          "from.*(?:/hooks/|use).*", // (custom hooks) - fallback match
          "from.*/components.*", // (components)
          "from.*/services.*", // (services)
          "from.*/utils.*", // (utils)
          "from.*/types.*", // (types)
          "from.*/queries.*", // (queries)
          "from.*/routes.*", // (routes)
          "from.*/i18n.*", // (i18n)
          "from.*/constants.*", // (constants)
          "import .*Icon.* from.*" // (icons)
          "from.*/config.*"
        ]
      }
    ]
  }
}
```
