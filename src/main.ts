import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as os from 'os'
import * as path from 'path'

async function run() {
  try {
    // install nbgv
    let exitCode = await exec.exec('dotnet', ['tool', 'install', '-g', 'nbgv'], { ignoreReturnCode: true });
    if (exitCode > 1) {
      throw new Error("dotnet tool install failed.");
    }

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

    // parse json and export all cloud variables
    const json = JSON.parse(jsonStr);
    for (const key in json.CloudBuildAllVars) {
      if (json.CloudBuildAllVars.hasOwnProperty(key)) {
        const element = json.CloudBuildAllVars[key];
        core.exportVariable(key, element);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
