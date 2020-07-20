# Contributing

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
