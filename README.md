# GitHub Action for Nerdbank.GitVersioning

This action install and runs the CLI for [https://github.com/AArnott/Nerdbank.GitVersioning](Nerdbank.GitVersioning). It does the equivelant of:
- dotnet tool install -g nbgv
- nbgv get-version -f json > nbgv.json
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
    - uses: ctaggart/nbgv@master
    - run: echo "NBGV_SemVer2 $NBGV_SemVer2"
```

The action runs in about 13 seconds.