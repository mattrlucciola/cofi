import {SilentNote} from '../instruments/SilentNote';

const ts = (time) => {return `${time}`.slice(0,8);}

const updateStepCount = (playbackState, setPlayback, AC) => {
    // let newStep = (playbackState['currentStep'] >= 0 && playbackState['currentStep'] < (playbackState['totalSteps'] - 1)) ? playbackState['currentStep'] + 1: 0;
    let newStep = playbackState['currentStep'] + 1;
    if (newStep === (playbackState['totalSteps'])) {newStep = 0}
    setPlayback({type:'step+'});
    // console.log(`Step  #4 ) Scheduler: (UPDATESTEPCOUNT):      time:${AC.currentTime} seed:${playbackState['measureSeed']}  schedTime:${playbackState['scheduledTime']}   current-step:${playbackState['currentStep']}   scheduled-step:${newStep}`);
}

const scheduleInstruments = (ti, playbackState, AC, instruments) => {
    let nextStep = playbackState['currentStep'] + 1;
    // console.log(`Step   #2b) Scheduler: (SCHEDULEINSTRUMENTS):    time:${ts(AC.currentTime)}   ti:${ts(ti)}    current-step:${playbackState['currentStep']}   scheduled-step:${nextStep}   paused:${playbackState['paused']}`);
    
    for (let instrument in instruments){
        // get active instrument
        let activated = instruments[instrument]['pattern'][nextStep]['activated'];
        if (activated){
            let source = new (instruments[instrument]['source'])(AC);
            // let automation = instruments[instrument]['pattern'][step]['automation'];
            source.trigger(ti, null);
        }
    }
}

export const scheduleStep = (playbackState, setPlayback, AC, instruments) => {
    
    // 1) init step and timing
    let nextStep = playbackState['currentStep'] + 1;

    // 1a) calc timings to start and stop
    let ti = AC.currentTime;
    let tf = playbackState['measureSeed'] + (playbackState['stepLength'] * nextStep);
    // if (stepCt === -1 || nextStep === (playbackState['totalSteps'] - 1)) {
    //     ti = AC.currentTime;
    //     tf = ti;
    // }

    // console.log(`Step  #2 ) Scheduler: (SCHEDULESTEP):      time:${ts(AC.currentTime)}   ti:${ts(ti)} tf:${ts(tf)}   current-step:${playbackState.currentStep}   scheduled-step:${nextStep}   `);

    // 2) schedule the silent note to trigger, causing it to end on step(n), and update step
    let SN = new SilentNote(AC, playbackState, false, 0);
    SN.trigger(ti, tf, updateStepCount, setPlayback)

    

    // 4) schedule instruments step(n) to fire on next beat
    scheduleInstruments(tf, playbackState, AC, instruments)
    // 3) record this time in history so it does not repeat on next fire
    // console.log(`Step  #2c) Scheduler: (SCHEDULESTEP):      time:${ts(AC.currentTime)}   ti:${ts(ti)} tf:${ts(tf)}   current-step:${playbackState.currentStep}   scheduled-step:${nextStep}   `);
    // setPlayback({type:'scheduledTime', time:tf});
    setPlayback({type:'scheduledStep', step:nextStep});
}

export const deschedule = (scheduledNotesArr) => {
    scheduledNotesArr.forEach(note => {
        
    });
}