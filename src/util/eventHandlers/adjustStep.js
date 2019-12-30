import {clearSchedule} from '../scheduling/Scheduler';

export const adjustStep = (AC, playing, playbackState, setCurrentStep, globalObj, newStep) => {
    // 1) cancel all scheduled events
    AC.status !== 'suspend' && AC.suspend();
    clearSchedule(globalObj['scheduleList']);
    if (newStep >= playbackState['totalSteps']) {
        newStep = 0
    }
    else if (newStep < 0) {
        newStep = playbackState['totalSteps'] - 1
    }
    setCurrentStep(newStep);
    console.log('ADJUSTING', newStep);
    
    // 2) change the step (keep a locally-scoped, non-state var handy in case of timing issues)
    // 3) re-seed the measure at that location, schedule the next step, and play immediately
    globalObj['adjusted'] = true;
    if (playing) {
        globalObj['timeoutComplete'] = false;
        if (globalObj['intervalId'] !== '') {clearInterval(globalObj['intervalId'])}
        globalObj['intervalId'] = setTimeout(() => {
            AC.resume();
            globalObj['intervalId'] = '';
            globalObj['timeoutComplete'] = true;
        }, 150)
    }
}