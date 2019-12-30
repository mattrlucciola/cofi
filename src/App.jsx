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
import {scheduleNote, scheduleStep} from './util/Scheduler';
import {AC} from './util/audio/AudioContext';
import assignGlobalKeyBinds from './util/eventHandlers/assignGlobalKeyBinds';
import {useInterval} from './util/useInterval';
import {clickToggleReducer} from './util/reducers/ClickToggleReducer';
import {playbackReducer} from './util/reducers/PlaybackReducer';
import * as eventsObj from './util/eventHandlers/events';
import './util/specifyBrowser';

// global vars
let stepList = []
let scheduleList = [];

// main
export default function App(){
    // destructuring
    const {
        toggleStop, toggleAdvance, togglePause, togglePlayPause,
    } = eventsObj;

    // states
    
    // timing states
    let [playbackState, setPlayback] = useReducer(playbackReducer, {
        measure: -1,
        bpm: 128 * 2,
        timeSignature: 4,
        totalSteps: 32,
    });
    const [currentStep, setCurrentStep] = useState(-1);
    let [globalBPM, setGlobalBPM] = useState('128');
    let [inputBPM, setInputBPM] = useState(globalBPM);
    let [totalSteps, setTotalSteps] = useState(16);
    let [timeSignature, setTimeSignature] = useState(4);

    // sequencer states
    let [instruments, setInstruments] = useState(Instruments(AC, totalSteps));
    let [automationToggle, setAutomationToggle] = useState(true);
    let [playing, setPlaying] = useState(false);
    let [initialized, setInitialized] = useState(false);
    let [intervalTime, setIntervalTime] = useState(null);
    let [measure, setMeasure] = useState([])

    // set all keypress events here
    const bindsObj = {
        ' ': (e) => togglePlayPause(e, AC, initialized, initialize, setInitialized, togglePause, playing, setPlaying, playbackState, setPlayback, scheduleList),
        '?': () => toggleStop(AC, setCurrentStep, setPlaying, setInitialized),
        ',': () => toggleAdvance(',', currentStep, setCurrentStep),
        '.': () => toggleAdvance('.', currentStep, setCurrentStep),
    }
    assignGlobalKeyBinds(bindsObj)
    
    /////////////////// state togglers ///////////////////
    function initialize(){
        let SN = makeSilentNote(true);
        SN.start(0);
        SN.stop(0.05);
    }
    // produce a silent note for beat keeping
    function makeSilentNote(init){
        console.log('making note: time=', AC.currentTime);
        let silentOsc = AC.createOscillator();
        let silentGain = AC.createGain();
        silentGain.gain.value = 0.0;
        silentGain.gain.linearRampToValueAtTime(0.1, AC.currentTime + 0.09);
        silentGain.gain.linearRampToValueAtTime(0, AC.currentTime + 0.15);
        silentOsc.frequency.value = 666
        silentOsc.connect(silentGain);
        silentGain.connect(AC.destination);
        if (init===false && AC.currentTime > 0) {setCurrentStep(currentStep + 1)}
        return silentOsc
    }

    const updateStep = () => {
        let newStep = currentStep + 1;
        setCurrentStep(newStep);
    }
    const startInterval = () => {

        let lookForward = intervalTime * 2 / 1000;
        let stepLength = 60 / globalBPM;

        // find beat based on time
        let t = AC.currentTime;
        let tf = t + lookForward;

        // all the notes to be scheduled
        let filteredMeasure = measure.filter((stepTime) => {
            return stepTime > t && stepTime <= tf && !stepList.includes(stepTime) && t > 0.2;
        })
        
        // schedule the notes
        for (let idx = 0; idx < filteredMeasure.length; idx++) {
            
            let stepTime = filteredMeasure[idx];
            // schedule all notes
            let note = makeSilentNote(false);
            scheduleNote(AC, {'source':note}, stepTime, stepLength);

            // save all notes
            let newStepList = [...stepList, stepTime];
            if (newStepList.length > Number(totalSteps)) {newStepList = newStepList.slice(1)};
            stepList = newStepList;
        }
        // slide the measure forward
        if ((measure[measure.length-1] + stepLength) < tf || AC.currentTime > measure[0]) {
            setMeasure(measure.map((elem) => {return elem + stepLength}))
        }
    }

    //////////////////////////////////////////// HOOKS ////////////////////////////////////////////
    // initialize audio context
    useEffect(()=> {(AC.currentTime === 0) && initialize()},[])
    
    // set the interval
    useInterval(startInterval, intervalTime)
    
    // this effect is for setting the new global current time and events that are triggered by play/pause events
    useEffect(() => {
        if (playing) {
            // make a measure list
            let t = AC.currentTime;
            let measureList = [...Array(totalSteps - currentStep).keys()].map((ct) => {
                let stepLength = 60 / globalBPM;
                return (t + (ct * stepLength))
            })
            setMeasure(measureList);
            AC.state==='suspended' && AC.resume();
            setIntervalTime(15);
        } else {
            AC.state==='running' && AC.suspend();
            setIntervalTime(null);
        }
    },[playing])

    // events after step changes
    useEffect(() => {
        if (currentStep >= totalSteps) {
            setCurrentStep(0)
        };
        if (currentStep > 0 && currentStep < totalSteps) {
            scheduleStep(AC, currentStep, measure[0], globalBPM, instruments)
        }
    }, [currentStep])
    
    return (
        <div className="App">
            <Header />
            <Transport togglePause={togglePause} playing={playing} />
            <TimingController bpmObj={{globalBPM, setGlobalBPM, inputBPM, setInputBPM}} stepObj={{totalSteps, currentStep}} />
            <Sequencer instruments={instruments} setInstruments={setInstruments} timing={{globalBPM, currentStep, timeSignature}} />
        </div>
    );
}