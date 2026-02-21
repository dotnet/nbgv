import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as path from 'path'
import { Inputs } from './settings';

async function run() {
  try {
    // Use dotnet tool exec so dotnet locates the runtime itself (avoids PATH/DOTNET_ROOT issues).
    const baseArgs: string[] = ["tool", "exec", "nbgv"];
    if (Inputs.toolVersion) { baseArgs.push("--version", Inputs.toolVersion); }
    if (Inputs.toolFeed) { baseArgs.push("--add-source", Inputs.toolFeed); }
    baseArgs.push("--");

    // Collect a JSON string of all the version properties.
    let args = ['get-version', '-f', 'json'];
    if (Inputs.path) {
      args.push('-p', Inputs.path);
    }
    let versionJson = '';
    await exec('dotnet', [...baseArgs, ...args], { listeners: { stdout: (data: Buffer) => { versionJson += data.toString() } } });
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

      await exec('dotnet', [...baseArgs, ...args]);
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
