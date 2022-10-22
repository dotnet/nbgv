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
      installArgs[1] = 'update'; // using 'update' will either install, or will change the version to what we want.
      installArgs.push('--version', Inputs.toolVersion);
    }

    if (Inputs.toolFeed) {
      installArgs.push('--add-source', Inputs.toolFeed);
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
