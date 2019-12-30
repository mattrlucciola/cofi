import {clearSchedule} from '../Scheduler';
import {adjustStep} from './adjustStep';

export const toggleAdvance = (eventKey, currentStep, AC, scheduleList, playing, playbackState, setCurrentStep, globalObj) => {
    // let change = (eventKey === ',' && (eventKey !== '.' || eventKey !== true)) ? -1 : 1;
    // setCurrentStep(currentStep + change);
    let newStep;
    if      (eventKey === ',') {newStep = currentStep - 1}
    else if (eventKey === '.') {newStep = currentStep + 1}
    // adjustStep(newStep, playing, playbackState, setCurrentStep)
    adjustStep(AC, scheduleList, playing, playbackState, newStep, setCurrentStep, globalObj['intervalId'], globalObj)
}

export const togglePause = (AC, scheduleList, playing, setPlaying, playbackState, setPlayback, currentStep) => {

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
        scheduleList = clearSchedule(scheduleList)
        setPlaying(false);
    };
}