// react
import React, {useState, useReducer, useEffect} from 'react';

// modules

// style
import './App.css';

// components
import Sequencer from './components/sequencer/Sequencer';
import Header from './components/Header';
import TimingController from './components/TimingController';
import Transport from './components/Transport';
import Instruments from './components/Instruments';

// utilities
import {scheduleStep} from './util/scheduling/Scheduler';
import {AC} from './util/audio/AudioContext';
import assignGlobalKeyPress from './util/eventHandlers/assignGlobalKeyPress';
import assignGlobalClick from './util/eventHandlers/assignGlobalClick';
import {useInterval} from './util/useInterval';
import {clickToggleReducer} from './util/reducers/ClickToggleReducer';
import {playbackReducer} from './util/reducers/PlaybackReducer';
import * as eventsObj from './util/eventHandlers/events';
import './util/specifyBrowser';

// global vars
const globalObj = {
    adjusted: false,
    timeoutComplete: true,
    intervalId: '',
    scheduleList: [],
};

// main
export default function App(){
    // destructuring
    const {
        toggleAdvance, togglePause,
    } = eventsObj;

    // states
    // click toggle
    let [toggleState, setToggle] = useReducer(clickToggleReducer, {
        addInstrumentOpen: false,
    });
    // timing states
    let [playbackState, setPlayback] = useReducer(playbackReducer, {
        measure: -1,
        bpm: 128 * 2,
        timeSignature: 4,
        totalSteps: 16,
    });
    const [currentStep, setCurrentStep] = useState(-1);
    const [stopped, setStopped] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [intervalTime, setIntervalTime] = useState(null);
    let [globalBPM, setGlobalBPM] = useState('128');
    let [inputBPM, setInputBPM] = useState(globalBPM);
    let [totalSteps, setTotalSteps] = useState(16);
    let [timeSignature, setTimeSignature] = useState(4);

    // sequencer states
    let [instruments, setInstruments] = useState(Instruments(AC, totalSteps));

    // instruments state
    const InstrumentsListInit = []
    let [instrumentsArr, setInstrumentsArr] = useState(InstrumentsListInit);

    // set all keypress events here
    const bindsObj = {
        ' ': () => togglePause(AC, playing, setPlaying, playbackState, setPlayback, globalObj),
        ',': () => toggleAdvance(',', currentStep, AC, playing, playbackState, setCurrentStep, globalObj),
        '.': () => toggleAdvance('.', currentStep, AC, playing, playbackState, setCurrentStep, globalObj),
    }
    assignGlobalKeyPress(bindsObj)
    assignGlobalClick(toggleState, setToggle)
    
    /////////////////// state togglers ///////////////////

    // other init vars for the interval
    let setters = {setCurrentStep, setPlayback};
    let notesList = [];
    const startInterval = () => {
        let getters = {stopped, playbackState, instrumentsArr, globalObj};
        if (stopped && globalObj['adjusted'] === false){// if starting from stopped
            let _t_ = AC.currentTime + 0.01;
            let measureEnd = _t_ + (playbackState['totalSteps'] * playbackState['stepLength']);
            setPlayback({type:'measureEnd', time:measureEnd});
            console.log('scheduling from stopped position');
            getters['scheduledStepTime'] = _t_;
            getters['scheduledStep'] = 0;
            getters['scheduledEnd'] = getters['scheduledStepTime'] + playbackState['totalSteps'] * playbackState['stepLength'];
            notesList = scheduleStep(getters, setters);
            setStopped(false);
        } else if (globalObj['adjusted'] && globalObj['timeoutComplete']) {// play current step, set the seed/end to THAT step, then schedule following step
            console.log('scheduling from adjusted position');
            // turn this (adj) back off
            getters['scheduledStepTime'] = AC.currentTime + 0.01;
            getters['scheduledStep'] = currentStep;
            let stepsLeft = playbackState['totalSteps'] - getters['scheduledStep'];
            getters['scheduledEnd'] = getters['scheduledStepTime'] + (stepsLeft * playbackState['stepLength']);
            notesList = scheduleStep(getters, setters);
            globalObj['adjusted'] = false;// keep this local, not in the object or a state. 
            (stopped) && setStopped(false);
        } else if (currentStep >= 0){
            // calc the scheduled step scheduled time to activate
            getters['scheduledStep'] = currentStep + 1;
            let remainingMeasureSteps = playbackState['totalSteps'] - getters['scheduledStep'];
            let scheduledDelta = playbackState['stepLength'] * remainingMeasureSteps;
            getters['scheduledStepTime'] = playbackState['measureEnd'] - scheduledDelta;
            getters['scheduledEnd'] = null//getters['scheduledStepTime'] + (stepsLeft * playbackState['stepLength']);

            // find if step schedule is open
            let openSchedule = playbackState['scheduledTime'] !== getters['scheduledStepTime'];

            // find if in the money for next step
            let _t_ = AC.currentTime;
            let lookForward = _t_ + (intervalTime * 2 / 1000);
            let inTheMoney = getters['scheduledStepTime'] >= _t_ && getters['scheduledStepTime'] < lookForward;
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
                setPlayback({type:'queue', time: getters['scheduledStepTime'], step: getters['scheduledStep']});
                notesList = scheduleStep(getters, setters);
                globalObj['scheduleList'] = [...globalObj['scheduleList'], ...notesList];
            }
        }
    }

    //////////////////////////////////////////// HOOKS ////////////////////////////////////////////
    // set the interval
    useInterval(startInterval, intervalTime)

    // events after step changes
    useEffect(() => {
        if (globalObj['intervalId'] !== '') {
            clearInterval(globalObj['intervalId']);
            globalObj['intervalId'] = '';
        }
        if (playing) {
            AC.resume();
            setIntervalTime(12);
        } else {
            AC.suspend();
            setIntervalTime(null);
        }
    }, [playing])
    
    return (
        <div className="App">
            <Header />
            <Transport togglePause={togglePause} playing={playing} />
            <TimingController bpmObj={{globalBPM, setGlobalBPM, inputBPM, setInputBPM}} stepObj={{totalSteps, currentStep}} />
            <Sequencer instruments={instruments} setInstruments={setInstruments} timing={{globalBPM, currentStep, timeSignature}} />
        </div>
    );
}