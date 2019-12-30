export const toggleStop = (AC, setCurrentStep, setPlaying, setInitialized) => {
    setCurrentStep(-1);
    setPlaying(false);
    AC.close();
    AC = new (window.AudioContext || window.webkitAudioContext)();
    setInitialized(false);
}
// export const togglePause = (playing, setPlaying) => {
//     setPlaying(!playing);
// }
export const toggleAdvance = (_t_, currentStep, setCurrentStep) => {
    let change = (_t_ === ',' && (_t_ !== '.' || _t_ !== true)) ? -1 : 1;
    setCurrentStep(currentStep + change);
}

export const togglePause = (AC, scheduleList, playing, setPlaying, playbackState, setPlayback) => {

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
        clearSchedule(scheduleList)
        setPlaying(false);
    };
}

export function togglePlayPause(e, AC, initialized, initialize, setInitialized, togglePause, playing, setPlaying, playbackState, setPlayback, scheduleList) {
    if (AC.state === 'suspended' && initialized === false) {
        console.log('not initialized yet...');
        initialize();
        setInitialized(true);
    }
    togglePause(AC, scheduleList, playing, setPlaying, playbackState, setPlayback);
}
