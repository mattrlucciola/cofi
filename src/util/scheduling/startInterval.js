import {scheduleStep} from './Scheduler';
export const fxn = (_t_, playbackState, setPlayback, getters, globalObj, setters, setStopped) => {
    _t_ = _t_ + 0.01;
    let measureEnd = _t_ + (playbackState['totalSteps'] * playbackState['stepLength']);
    setPlayback({type: 'measureEnd', time: measureEnd});
    console.log('scheduling from stopped position');
    getters['scheduledStepTime'] = _t_;
    getters['scheduledStep'] = 0;
    getters['scheduledEnd'] = getters['scheduledStepTime'] + playbackState['totalSteps'] * playbackState['stepLength'];
    globalObj['notesList'] = scheduleStep(getters, setters);
    setStopped(false);
}