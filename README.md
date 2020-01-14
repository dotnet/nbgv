# GitHub Action for Nerdbank.GitVersioning

This action installs and runs the CLI for [Nerdbank.GitVersioning](https://github.com/AArnott/Nerdbank.GitVersioning).
It does the equivalent of:

```bash
dotnet tool install -g nbgv
nbgv get-version -f json > nbgv.json
nbgv cloud --all-vars
```

## Example Workflow

``` yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: aarnott/nbgv@master
    - run: echo "NBGV_SemVer2 $NBGV_SemVer2"
```

The action runs in about 13 seconds.

Note that if using `actions/checkout@v2` (**v2**) you'll need to add a step before running this action:

```yml
    - name: Deep clone
      run: git fetch --prune --unshallow origin HEAD
```
