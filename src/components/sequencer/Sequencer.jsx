// App > Sequencer

// react
import React from 'react';

// modules

// style

// components
import StepPattern from './StepPattern';
import Automation from './Automation';

// utilities

// global vars

// main

export default function Sequencer({instruments, setInstruments, toggles, timing}){
    let {handleSequencerToggle, automationToggle} = toggles;
    let {globalBPM, currentStep, timeSignature} = timing;
    const toggleStep = (instName, stepCt) => {
        let instrmtsCopy = {...instruments};
        let {activated, ...other} = instrmtsCopy[instName]['pattern'][stepCt];
        instrmtsCopy[instName]['pattern'][stepCt] = {'activated': !activated, ...other};
        setInstruments(instrmtsCopy)
    };

    return(
        <div className='sequencer'>
            <div className='sequencer-toggle' onClick={handleSequencerToggle} > {automationToggle ? 'Pattern': 'Automation'}</div>
            {automationToggle ? <StepPattern instruments={instruments} toggleStep={toggleStep} timing={{timeSignature, currentStep}} />: <Automation instruments={instruments} />}
        </div>
    )
}