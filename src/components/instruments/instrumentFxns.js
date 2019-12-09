export const fillInstrumentPattern = (instrumentObj, totalSteps) => {
    let initInstState = {'triggered': false, 'activated': false, 'automation':{}}
    if (!instrumentObj['pattern'] || instrumentObj['pattern'] === []) {
        instrumentObj['pattern'] = (new Array(totalSteps).fill(initInstState));
    }
    return instrumentObj
}