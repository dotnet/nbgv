import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from 'os'
import * as path from 'path'

async function run() {
  try {
    const toolVersion = core.getInput('toolVersion');
    const dir_path = core.getInput('path');
    const setCommonVars = core.getInput('setCommonVars') === 'true';
    const setAllVars = core.getInput('setAllVars') === 'true';

    // install nbgv
    let installArgs = ['tool', 'install', '-g', 'nbgv'];
    if (toolVersion) {
      installArgs.push('--version', toolVersion);
    }

    let exitCode = await exec.exec('dotnet', installArgs, { ignoreReturnCode: true });
    if (exitCode > 1) {
      throw new Error("dotnet tool install failed.");
    }

    // add .dotnet/tools to the path
    core.addPath(path.join(os.homedir(), '.dotnet', 'tools'));

    // Collect a JSON string of all the version properties.
    let args = ['get-version', '-f', 'json'];
    if (dir_path) {
      args.push('-p', dir_path);
    }
    let versionJson = '';
    await exec.exec('nbgv', args, { listeners: { stdout: (data: Buffer) => { versionJson += data.toString() } } });
    core.setOutput('versionJson', versionJson);

    // Break up the JSON into individual outputs.
    const versionProperties = JSON.parse(versionJson);
    for (let name in versionProperties.CloudBuildAllVars) {
      // Trim off the leading NBGV_
      core.setOutput(name.substring(5), versionProperties.CloudBuildAllVars[name]);
    }

    // Set environment variables if desired.
    if (setCommonVars || setAllVars) {
      args = ['cloud'];
      if (dir_path) {
        args.push('-p', dir_path);
      }
      if (setCommonVars) {
        args.push('-c');
      }
      if (setAllVars) {
        args.push('-a');
      }

      await exec.exec('nbgv', args);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
