import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as os from 'os'
import * as path from 'path'
import * as semver from 'semver'
import { Inputs } from './settings';

async function getDotnetSdkVersion(): Promise<string> {
  let version = '';
  await exec('dotnet', ['--version'], {
    listeners: { stdout: (data: Buffer) => { version += data.toString() } },
    silent: true
  });
  return version.trim();
}

async function run() {
  try {
    const sdkVersion = await getDotnetSdkVersion();
    const useToolExec = semver.valid(sdkVersion) !== null && semver.gte(sdkVersion, '10.0.0');

    // Set up how we invoke nbgv depending on the SDK version.
    let nbgvCommand: string;
    let nbgvBaseArgs: string[];

    if (useToolExec) {
      // .NET 10+ supports `dotnet tool exec` which locates the runtime itself
      // (avoids PATH/DOTNET_ROOT issues — see issue #180).
      nbgvCommand = 'dotnet';
      nbgvBaseArgs = ["tool", "exec", "nbgv"];
      if (Inputs.toolVersion) { nbgvBaseArgs.push("--version", Inputs.toolVersion); }
      if (Inputs.toolFeed) { nbgvBaseArgs.push("--add-source", Inputs.toolFeed); }
      nbgvBaseArgs.push("-y", "--verbosity", "quiet", "--");
    } else {
      // Older SDKs: install the tool globally and invoke it directly.
      let installArgs = ['tool', 'install', '-g', 'nbgv'];
      if (Inputs.toolVersion) {
        installArgs[1] = 'update'; // 'update' will either install or change the version.
        installArgs.push('--version', Inputs.toolVersion);
      }
      if (Inputs.toolFeed) {
        installArgs.push('--add-source', Inputs.toolFeed);
      }

      let exitCode = await exec('dotnet', installArgs, { ignoreReturnCode: true });
      if (exitCode > 1) {
        throw new Error("dotnet tool install failed.");
      }

      core.addPath(path.join(os.homedir(), '.dotnet', 'tools'));

      nbgvCommand = 'nbgv';
      nbgvBaseArgs = [];
    }

    // Collect a JSON string of all the version properties.
    let args = ['get-version', '-f', 'json'];
    if (Inputs.path) {
      args.push('-p', Inputs.path);
    }
    let versionJson = '';
    await exec(nbgvCommand, [...nbgvBaseArgs, ...args], { listeners: { stdout: (data: Buffer) => { versionJson += data.toString() } } });
    core.setOutput('versionJson', versionJson);

    // Break up the JSON into individual outputs.
    const versionProperties = JSON.parse(versionJson);
    for (let name in versionProperties.CloudBuildAllVars) {
      // Trim off the leading NBGV_
      core.setOutput(name.substring(5), versionProperties.CloudBuildAllVars[name]);
    }

    // Set environment variables if desired.
    if (Inputs.setCommonVars || Inputs.setAllVars) {
      args = ['cloud'];
      if (Inputs.path) {
        args.push('-p', Inputs.path);
      }
      if (Inputs.setCommonVars) {
        args.push('-c');
      }
      if (Inputs.setAllVars) {
        args.push('-a');
      }

      await exec(nbgvCommand, [...nbgvBaseArgs, ...args]);
    }

    // Stamp the version on an existing file, if desired.
    if (Inputs.stamp) {
      if (path.basename(Inputs.stamp) === 'package.json') {
        await exec('npm', ['version', versionProperties.NpmPackageVersion, '--git-tag-version=false', '--allow-same-version'], { cwd: path.dirname(Inputs.stamp) });
      } else {
        throw new Error(`Unable to stamp unsupported file format: ${path.basename(Inputs.stamp)}`);
      }
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
