import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

async function run() {
  try {
    const myInput = core.getInput('myInput');
    core.debug(`Hello ${myInput}`);
    core.warning(`warning a Hello ${myInput}`)

    // https://github.com/actions/toolkit/tree/master/packages/exec
    await exec.exec('dotnet', ['tool', 'install', '-g', 'nbgv']);

    
    // core.addPath('pathToTool');

    let json = fs.createWriteStream('nbgv.json');
    await exec.exec('nbgv', ['get-version', '-f', 'json'], {
      outStream: json
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();