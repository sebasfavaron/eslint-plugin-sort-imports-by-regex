module.exports = {
  rules: {
    'order-imports-by-regex': {
      create(context) {
        return {
          Program(node) {
            const imports = node.body.filter(
              (n) => n.type === 'ImportDeclaration'
            );

            // Define your regex and sorting logic here
            const regex = /your-regex/;
            const sortedImports = imports.slice().sort((a, b) => {
              const aMatches = regex.test(a.source.value);
              const bMatches = regex.test(b.source.value);

              if (aMatches && !bMatches) return -1;
              if (!aMatches && bMatches) return 1;
              return a.source.value.localeCompare(b.source.value);
            });

            imports.forEach((imp, i) => {
              if (imp !== sortedImports[i]) {
                context.report({
                  node: imp,
                  message: 'Imports are not ordered by regex!',
                  fix(fixer) {
                    const sourceCode = context.getSourceCode();
                    const sortedText = sortedImports
                      .map((si) => sourceCode.getText(si))
                      .join('\n');
                    return fixer.replaceTextRange(
                      [imports[0].start, imports[imports.length - 1].end],
                      sortedText
                    );
                  },
                });
              }
            });
          },
        };
      },
    },
  },
};
