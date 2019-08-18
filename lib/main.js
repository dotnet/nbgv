"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
const fs = __importStar(require("fs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const myInput = core.getInput('myInput');
            core.debug(`Hello ${myInput}`);
            core.warning(`warning a Hello ${myInput}`);
            // https://github.com/actions/toolkit/tree/master/packages/exec
            yield exec.exec('dotnet', ['tool', 'install', '-g', 'nbgv']);
            // core.addPath('pathToTool');
            let json = fs.createWriteStream('nbgv.json');
            yield exec.exec('nbgv', ['get-version', '-f', 'json'], {
                outStream: json
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
