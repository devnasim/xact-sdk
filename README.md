# TypeScript starter for Lerna based projects

- https://github.com/lerna/lerna

### Installation

```
npm install
```

### Compile and publish

```
npm run publish
```

### Important bits

- Project have one packages which are connected to npm organization @xact-wallet-sdk/\*
- Each package have own tsconfig.json which inherit base config from project root
- Each package have _src_ folder where all _TypeScript_ files are placed
- Each package have custom npm script _tsc_, which is triggered by _lerna run tsc_ before publishing

### Integration

_integration_ folder download, install and use published packages from NPM.
