// App > Sequencer

// react
import React from 'react';

// modules

// style

// components
import StepPattern from './StepPattern';

// utilities

// global vars

// main

export default function Sequencer({instruments, setInstruments, timing}){
    let {globalBPM, currentStep, timeSignature} = timing;
    const toggleStep = (instName, stepCt) => {
        let instrmtsCopy = {...instruments};
        let {activated, ...other} = instrmtsCopy[instName]['pattern'][stepCt];
        instrmtsCopy[instName]['pattern'][stepCt] = {'activated': !activated, ...other};
        setInstruments(instrmtsCopy)
    };

    return(
        <div className='sequencer'>
            <StepPattern instruments={instruments} toggleStep={toggleStep} timing={{timeSignature, currentStep}} />
        </div>
    )
}