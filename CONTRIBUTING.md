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

Always build with the command given above before finalizing a branch for a pull request.
The `dist/index.js` file is under source control and is updated by running a build to apply
all changes to code or dependencies.

Any changes made but not applied to `dist/index.js` will result in the PR validation failing.
