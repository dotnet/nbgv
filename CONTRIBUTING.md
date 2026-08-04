# Contributing

## Basic dev workflow

This repo uses `pnpm` to restore packages.

```bash
pnpm install
```

To build the action:

```bash
pnpm run build
```

To run the action:

```bash
node dist/index.js
```

## To commit

Always build with the command given above before finalizing a branch for a pull request.
The `dist/index.js` file is under source control and is updated by running a build to apply
all changes to code or dependencies.

Any changes made but not applied to `dist/index.js` will result in the PR validation failing.
