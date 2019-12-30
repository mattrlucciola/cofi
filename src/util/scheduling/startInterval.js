import {scheduleStep} from './Scheduler';
export const intervalStartFromStop = (currentTime, playbackState, setPlayback, getters, globalObj, setters, setStopped) => {
    let currentTimeAdj = currentTime + 0.01;
    let measureEnd = currentTimeAdj + (playbackState['totalSteps'] * playbackState['stepLength']);
    setPlayback({type: 'measureEnd', time: measureEnd});
    console.log('scheduling from stopped position');
    getters['scheduledStepTime'] = currentTimeAdj;
    getters['scheduledStep'] = 0;
    getters['scheduledEnd'] = getters['scheduledStepTime'] + playbackState['totalSteps'] * playbackState['stepLength'];
    globalObj['notesList'] = scheduleStep(getters, setters);
    setStopped(false);
}

export const intervalStartFromAdjust = (currentTime, getters, currentStep, playbackState, globalObj, setters, stopped, setStopped) => {
    console.log('scheduling from adjusted position');
    getters['scheduledStepTime'] = currentTime + 0.01;
    getters['scheduledStep'] = currentStep;
    let stepsLeft = playbackState['totalSteps'] - getters['scheduledStep'];
    getters['scheduledEnd'] = getters['scheduledStepTime'] + (stepsLeft * playbackState['stepLength']);
    globalObj['notesList'] = scheduleStep(getters, setters);
    globalObj['adjusted'] = false;
    (stopped) && setStopped(false);
}