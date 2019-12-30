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
    // play current step, set the seed/end to THAT step, then schedule following step
    console.log('scheduling from adjusted position');
    getters['scheduledStepTime'] = currentTime + 0.01;
    getters['scheduledStep'] = currentStep;
    let stepsLeft = playbackState['totalSteps'] - getters['scheduledStep'];
    getters['scheduledEnd'] = getters['scheduledStepTime'] + (stepsLeft * playbackState['stepLength']);
    globalObj['notesList'] = scheduleStep(getters, setters);
    globalObj['adjusted'] = false;
    (stopped) && setStopped(false);
}

export const intervalScheduleStep = (getters, currentStep, playbackState, currentTime, intervalTime, setPlayback, globalObj, setters) => {
    // calc the scheduled step scheduled time to activate
    getters['scheduledStep'] = currentStep + 1;
    let remainingMeasureSteps = playbackState['totalSteps'] - getters['scheduledStep'];
    let scheduledDelta = playbackState['stepLength'] * remainingMeasureSteps;
    getters['scheduledStepTime'] = playbackState['measureEnd'] - scheduledDelta;
    getters['scheduledEnd'] = null;

    // find if step schedule is open
    let openSchedule = playbackState['scheduledTime'] !== getters['scheduledStepTime'];

    // find if in the money for next step
    let lookForward = currentTime + (intervalTime * 2 / 1000);
    let inTheMoney = getters['scheduledStepTime'] >= currentTime && getters['scheduledStepTime'] < lookForward;
    // schedule note to be played, first check if note is already scheduled
    if (inTheMoney && openSchedule) {
        console.log(playbackState);

        if (currentStep >= playbackState['totalSteps'] - 1) {// if at end of measure
            getters['scheduledEnd'] = getters['scheduledStepTime'] + (playbackState['totalSteps'] * playbackState['stepLength']);
            getters['scheduledStep'] = 0;
            console.log('scheduling from end-of-measure position', currentStep, getters['scheduledStep'], getters['scheduledStepTime'], getters['scheduledEnd']);
        } else {// if in middle of measure
            console.log('scheduling from inter-measure position', currentStep, getters['scheduledStep']);
        }
        setPlayback({type: 'queue', time: getters['scheduledStepTime'], step: getters['scheduledStep']});
        globalObj['notesList'] = scheduleStep(getters, setters);
        globalObj['scheduleList'] = [...globalObj['scheduleList'], ...globalObj['notesList']];
    }
}

export const startInterval = (stopped, playbackState, instrumentsArr, globalObj, setCurrentStep, setPlayback, currentTime, setStopped, currentStep, intervalTime) => {
    let getters = {stopped, playbackState, instrumentsArr, globalObj};
    let setters = {setCurrentStep, setPlayback};
    if (stopped && globalObj['adjusted'] === false){
        intervalStartFromStop(currentTime, playbackState, setPlayback, getters, globalObj, setters, setStopped)
    } else if (globalObj['adjusted'] && globalObj['timeoutComplete']) {
        intervalStartFromAdjust(currentTime, getters, currentStep, playbackState, globalObj, setters, stopped, setStopped)
    } else if (currentStep >= 0){
        intervalScheduleStep(getters, currentStep, playbackState, currentTime, intervalTime, setPlayback, globalObj, setters)
    }
}