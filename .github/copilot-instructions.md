# Copilot Instructions

## Project Overview

This is a **GitHub Action** (TypeScript) that installs the [Nerdbank.GitVersioning](https://github.com/AArnott/Nerdbank.GitVersioning) dotnet CLI tool (`nbgv`) and exposes version data as action outputs and environment variables. It runs on Node 24 (`action.yml`).

## Build & Test

```bash
yarn                # Install dependencies (uses Yarn 4 — see .yarnrc.yml)
yarn run build      # Type-check with tsc, then bundle with esbuild → dist/index.js
yarn test           # Run Jest tests
yarn test -- -t "test name"  # Run a single test by name
```

## Key Conventions

- **`dist/index.js` is committed to source control.** Every PR must include a freshly built `dist/index.js`. The CI `check_diff` job verifies this — if you change source or dependencies, run `yarn run build` and commit the result.
- **Build = type-check + bundle.** `tsc --noEmit` checks types only; `esbuild` produces the single-file bundle at `dist/index.js`. There is no separate compile step that emits JS to an `outDir`.
- **Strict TypeScript** is enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`). Test files (`**/*.test.ts`) are excluded from compilation.

## Architecture

The action has two source files:

- **`src/settings.ts`** — `Inputs` class with static getters that read action inputs via `@actions/core`.
- **`src/main.ts`** — Entry point. Two execution paths depending on .NET SDK version:
  - **.NET 10+**: Uses `dotnet tool exec nbgv` (avoids PATH/DOTNET_ROOT issues).
  - **Older SDKs**: Installs `nbgv` as a global dotnet tool, then invokes it directly.

After obtaining version JSON from `nbgv get-version`, it sets action outputs, optionally sets environment variables (`cloud -c` / `cloud -a`), and optionally stamps a `package.json` with the computed npm version.

## CI

CI is defined in `.github/workflows/checkin.yml`. It runs three jobs:

- **`check_diff`** — Builds and verifies `dist/index.js` has no uncommitted changes.
- **`test`** — Runs the action itself (`uses: ./`) across a matrix of OS runners (Ubuntu, Windows, macOS) using the primary .NET SDK version (for example, from `global.json`) to verify end-to-end behavior.
- **`test-dotnet8`** — Runs the same end-to-end tests pinned to .NET 8 to ensure the action continues to work with the latest .NET SDK.
