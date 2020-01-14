# GitHub Action for Nerdbank.GitVersioning

[![GitHub Actions status](https://github.com/aarnott/nbgv/workflows/CI/PR/badge.svg)](https://github.com/AArnott/nbgv/actions)

This action installs and runs the CLI for [Nerdbank.GitVersioning](https://github.com/AArnott/Nerdbank.GitVersioning).
It does the equivalent of:

```bash
dotnet tool install -g nbgv
nbgv get-version -f json > nbgv.json
nbgv cloud --all-vars
```

This sets many environment variables to the various forms of the version for your repo or project.

## Inputs

### Path

**Optional** The path to the directory for which the version should be determined. This should be at or below the directory containing the version.json file. Default is repo root directory.

## Example usage

``` yaml
- uses: aarnott/nbgv@master
  with:
    path: src # optional path to directory to compute version for
- run: echo "NBGV_SemVer2 $NBGV_SemVer2"
```

The action runs in about 13 seconds.

Git history based versioning tools rely on history being included in the clone.
`actions/checkout@v1` does this by default.
But if you're using `actions/checkout@v2` you'll need to add a step **before** running this action:

```yml
- name: Deep clone
  run: git fetch --prune --unshallow origin HEAD
```
