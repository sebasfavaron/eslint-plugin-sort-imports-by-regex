module.exports = {
  rules: {
    regexPatterns: {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce imports to be ordered based on regex patterns',
        },
        fixable: 'code',
      },
      create(context) {
        if (!context.options[0]?.regexPatterns) {
          throw new Error(
            'You must provide an options object with a regexPatterns array'
          );
        }

        // Regexes do not need to be perfect, they just need to match what the previous regexes did not. Think of them as "this, and not the previous ones"
        const regexPatterns = context.options[0].regexPatterns.map(
          (pattern) => new RegExp(pattern)
        );

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
                message: 'Imports are not ordered according to the Style Guide',
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
