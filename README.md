This eslint plugin was created after researching and finding that import ordering plugins only check the import path and not the whole line, which is needed if you need to differentiate _what_ is imported from a file/library.

The order precedence is fixed to adhere to a specific style guide and can be examined in the [index.js](index.js) file.

Plugins considered before this:

- eslint-plugin-import's [order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
- perfectionist's [sort-imports](https://perfectionist.dev/rules/sort-imports)
