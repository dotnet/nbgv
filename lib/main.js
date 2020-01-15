"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // install nbgv
            let installArgs = ['tool', 'install', '-g', 'nbgv'];
            const toolVersion = core.getInput('toolVersion');
            if (toolVersion) {
                installArgs.push('--version', toolVersion);
            }
            let exitCode = yield exec.exec('dotnet', installArgs, { ignoreReturnCode: true });
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
            yield exec.exec('nbgv', args);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
