import * as core from '@actions/core';
import * as exec from '@actions/exec';
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
    let args = ['cloud'];
    const dir_path = core.getInput('path');
    if (dir_path) {
      args.push('-p', dir_path);
    }
    if (core.getInput('commonVars') === 'true') {
      args.push('-c');
    }
    if (core.getInput('allVars') === 'true') {
      args.push('-a');
    }

    await exec.exec('nbgv', args);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
