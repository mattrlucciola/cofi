import React from 'react'

export default function Step({toggleStep, instId, timing}){
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