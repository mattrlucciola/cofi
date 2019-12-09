// React
import React, {useState, useReducer, useEffect} from 'react';
// stylin
import './App.css';
// general
// instruments
import {InstrumentsListInit} from './components/instruments/InstrumentsListInit';
// utils
import {AC} from './components/util/AudioContext';
import {useInterval} from './components/util/useInterval.jsx';
import {KeyBinds} from './components/util/KeyBinds';
import {playbackReducer} from './components/util/PlaybackReducer';
import {clickToggleReducer} from './components/util/ClickToggleReducer';
import {scheduleStep, clearSchedule} from './components/util/Scheduler';
// nav
import Top from './components/main/Top';
import Left from './components/main/Left';
import Center from './components/main/Center';
import Right from './components/main/Right';
import Bottom from './components/main/Bottom';
// test

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// pick browser (below) /////////////////////////////////////
var isFirefox = typeof InstallTrigger !== 'undefined';
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
if (!(isFirefox || isChrome)){alert("Please use either Firefox or Chrome");throw new Error()}
///////////////////////////////////// pick browser (above) /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// local variables
let scheduleList = [];
let clt = '';
let adjusted = false;
let timeoutComplete = true;

function adjustStep(newStep, playing, playbackState, setCurrentStep) {
    // 1) cancel all scheduled events
    AC.status !== 'suspend' && AC.suspend();
    clearSchedule(scheduleList);
    if      (newStep >= playbackState['totalSteps']) {newStep = 0}
    else if (newStep < 0) {newStep = playbackState['totalSteps'] - 1}
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

function App() {
    //////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////// initialize (below) /////////////////////////////////////
    // 1.0) init auto close
    let [toggleState, setToggle] = useReducer(clickToggleReducer, {
        addInstrumentOpen: false,
    });
    // 1.1) init global timing states
    let [playbackState, setPlayback] = useReducer(playbackReducer, {
        measure: -1,
        bpm: 128 * 2,
        timeSignature: 4,
        totalSteps: 128,
    });
    const [playing, setPlaying] = useState(false);
    const [stopped, setStopped] = useState(true);
    const [intervalTime, setIntervalTime] = useState(null);
    const [currentStep, setCurrentStep] = useState(-1);

    // 1.2) init instruments state
    //Instruments(playbackState['totalSteps'])
    let [instrumentsArr, setInstrumentsArr] = useState(InstrumentsListInit);

    // 1.3) init keybinds
    KeyBinds(togglePause, toggleAdvance);

    ///////////////////////////////////// initialize (above) /////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////
    ////////////////////// toggle functions (below) //////////////////////
    function togglePause() {

        // if youre turning it on (aka switching from pause to play), set the seed time and play the current-step's note
        if (!playing) {
            AC.state==='suspended' && AC.resume();

            // set seed to signal sound to play immediately, then set again after playing
            let _t_ = AC.currentTime;
            let measureEnd = playbackState['stepLength'] * (playbackState['totalSteps'] - currentStep);
            setPlayback({type:'measureEnd' , time: _t_ + measureEnd});
            setPlaying(true);
        };
        if (playing) {
            AC.state==='running' && AC.suspend();
            clearSchedule(scheduleList)
            setPlaying(false);
        };
    }

    function handleClickStep(e) {
        let newStep = Number(e.target.attributes.value.value);
        adjustStep(newStep, playing, playbackState, setCurrentStep)
    }
    function toggleAdvance(key){
        let newStep;
        if      (key === ',') {newStep = currentStep - 1}
        else if (key === '.') {newStep = currentStep + 1}
        adjustStep(newStep, playing, playbackState, setCurrentStep)
    }
    // clicking anywhere on the page
    document.onclick = (e) => {
        let targetClass = e.target.className;

        // clicking away from the add-instrument menu
        if (toggleState['addInstrumentOpen'] && !['add-instrument-card', 'instrument-add-info', 'instrument-add-obj-container', 'instrument-add-obj', 'add-instrument active'].includes(targetClass)) {
            setToggle({type:'addInstrumentOpen' , addInstrumentOpen: !toggleState['addInstrumentOpen']})
            console.log(toggleState['addInstrumentOpen'])

        }
    }
    ////////////////////// toggle functions (above) //////////////////////
    //////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////
    /////////////////////////////// start here ///////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// INTERVAL (BELOW) /////////////////////////////////////////
    // set the interval play all notes in the measure
    let setters = {setCurrentStep, setPlayback}; let notesList = [];
    const startInterval = () => {
    
        let getters = {stopped, adjusted, playbackState, instrumentsArr};
        if (stopped && adjusted === false){// if starting from stopped
            let _t_ = AC.currentTime + 0.01;
            let measureEnd = _t_ + (playbackState['totalSteps'] * playbackState['stepLength']);
            setPlayback({type:'measureEnd', time:measureEnd});
            console.log('scheduling from stopped position');
            getters['scheduledStepTime'] = _t_;
            getters['scheduledStep'] = 0;
            getters['scheduledEnd'] = getters['scheduledStepTime'] + playbackState['totalSteps'] * playbackState['stepLength'];
            notesList = scheduleStep(getters, setters);
            setStopped(false);
        } else if (adjusted && timeoutComplete) {// play current step, set the seed/end to THAT step, then schedule following step
            console.log('scheduling from adjusted position');
            // turn this (adj) back off
            getters['scheduledStepTime'] = AC.currentTime + 0.01;
            getters['scheduledStep'] = currentStep;
            let stepsLeft = playbackState['totalSteps'] - getters['scheduledStep'];
            getters['scheduledEnd'] = getters['scheduledStepTime'] + (stepsLeft * playbackState['stepLength']);
            notesList = scheduleStep(getters, setters);
            adjusted = false;// keep this local, not in the object or a state. 
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
                setPlayback({type:'queue', time:getters['scheduledStepTime'], step:getters['scheduledStep']});
                notesList = scheduleStep(getters, setters);
                scheduleList = [...scheduleList, ...notesList];
            }
        }
    }

    useInterval(startInterval, intervalTime);
    //////////////////////////////////// INTERVAL (ABOVE) /////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// EFFECTS (BELOW) ///////////////////////////////////////
    useEffect(() => {
        if (clt !== '') {clearInterval(clt); clt=''}
        if (playing) {
            AC.resume();
            setIntervalTime(12);
        } else {
            AC.suspend();
            setIntervalTime(null);
        }
    }, [playing])
    // useEffect(() => {}, [stopped])
    /////////////////////////////////////// EFFECTS (ABOVE) ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="App">
            <a href='http://localhost:3002'>http://localhost:3002</a>
            {/* pre 1a. draw transport to support play/pause functionality */}
            <Top transportParams={{togglePause, playing}} />
            <Left />
            <Center instrumentsStateObj={{instrumentsArr, setInstrumentsArr}} playbackObj={{playbackState, currentStep}} handleClickStep={handleClickStep} toggleStateObj={{toggleState, setToggle}} />
            <Right />
            <Bottom />
        </div>
    )
}

export default App;