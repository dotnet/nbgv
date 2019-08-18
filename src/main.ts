import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as os from 'os'
import * as path from 'path'

export interface CloudBuildAllVars {
  NBGV_CloudBuildNumber: string;
  NBGV_VersionFileFound: string;
  NBGV_AssemblyVersion: string;
  NBGV_AssemblyFileVersion: string;
  NBGV_AssemblyInformationalVersion: string;
  NBGV_PublicRelease: string;
  NBGV_PrereleaseVersion: string;
  NBGV_PrereleaseVersionNoLeadingHyphen: string;
  NBGV_SimpleVersion: string;
  NBGV_BuildNumber: string;
  NBGV_VersionRevision: string;
  NBGV_MajorMinorVersion: string;
  NBGV_VersionMajor: string;
  NBGV_VersionMinor: string;
  NBGV_GitCommitId: string;
  NBGV_GitCommitIdShort: string;
  NBGV_GitCommitDate: string;
  NBGV_VersionHeight: string;
  NBGV_VersionHeightOffset: string;
  NBGV_Version: string;
  NBGV_BuildMetadataFragment: string;
  NBGV_NuGetPackageVersion: string;
  NBGV_ChocolateyPackageVersion: string;
  NBGV_NpmPackageVersion: string;
  NBGV_SemVer1: string;
  NBGV_SemVer2: string;
  NBGV_SemVer1NumericIdentifierPadding: string;
}

export interface CloudBuildVersionVars {
  GitAssemblyInformationalVersion: string;
  GitBuildVersion: string;
  GitBuildVersionSimple: string;
}

export interface Nbgv {
  CloudBuildNumber: string;
  CloudBuildNumberEnabled: boolean;
  BuildMetadataWithCommitId: string[];
  VersionFileFound: boolean;
  VersionOptions?: any;
  AssemblyVersion: string;
  AssemblyFileVersion: string;
  AssemblyInformationalVersion: string;
  PublicRelease: boolean;
  PrereleaseVersion: string;
  PrereleaseVersionNoLeadingHyphen: string;
  SimpleVersion: string;
  BuildNumber: number;
  VersionRevision: number;
  MajorMinorVersion: string;
  VersionMajor: number;
  VersionMinor: number;
  GitCommitId: string;
  GitCommitIdShort: string;
  GitCommitDate: Date;
  VersionHeight: number;
  VersionHeightOffset: number;
  Version: string;
  CloudBuildAllVarsEnabled: boolean;
  CloudBuildAllVars: CloudBuildAllVars;
  CloudBuildVersionVarsEnabled: boolean;
  CloudBuildVersionVars: CloudBuildVersionVars;
  BuildMetadata: any[];
  BuildMetadataFragment: string;
  NuGetPackageVersion: string;
  ChocolateyPackageVersion: string;
  NpmPackageVersion: string;
  SemVer1: string;
  SemVer2: string;
  SemVer1NumericIdentifierPadding: number;
}

async function run() {
  try {
    // install nbgv
    await exec.exec('dotnet', ['tool', 'install', '-g', 'nbgv']);
    // add .dotnet/tools to the path
    core.addPath(path.join(os.homedir(), '.dotnet', 'tools'));

    // run nbgv
    let jsonStr = '';
    await exec.exec('nbgv', ['get-version', '-f', 'json'], {
      listeners: {
        stdout: (data) => {
          jsonStr += data.toString();
        }
      }
    });

    // write nbgv.json
    await new Promise((resolve, reject) => {
      fs.writeFile('nbgv.json', jsonStr, err => {
        if(err) reject(err);
        resolve();
      });
    });

    // parse json and export all cloud variables
    const json: Nbgv = JSON.parse(jsonStr);
    core.exportVariable('NBGV_CloudBuildNumber', json.CloudBuildAllVars.NBGV_CloudBuildNumber);
    core.exportVariable('NBGV_VersionFileFound', json.CloudBuildAllVars.NBGV_VersionFileFound);
    core.exportVariable('NBGV_AssemblyVersion', json.CloudBuildAllVars.NBGV_AssemblyVersion);
    core.exportVariable('NBGV_AssemblyFileVersion', json.CloudBuildAllVars.NBGV_AssemblyFileVersion);
    core.exportVariable('NBGV_AssemblyInformationalVersion', json.CloudBuildAllVars.NBGV_AssemblyInformationalVersion);
    core.exportVariable('NBGV_AssemblyFileVersion', json.CloudBuildAllVars.NBGV_AssemblyFileVersion);
    core.exportVariable('NBGV_PublicRelease', json.CloudBuildAllVars.NBGV_PublicRelease);
    core.exportVariable('NBGV_PrereleaseVersion', json.CloudBuildAllVars.NBGV_PrereleaseVersion);
    core.exportVariable('NBGV_PrereleaseVersionNoLeadingHyphen', json.CloudBuildAllVars.NBGV_PrereleaseVersionNoLeadingHyphen);
    core.exportVariable('NBGV_SimpleVersion', json.CloudBuildAllVars.NBGV_SimpleVersion);
    core.exportVariable('NBGV_BuildNumber', json.CloudBuildAllVars.NBGV_BuildNumber);
    core.exportVariable('NBGV_VersionRevision', json.CloudBuildAllVars.NBGV_VersionRevision);
    core.exportVariable('NBGV_MajorMinorVersion', json.CloudBuildAllVars.NBGV_MajorMinorVersion);
    core.exportVariable('NBGV_VersionMajor', json.CloudBuildAllVars.NBGV_VersionMajor);
    core.exportVariable('NBGV_VersionMinor', json.CloudBuildAllVars.NBGV_VersionMinor);
    core.exportVariable('NBGV_GitCommitId', json.CloudBuildAllVars.NBGV_GitCommitId);
    core.exportVariable('NBGV_GitCommitIdShort', json.CloudBuildAllVars.NBGV_GitCommitIdShort);
    core.exportVariable('NBGV_GitCommitDate', json.CloudBuildAllVars.NBGV_GitCommitDate);
    core.exportVariable('NBGV_VersionHeight', json.CloudBuildAllVars.NBGV_VersionHeight);
    core.exportVariable('NBGV_VersionHeightOffset', json.CloudBuildAllVars.NBGV_VersionHeightOffset);
    core.exportVariable('NBGV_Version', json.CloudBuildAllVars.NBGV_Version);
    core.exportVariable('NBGV_BuildMetadataFragment', json.CloudBuildAllVars.NBGV_BuildMetadataFragment);
    core.exportVariable('NBGV_NuGetPackageVersion', json.CloudBuildAllVars.NBGV_NuGetPackageVersion);
    core.exportVariable('NBGV_ChocolateyPackageVersion', json.CloudBuildAllVars.NBGV_ChocolateyPackageVersion);
    core.exportVariable('NBGV_NpmPackageVersion', json.CloudBuildAllVars.NBGV_NpmPackageVersion);
    core.exportVariable('NBGV_SemVer1', json.CloudBuildAllVars.NBGV_SemVer1);
    core.exportVariable('NBGV_SemVer2', json.CloudBuildAllVars.NBGV_SemVer2);
    core.exportVariable('NBGV_SemVer1NumericIdentifierPadding', json.CloudBuildAllVars.NBGV_SemVer1NumericIdentifierPadding);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();