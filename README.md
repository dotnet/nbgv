# GitHub Action for Nerdbank.GitVersioning

[![GitHub Actions status](https://github.com/dotnet/nbgv/workflows/CI/PR/badge.svg)](https://github.com/dotnet/nbgv/actions)

This action installs the CLI for [Nerdbank.GitVersioning](https://github.com/AArnott/Nerdbank.GitVersioning)
and exposes version data from it as action outputs.
It optionally also sets environment variables.

⌚ The action runs in about 13 seconds.

This project is supported by the [.NET Foundation](https://dotnetfoundation.org).

## Inputs

All inputs are optional.

|Name|Default|Description
|--|--|--|
`path`|Repo root|The path to the directory for which the version should be determined. This should be at or below the directory containing the version.json file.
`setCommonVars`|false|Defines a few common version variables as environment variables, with a "Git" prefix (e.g. GitBuildVersion, GitBuildVersionSimple, GitAssemblyInformationalVersion). Adds the `--common-vars` switch to the `nbgv cloud` command.
`setAllVars`|false|Defines ALL version variables as environment variables, with a "NBGV_" prefix. Adds the `--all-vars` switch to the `nbgv cloud` command.
`stamp`||The path to a file whose version setting should be changed to match the computed version. Supported file types: `package.json`
`toolVersion`|latest stable|The version of the nbgv dotnet CLI tool to install and use. If not specified, the default is the latest stable version.

## Outputs

Name | Description
--|--
CloudBuildNumber|The cloud build number
VersionFileFound|A boolean value indicating whether a version.json file was found.
AssemblyVersion|The version to be used as the .NET assembly version.
AssemblyFileVersion|The version to be used as the .NET assembly file version.
AssemblyInformationalVersion|The version to be used as the .NET assembly informational version.
PublicRelease|A boolean value indicating whether this build is recognized as building from a public release branch.
PrereleaseVersion|The prerelease/unstable suffix to the version, including the hyphen.
PrereleaseVersionNoLeadingHyphen|The prerelease/unstable suffix to the version, without the leading hyphen.
SimpleVersion|The first 3 integers of the version.
BuildNumber|The build number (i.e. the third integer or PATCH) for this version.
VersionRevision|The fourth integer component of the version.
MajorMinorVersion|The "major.minor" portion of the version.
VersionMajor|The first integer of the version.
VersionMinor|The second integer of the version.
GitCommitId|The full SHA1 hash of the HEAD commit.
GitCommitIdShort|A truncated SHA1 hash of the HEAD commit (usually 10 characters)
GitCommitDate|The date of the git commit at HEAD
VersionHeight|The number of commits in the longest single path between the specified commit and the most distant ancestor (inclusive) that set the version to the value at HEAD.
VersionHeightOffset|The offset to add to VersionHeight when calculating the BuildNumber or wherever else the VersionHeight is used.
Version|The four integer version.
BuildMetadataFragment|The +metadata portion of the version, if any.
NuGetPackageVersion|The version to be used for NuGet packages.
ChocolateyPackageVersion|The version to be used for Chocolatey packages.
NpmPackageVersion|The version to be used for NPM packages.
SemVer1|The SemVer 1.0 compliant version.
SemVer2|The SemVer 2.0 compliant version.

## Example usage

### Using step outputs

```yaml
- uses: dotnet/nbgv@master
  id: nbgv
- run: echo 'SemVer2: ${{ steps.nbgv.outputs.SemVer2 }}'
```

### Using environment variables

```yaml
- uses: dotnet/nbgv@master
  with:
    setAllVars: true
- run: echo "NBGV_SemVer2 $NBGV_SemVer2"
```

### Stamp the version on a package.json file

```yaml
- uses: dotnet/nbgv@master
  with:
    stamp: package.json
```

## Checkout requirements

Git history based versioning tools rely on history being included in the clone.
`actions/checkout@v1` does this by default.
But if you're using `actions/checkout@v2` you'll need to specify deep clone:

```yml
- uses: actions/checkout@v2
  with:
    fetch-depth: 0 # avoid shallow clone so nbgv can do its work.
```

## Contribution guidelines

Prerequisites and build instructions are found in our
[contributing guidelines](CONTRIBUTING.md).

This project has adopted the code of conduct defined by the Contributor Covenant
to clarify expected behavior in our community.

For more information, see the [.NET Foundation Code of Conduct](https://dotnetfoundation.org/code-of-conduct).
