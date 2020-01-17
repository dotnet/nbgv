import * as core from '@actions/core';
import { exec } from '@actions/exec';
import * as os from 'os'
import * as path from 'path'
import { Inputs } from './settings';

async function run() {
  try {
    // install nbgv
    let installArgs = ['tool', 'install', '-g', 'nbgv'];
    if (Inputs.toolVersion) {
      installArgs.push('--version', Inputs.toolVersion);
    }

    let exitCode = await exec('dotnet', installArgs, { ignoreReturnCode: true });
    if (exitCode > 1) {
      throw new Error("dotnet tool install failed.");
    }

    // add .dotnet/tools to the path
    core.addPath(path.join(os.homedir(), '.dotnet', 'tools'));

    // Collect a JSON string of all the version properties.
    let args = ['get-version', '-f', 'json'];
    if (Inputs.path) {
      args.push('-p', Inputs.path);
    }
    let versionJson = '';
    await exec('nbgv', args, { listeners: { stdout: (data: Buffer) => { versionJson += data.toString() } } });
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

      await exec('nbgv', args);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
