import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import Sequencer from './components/sequencer/Sequencer';
import Header from './components/Header';
import TimingController from './components/TimingController';
import Transport from './components/Transport';
import Instruments from './components/Instruments';
// import Visualizer from './components/Visualizer';
// import Synth from './components/Synth';

let thelist = [];
function checkTiming(thelist, t){
    thelist.push(t);
    let sum = 0;
    let difflist = [];
    thelist.forEach((elem, idx) => {
        if (idx > 0) {
            let diff = thelist[idx+1] - elem;
            difflist.push(diff);
        }
    });
    difflist.pop();
    difflist.forEach(element => {
        sum += element
    });
    console.log(`avg: ${sum/difflist.length}`, difflist);
}

// set the global audio context here
let AC = new (window.AudioContext || window.webkitAudioContext)()

// misc global vars
function App() {
    // timing states
    let [globalBPM, setGlobalBPM] = useState('128');
    let [measureTime, setMeasureTime] = useState(0);
    let [inputBPM, setInputBPM] = useState(globalBPM);
    let [currentStep, setCurrentStep] = useState(-1);
    let [totalSteps, setTotalSteps] = useState(16);
    let [timeSignature, setTimeSignature] = useState(4);
    // let [timeoutEnd, setTimeoutEnd] = useState(0);

    // sequencer states
    let [instruments, setInstruments] = useState(Instruments(AC, totalSteps));
    let [automationToggle, setAutomationToggle] = useState(true);
    let [playing, setPlaying] = useState(false);
    let [initialized, setInitialized] = useState(false);
    let [intervalTime, setIntervalTime] = useState(null);
    let [updateBool, setUpdateBool] = useState(false);
    let [measure, setMeasure] = useState([]);
    let [stepList, setStepList] = useState([]);

    // set all keypress events here
    document.onkeypress = (e) => {
        let key = e.key;
        // console.log(key);
        // if we're in the main body scope
        if (document.activeElement === document.body) {
            e.preventDefault()
            // console.log(key);
            if (key === 'p'){handleSequencerToggle(e, automationToggle, setAutomationToggle)}
            if (key === ' '){
                if (AC.state === 'suspended' && initialized===false) {console.log('not initialized yet...');initialize(); setInitialized(true);}
                togglePause(e);
            }
            if (key === '?') {toggleStop()}
            if (key === ',' || key === '.') {toggleAdvance(key)}
            }
        else {
            if (key === 'Escape') {document.activeElement.blur()}
        }
    }

    // event handlers
    const handleTimeSignatureChange = (newTimeSignature) => {setTimeSignature(newTimeSignature)}
    function handleSequencerToggle(){setAutomationToggle(!automationToggle)}
    
    // state togglers 
    const toggleStop = () => {setCurrentStep(-1);setPlaying(false);AC.close(); AC = new (window.AudioContext || window.webkitAudioContext)(); setInitialized(false)}
    const togglePause = () => {(currentStep < 0) && setCurrentStep(0);setPlaying(!playing);}
    const toggleAdvance = (_t_) => {let change = (_t_===',' && (_t_!=='.' || _t_!==true)) ? -1 : 1;setCurrentStep(currentStep + change)}

    // godly function made by Dan Abramov -- source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }

            if (delay !== null) {
                tick()
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }
    function initialize(){
        let SN = makeSilentNote(true);
        SN.start(0);
        SN.stop(0.05);
        console.log(AC.currentTime);
    }
    // produce a silent note for beat keeping
    function makeSilentNote(init){
        // console.log('making note', AC.currentTime);
        let silentOsc = AC.createOscillator();
        let silentGain = AC.createGain();
        silentGain.gain.value = 0.5;
        silentOsc.frequency.value = 440
        silentOsc.connect(silentGain);
        silentGain.connect(AC.destination);
        return silentOsc
    }

    // schedule a single step for all instruments
    function scheduleStep(step){
        // at this step, go thru each instrument, find active instruments play them
        // go thru each instrument
        for (let instrument in instruments){
            // find active instrument
            let activated = instruments[instrument]['pattern'][step]['activated'];
            if (activated){
                let source = new instruments[instrument]['source'](AC, instruments[instrument]['freq']);
                console.log('my dource',source);

                let automation = instruments[instrument]['pattern'][step]['automation'];
                let stepTimeLength = 60 / globalBPM;
                let startTime = step * stepTimeLength;
                scheduleNote(source, automation, startTime, 0.5);
                console.log('scheduled!');
            }
        }
    }
    const updateStep = () => {
        let newStep = currentStep + 1;
        // setCurrentStep(currentStep + 1);
        setCurrentStep(newStep);
        console.log('current step',AC.currentTime, currentStep); 
    }
    const scheduleNote = (source, startTime, duration, callback, automation) => {
        // apply gain for all notes
        function applyGain(source, startTime){
            let gain = AC.createGain();
            gain.gain.value = 0;
            gain.gain.setValueAtTime(0, startTime);
            source['gain'] = gain;
            return source;
        }
        // dynamic compress to prevent distortion
        function preventArtifacts(source, startTime){
            source['gain'].gain.linearRampToValueAtTime(0.2, startTime + 0.07);
        }
        function connectNodes(source){
            source['gain'].connect(AC.destination);
            source['source'].connect(source['gain']);
        }
        // 1) create the gain node
        source = applyGain(source, startTime);
        // 2) prevent clipping and aliasing
        preventArtifacts(source, startTime)
        // 3) connect to the audio context destination and gain
        connectNodes(source);
        // 4) schedule start and stop
        source['source'].start(startTime);
        source['gain'].gain.linearRampToValueAtTime(0, startTime + duration);
        source['source'].stop(startTime + duration)
        // 5) on end
        source['source'].onended = () => {updateStep()};
        return source
    }
    // function cleanUpSchedule(){
    //     console.log('cleaning up schedule!');
    // }
    function startInterval(){
        let stepLength = 60 / globalBPM;
        let t = AC.currentTime;
        let lookForward = intervalTime * 10 / 1000;
        let ti = t + 0.05;
        let tf = ti + lookForward;
        
        // filter the list to get times within the look-forward window, and not already played
        let filteredMeasure = measure.filter((stepTime) => {
            return stepTime > ti && stepTime <= tf && !stepList.includes(stepTime);
        })

        // if (filteredMeasure.length === 0){
        //     return
        // } else {
        //     console.log('filtered', (filteredMeasure.length), filteredMeasure);
        //     // find step based on time, schedule whatever is in the window
        //     filteredMeasure.forEach((stepTime, idx) => {
        //         // schedule note
        //         let note = makeSilentNote(false);
        //         scheduleNote({'source':note}, stepTime, stepLength);

        //         // save this step
        //         let newStepList = [...stepList, stepTime]
        //         if (newStepList.length > Number(totalSteps/2)) {newStepList = newStepList.slice(1)}
        //         setStepList(newStepList)
        //     });
        //     // generate new measure to keep it goin
        //     if (ti > measure[Number(totalSteps / 2)]) {
        //         let newMeasure = measure.map((stepTime) => {
        //             return stepTime + (stepLength * Number(totalSteps / 2))
        //         })
        //         setMeasure(newMeasure);
        //     }
        // }

        

        for (let idx = 0; idx < filteredMeasure.length; idx++) {
            const step1 = filteredMeasure[idx];
            const step2 = filteredMeasure[idx + 1];
            const time1 = (step1 + step2) / 2
            console.log(ti < tf, ti, tf, (!stepList.includes(step1)));
            
            if (ti > step1, ti < tf && (!stepList.includes(step1))) {
                
                // schedule a step at this time
                let note1 = makeSilentNote(false)
                // let note2 = makeSilentNote(false)
                // scheduleNote({'source':note1}, step1, stepLength)
                scheduleNote({'source':note1}, step1, stepLength)
                console.log('scheduled note', idx, step1);
                
                // save this step
                setStepList([...stepList, step1])
                console.log(stepList);
                
                // break
                break
            } else if (tf > step1 && !step2) {
                setMeasure(measure.map((elem) => {return elem + (stepLength * (idx - 1))}));
                // console.log(measure.map((elem) => {return elem + stepLength * (idx - 1)}));
            }
        }
    }

    //////////////////////////////////////////// HOOKS ////////////////////////////////////////////
    // initialize audio context
    useEffect(()=> {
        if (AC.currentTime === 0) {initialize()};
    }, [])
    
    // more or less the same thing as the first render
    // useEffect(()=>{
        
    // },[initialized])
    // this effect is for setting the new global current time and events that are triggered by play/pause events
    useInterval(startInterval, intervalTime)

    useEffect(() => {
        if (playing) {
            // make a measure list
            let t = AC.currentTime + 0.1;
            console.log('building list (again)', t, AC.currentTime);
            
            let measureList = [...Array(totalSteps - currentStep).keys()].map((ct) => {
                // ct = ct + currentStep;
                let stepLength = 60 / globalBPM;
                return (t + (ct * stepLength))
            })
            setMeasure(measureList);
            AC.state==='suspended' && AC.resume();
            setIntervalTime(100)
        } else {
            AC.state==='running' && AC.suspend();
            setIntervalTime(null)
        }
        console.log(AC.state);
    },[playing])

    // guarantee that state updates appropriately
    // useEffect(() => {
        // setCurrentStep()
    // },[updateBool])

    // events after step changes
    useEffect(() => {
        if (currentStep >= totalSteps) {
            setCurrentStep(0);
            console.log('init: ', currentStep, AC.currentTime);
            // setStepList([]);
        };
        checkTiming(thelist, AC.currentTime)
    }, [currentStep]);

    return (
        <div className="App">
            <Header />
            <Transport togglePause={togglePause} playing={playing} />
            <TimingController bpmObj={{globalBPM, setGlobalBPM, inputBPM, setInputBPM, handleTimeSignatureChange}} stepObj={{totalSteps, currentStep}} />
            <Sequencer instruments={instruments} setInstruments={setInstruments} timing={{globalBPM, currentStep, timeSignature}} toggles={{handleSequencerToggle, automationToggle}} />
            {/* <Visualizer globalBPM={globalBPM} /> */}
        </div>
    );
}

export default App;
