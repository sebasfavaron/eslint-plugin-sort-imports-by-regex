module.exports = {
  rules: {
    'order-imports-by-regex': {
      meta: {
        type: 'problem', // Keep it as 'problem' to enforce a rule
        docs: {
          description: 'Enforce imports to be ordered based on regex patterns',
        },
        fixable: 'code',
      },
      create(context) {
        let regexPatterns = [
          /from.*react/, // Step 1
          /from.*react.*/, // Step 2
          /use.*from\s*['"][^/.]+['"]/, // Step 3 (library hooks)
          /use.*from/, // Step 4 (custom hooks)
          /from.*(?:\/hooks\/|use).*/, // Step 4 (custom hooks) - alternative
          /from.*@mui.*/, // Step 5 (mui)
          /from.*material-hu/, // Step 6 (material-hu)
          /from.*material-hu\/.*/, // Step 5-6 (material-hu + icons)
          /from.*@fortawesome\/react-fontawesome/, // Step 6 (fontawesome icons)
          /from\s*['"][^/.]+['"]/, // Step 7 (library components)
          /from.*\/components.*/, // Step 8 (components) (does not see components in same folder)
          /from.*\/services.*/, // Step 9 (services)
          /from.*\/utils.*/, // Step 10 (utils)
          /from.*\/types.*/, // Step 11 (types)
          /from.*\/queries.*/, // Step 12 (queries)
          /from.*\/routes.*/, // Step 13 (routes)
          /from.*\/i18n.*/, // Step 14 (i18n)
          /from.*\/constants.*/,
          /from.*\/config.*/,
        ];

        return {
          Program(node) {
            const imports = node.body.filter(
              (n) => n.type === 'ImportDeclaration'
            );

            // Create an array to hold groups of imports based on regex matches
            const groupedImports = regexPatterns.map(() => []);
            const unmatchedImports = [];

            const sourceCode = context.getSourceCode();
            // Group imports based on regex patterns
            imports.forEach((imp) => {
              const importText = sourceCode.getText(imp);
              let matched = false;

              for (let index = 0; index < regexPatterns.length; index++) {
                const regex = regexPatterns[index];
                console.log('regex', regex, importText, regex.test(importText));
                if (regex.test(importText)) {
                  groupedImports[index].push(imp);
                  matched = true;
                  break; // Stop looking for matches once a match is found
                }
              }

              // If no regex matched, push to unmatched imports
              if (!matched) {
                unmatchedImports.push(imp);
              }
            });

            // Flatten the grouped imports while preserving order
            const sortedImports = groupedImports
              .flat()
              .concat(unmatchedImports);

            // Check if the order has changed
            const originalOrder = imports.map((n) => sourceCode.getText(n));
            const newOrder = sortedImports.map((n) => sourceCode.getText(n));

            if (JSON.stringify(originalOrder) !== JSON.stringify(newOrder)) {
              context.report({
                node: imports[0], // Report on the first import node
                message:
                  'Imports are not ordered according to Style Guide (https://www.notion.so/humand-co/Style-Guide-e54f5b033dfe4dbeb7a319f9c357d825)!',
                fix(fixer) {
                  const sortedText = newOrder.join('\n') + '\n'; // Join sorted imports with newline

                  const rangeStart = imports[0].range[0];
                  const rangeEnd = imports[imports.length - 1].range[1];

                  return fixer.replaceTextRange(
                    [rangeStart, rangeEnd],
                    sortedText
                  );
                },
              });
            }
          },
        };
      },
    },
  },
};
