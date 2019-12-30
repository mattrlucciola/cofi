import {AC} from '../AudioContext';
import {SilentNote} from '../../instruments/SilentNote';

const updateStepCount = (getters, setters) => {
    
    const {setPlayback, setCurrentStep} = setters;
    const {scheduledStep, scheduledStepTime, scheduledEnd, playbackState} = getters;
    let currentStepTimeStop = scheduledStepTime;
    // set the next measureEnd, to calculate steps for next measure
    (!!scheduledEnd) && setPlayback({type:'measureEnd', time:scheduledEnd});
    // set the most recent step time, to prevent time collision with next step
    setPlayback({type:'scheduledTime', time:currentStepTimeStop});
    // finally, schedule the new step
    setCurrentStep(scheduledStep);
}

const scheduleInstruments = (getters) => {
    // destructuring props
    const {scheduledStepTime, scheduledStep, instrumentsArr} = getters;

    let instrumentNotes = [];
    for (let instIdx = 0; instIdx < instrumentsArr.length; instIdx++) {
        const instrumentObj = instrumentsArr[instIdx];
        let activated = instrumentObj['pattern'][scheduledStep]['activated'];
        if (activated) {
            let source = new (instrumentObj['source'])(AC);
            instrumentNotes = source.trigger(scheduledStepTime, null);
        }
    }
    return instrumentNotes
}

export const scheduleStep = (getters, setters) => {
    let {playbackState} = getters;
    let notesList = [];

    // 2) schedule next step, update step, record scheduled time, set seed if -1 step
    let SN = new SilentNote(AC, playbackState, false, 0);
    let snNote = SN.trigger(getters, setters, updateStepCount);

    // 3) schedule instruments step(n) to fire on next beat
    console.log('getter inst', getters.instrumentsArr)
    let instrumentNotes = scheduleInstruments(getters)
    // 4) (above) record this time in history so it does not repeat on next fire
    // 5) record the note object so we can cancel their schedules
    notesList = [...notesList, ...snNote, ...instrumentNotes]
    return notesList
}

export const clearSchedule = (scheduleList) => {
    scheduleList.forEach(note => {
        note.stop(0);
        note.onended = () => {};
    });
    return []
}