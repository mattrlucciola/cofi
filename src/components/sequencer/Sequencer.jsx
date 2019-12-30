// App > Sequencer

// react
import React from 'react';

// modules

// style

// components
// import StepPattern from './StepPattern';
import SequencerLeft from './left/SequencerLeft';
import SequencerRight from './right/SequencerRight';

// utilities

// global vars

// main

export default function Sequencer({instruments, setInstruments, currentStep, playbackObj, handleClickStep, toggleStateObj, instrumentsStateObj}){
    // const toggleStep = (instName, stepCt) => {
    //     let instrmtsCopy = {...instruments};
    //     let {activated, ...other} = instrmtsCopy[instName]['pattern'][stepCt];
    //     instrmtsCopy[instName]['pattern'][stepCt] = {'activated': !activated, ...other};
    //     setInstruments(instrmtsCopy)
    // };

    return(
        <div className='sequencer'>
            {/* <StepPattern instruments={instruments} toggleStep={toggleStep} currentStep={currentStep} playbackObj={playbackObj} /> */}
            <SequencerLeft instrumentsStateObj={instrumentsStateObj} playbackObj={playbackObj} toggleStateObj={toggleStateObj} />
            <SequencerRight instrumentsStateObj={instrumentsStateObj} playbackObj={playbackObj} handleClickStep={handleClickStep} toggleStateObj={toggleStateObj} />
        </div>
    )
}