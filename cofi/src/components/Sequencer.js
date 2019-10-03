import React, {useState} from 'react';
import StepPattern from './StepPattern';
import Automation from './Automation';

let stepCount = 32;

// init instruments state
let initInstState = {'triggered': false, 'activated': false, 'automation':{}}
let instrumentsInit = {
    'kick': {},
    'snare': {},
    'hihat_open': {},
    'hihat_closed': {},
    'clap': {},
    'rim': {},
    'bell': {},
}
for (let inst in instrumentsInit) {
    let instObj = instrumentsInit[inst];
    instObj['pattern'] = new Array(stepCount).fill( initInstState )
}

export default function Sequencer(props){
    let [instruments, setInstruments] = useState(instrumentsInit);
    // let [playing, setPlaying] = useState(false);
    // let [currentStep, setCurrentStep] = useState(-1);

    // const toggleStop = () => {
    //     setCurrentStep(-1);
    //     setPlaying(false);
    // }
    // const togglePause = () => {
    //     setPlaying(!playing);
    // }
    // const toggleMove = (change) => { // change = (+/-1)
    //     setCurrentStep(currentStep + change)
    // }
    const toggleStep = (instName, stepCt) => {
        const instrumentsCopy = {...instruments};
        const {activated, ...other} = instrumentsCopy[instName]['pattern'][stepCt];
        instrumentsCopy[instName]['pattern'][stepCt] = {activated: !activated, ...other};
        setInstruments(instrumentsCopy);
    };

    return(
        <div className='sequencer'>
            <div className='sequencer-toggle' onClick={props.handleSequencerToggle} > {props.automationToggle ? 'Pattern': 'Automation'}</div>
            {props.automationToggle ? <StepPattern instruments={instruments} toggleStep={toggleStep} />: <Automation instruments={instruments} />}
        </div>
    )
}