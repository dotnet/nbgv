import * as core from '@actions/core';

export class Inputs {
    static get path(): string | undefined {
        const result = core.getInput('path');
        return result === '' || result === null ? undefined : result;
    }

    static get stamp(): string | undefined {
        const result = core.getInput('stamp');
        return result === '' || result === null ? undefined : result;
    }

    static get setAllVars(): boolean {
        return core.getInput('setAllVars') === 'true';
    }

    static get setCommonVars(): boolean {
        return core.getInput('setCommonVars') === 'true';
    }

    static get toolVersion(): string | undefined {
        const result = core.getInput('toolVersion');
        return result === '' || result === null ? undefined : result;
    }

    static get toolFeed(): string | undefined {
        const result = core.getInput('toolFeed');
        return result === '' || result === null ? undefined : result;
    }
}
