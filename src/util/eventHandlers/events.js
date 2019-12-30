import {clearSchedule} from '../scheduling/Scheduler';
import {adjustStep} from './adjustStep';

export const toggleAdvance = (eventKey, currentStep, AC, playing, playbackState, setCurrentStep, globalObj) => {
    let newStep;
    if      (eventKey === ',') {newStep = currentStep - 1}
    else if (eventKey === '.') {newStep = currentStep + 1}
    adjustStep(AC, playing, playbackState, setCurrentStep, globalObj, newStep)
}

export const togglePause = (AC, playing, setPlaying, playbackState, setPlayback, currentStep, globalObj) => {

    // if youre turning it on (aka switching from pause to play), set the seed time and play the current-step's note
    if (!playing) {
        AC.state === 'suspended' && AC.resume();

        // set seed to signal sound to play immediately, then set again after playing
        let _t_ = AC.currentTime;
        let measureEnd = playbackState['stepLength'] * (playbackState['totalSteps'] - currentStep);
        setPlayback({type: 'measureEnd', time: _t_ + measureEnd});
        setPlaying(true);
    };
    if (playing) {
        AC.state === 'running' && AC.suspend();
        globalObj['scheduleList'] = clearSchedule(globalObj['scheduleList'])
        setPlaying(false);
    };
}

export const toggleBPM = () => {
    document.getElementById('bpm-input').focus()
}

export const handleClickStep = (e, AC, playing, playbackState, setCurrentStep, globalObj) => {
    let newStep = Number(e.target.attributes.value.value);
    adjustStep(AC, playing, playbackState, setCurrentStep, globalObj, newStep);
    // AC, playing, playbackState, setCurrentStep, globalObj, newStep
}