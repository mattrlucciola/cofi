// apply gain for all notes
const applyGain = (AC, source) => {
    let gain = AC.createGain();
    gain.gain.value = 0;
    source['gain'] = gain;
    return source;
}

// dynamic compress to prevent distortion
const preventArtifacts = (source, startTime) => {
    source['gain'].gain.value = 0;
    source['gain'].gain.linearRampToValueAtTime(0.8, startTime + 0.09);
}

const connectNodes = (AC, source) => {
    source['gain'].connect(AC.destination);
    source['source'].connect(source['gain']);
    // console.log('connected!');
}
export const scheduleNote = (AC, source, startTime, duration, callback, automation) => {
    // 1) create the gain node
    source = applyGain(AC, source);
    console.log('start tiem here and source: ', startTime, source);
    
    // 2) prevent clipping and aliasing
    preventArtifacts(source, startTime)
    
    // 4) schedule start and stop
    source['gain'].gain.linearRampToValueAtTime(0, startTime + 0.2);
    source['source'].start(startTime);
    source['source'].stop(startTime + duration)

    if (source['source'].frequency.value !== 666) {
        connectNodes(AC, source);
    }
    // ) on end
    source['source'].onended = callback;
    // // 3) connect to the audio context destination and gain
     
    return source
}

// schedule a single step for all instruments
export const scheduleStep = (AC, step, startTime, globalBPM, instruments) => {
    // at this step, go thru each instrument, find active instruments play them
    // go thru each instrument
    for (let instrument in instruments){
        // find active instrument
        // console.log('gigg',instruments[instrument]['pattern'][step], AC, step, startTime, globalBPM, instruments);
        
        let activated = instruments[instrument]['pattern'][step]['activated'];
        if (activated){
            let source = new instruments[instrument]['source'](AC, instruments[instrument]['freq']);
            console.log('my dource',source);

            let automation = instruments[instrument]['pattern'][step]['automation'];
            let stepTimeLength = 60 / globalBPM;
            // console.log('scheduled! time= ', AC.currentTime, startTime, startTime-AC.currentTime);
            // AC, {'source':note}, stepTime, stepLength
            console.log('in step: start tiem here', startTime, AC.currentTime);
            scheduleNote(AC, source, startTime, stepTimeLength/2);
        }
    }
}