// App > Sequencer > StepPattern > Step

// react
import React from 'react';

// modules

// style

// components

// utilities

// global vars

// main
export default function Step({toggleStep, instId, timing, instrumentsStateObj}){
    let {currentStep, stepCt, stepInfo} = timing;
    let triggered = `${currentStep===stepCt}`;
    let activated = `${stepInfo['activated']}`;
    let id = `${instId}Step${stepCt}`;
    let key = `s-${stepCt}`;
    
    return(
        <div className='step' triggered={triggered} activated={activated} id={id} key={key} onClick={
            (e) => {toggleStep(instId, stepCt)}}>
        </div>
    )
}