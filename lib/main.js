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
const os = __importStar(require("os"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // install nbgv
            yield exec.exec('dotnet', ['tool', 'install', '-g', 'nbgv']);
            // add .dotnet/tools to the path
            core.addPath(path.join(os.homedir(), '.dotnet', 'tools'));
            // run nbgv and save to nbgv.json
            yield exec.exec('nbgv', ['get-version', '-f', 'json'], {
                silent: true,
                outStream: fs.createWriteStream('nbgv.json')
            });
            // read the nbjv.json and export all cloud variables
            const json = JSON.parse(fs.readFileSync('nbgv.json', 'utf8'));
            core.exportVariable('NBGV_CloudBuildNumber', json.CloudBuildAllVars.NBGV_CloudBuildNumber);
            core.exportVariable('NBGV_VersionFileFound', json.CloudBuildAllVars.NBGV_VersionFileFound);
            core.exportVariable('NBGV_AssemblyVersion', json.CloudBuildAllVars.NBGV_AssemblyVersion);
            core.exportVariable('NBGV_AssemblyFileVersion', json.CloudBuildAllVars.NBGV_AssemblyFileVersion);
            core.exportVariable('NBGV_AssemblyInformationalVersion', json.CloudBuildAllVars.NBGV_AssemblyInformationalVersion);
            core.exportVariable('NBGV_AssemblyFileVersion', json.CloudBuildAllVars.NBGV_AssemblyFileVersion);
            core.exportVariable('NBGV_PublicRelease', json.CloudBuildAllVars.NBGV_PublicRelease);
            core.exportVariable('NBGV_PrereleaseVersion', json.CloudBuildAllVars.NBGV_PrereleaseVersion);
            core.exportVariable('NBGV_PrereleaseVersionNoLeadingHyphen', json.CloudBuildAllVars.NBGV_PrereleaseVersionNoLeadingHyphen);
            core.exportVariable('NBGV_SimpleVersion', json.CloudBuildAllVars.NBGV_SimpleVersion);
            core.exportVariable('NBGV_BuildNumber', json.CloudBuildAllVars.NBGV_BuildNumber);
            core.exportVariable('NBGV_VersionRevision', json.CloudBuildAllVars.NBGV_VersionRevision);
            core.exportVariable('NBGV_MajorMinorVersion', json.CloudBuildAllVars.NBGV_MajorMinorVersion);
            core.exportVariable('NBGV_VersionMajor', json.CloudBuildAllVars.NBGV_VersionMajor);
            core.exportVariable('NBGV_VersionMinor', json.CloudBuildAllVars.NBGV_VersionMinor);
            core.exportVariable('NBGV_GitCommitId', json.CloudBuildAllVars.NBGV_GitCommitId);
            core.exportVariable('NBGV_GitCommitIdShort', json.CloudBuildAllVars.NBGV_GitCommitIdShort);
            core.exportVariable('NBGV_GitCommitDate', json.CloudBuildAllVars.NBGV_GitCommitDate);
            core.exportVariable('NBGV_VersionHeight', json.CloudBuildAllVars.NBGV_VersionHeight);
            core.exportVariable('NBGV_VersionHeightOffset', json.CloudBuildAllVars.NBGV_VersionHeightOffset);
            core.exportVariable('NBGV_Version', json.CloudBuildAllVars.NBGV_Version);
            core.exportVariable('NBGV_BuildMetadataFragment', json.CloudBuildAllVars.NBGV_BuildMetadataFragment);
            core.exportVariable('NBGV_NuGetPackageVersion', json.CloudBuildAllVars.NBGV_NuGetPackageVersion);
            core.exportVariable('NBGV_ChocolateyPackageVersion', json.CloudBuildAllVars.NBGV_ChocolateyPackageVersion);
            core.exportVariable('NBGV_NpmPackageVersion', json.CloudBuildAllVars.NBGV_NpmPackageVersion);
            core.exportVariable('NBGV_SemVer1', json.CloudBuildAllVars.NBGV_SemVer1);
            core.exportVariable('NBGV_SemVer2', json.CloudBuildAllVars.NBGV_SemVer2);
            core.exportVariable('NBGV_SemVer1NumericIdentifierPadding', json.CloudBuildAllVars.NBGV_SemVer1NumericIdentifierPadding);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
