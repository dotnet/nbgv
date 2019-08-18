# Contributing

This project has adopted the [Microsoft Open Source Code of
Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct
FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com)
with any additional questions or comments.

## Basic dev workflow

This repo uses `yarn` to restore packages.

```bash
yarn
```

To build the action:

```bash
yarn run build
```

To run the action:

```bash
node lib/main.js
```

## To commit

GitHub Actions require that we commit all production dependencies into git.
The dev workflow above results in dev dependencies being restored as well,
so clean up all node_modules and then install just the production ones.

```bash
git clean -fdx :/node_modules
yarn --production
git add :/node_modules
```
