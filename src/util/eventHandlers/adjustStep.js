export const adjustStep = (AC, clt, newStep, setCurrentStep, playing, playbackState, adjusted, timeoutComplete) => {
    // 1) cancel all scheduled events
    AC.status !== 'suspend' && AC.suspend();
    clearSchedule(scheduleList);
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
    adjusted = true;
    if (playing) {
        timeoutComplete = false;
        if (clt !== '') {clearInterval(clt)}
        clt = setTimeout(() => {
            AC.resume();
            clt = '';
            timeoutComplete = true;
        }, 150)
    }
}