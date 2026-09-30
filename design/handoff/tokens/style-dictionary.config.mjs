export default {
  source: ['tokens/primitive.json', 'tokens/semantic.json', 'tokens/component.json'],
  platforms: {
    css: { transformGroup: 'css', buildPath: 'build/', files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }] },
    js: { transformGroup: 'js', buildPath: 'build/', files: [{ destination: 'tokens.mjs', format: 'javascript/es6' }] },
  },
};
// Tailwind-пресет собирается из build/tokens.css (theme.extend -> var(--...)).
