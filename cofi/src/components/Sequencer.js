import React, {useState, useEffect} from 'react';
import StepPattern from './StepPattern';
import Automation from './Automation';

let initInstState = {'triggered': false, 'activated': false}
let stepCount = 32;
let instrumentsInit = {
    'kick': {},
    'snare': {},
    'hihat_open': {},
    'hihat_closed': {},
    'clap': {},
    'rim': {},
    'bell': {},
}
// init instruments state
for (let inst in instrumentsInit) {
    let instObj = instrumentsInit[inst];
    instObj['pattern'] = new Array(stepCount).fill( initInstState )
}
export default function Sequencer(props){
    let [showPattern, setShowPattern] = useState(true);
    let [instruments, setInstruments] = useState(instrumentsInit);
    
    console.log('instruments- sequencer', instruments);

    // update instrument state
    
    return(
        <div className='sequencer'>
            <div className='sequencer-toggle' onClick={props.handleSequencerToggle} > {props.patternToggle ? 'Pattern': 'Automation'}</div>
            {props.patternToggle ? <StepPattern instObj={{instruments, setInstruments}} />: <Automation instObj={{instruments, setInstruments}} />}
        </div>
    )
}