export const toggleStop = (AC, setCurrentStep, setPlaying, setInitialized) => {
    setCurrentStep(-1);
    setPlaying(false);
    AC.close();
    AC = new (window.AudioContext || window.webkitAudioContext)();
    setInitialized(false);
}
export const togglePause = (playing, setPlaying) => {
    setPlaying(!playing);
}
export const toggleAdvance = (_t_, currentStep, setCurrentStep) => {
    let change = (_t_ === ',' && (_t_ !== '.' || _t_ !== true)) ? -1 : 1;
    setCurrentStep(currentStep + change);
}

export function togglePlayPause(e, AC, initialized, initialize, setInitialized, togglePause, playing, setPlaying) {
    if (AC.state === 'suspended' && initialized === false) {
        console.log('not initialized yet...');
        initialize();
        setInitialized(true);
    }
    togglePause(playing, setPlaying);
}
