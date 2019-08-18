# GitHub Action for Nerdbank.GitVersioning

This action installs and runs the CLI for [Nerdbank.GitVersioning](https://github.com/AArnott/Nerdbank.GitVersioning).
It does the equivalent of:

```bash
dotnet tool install -g nbgv
nbgv get-version -f json > nbgv.json
```

It also sets all the cloud environment variables.

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
