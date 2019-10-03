import React from 'react';

export default function StepPattern({instruments, toggleStep}){
    

    function clickStepHandler(e) {
        let elem = e.target;

        // turn a diff color and mark as active
        elem.className = elem.className.includes(' active') ? elem.className.replace(' active', ''): `${elem.className} active`;
        
    }
    function drawPatternMap(instruments){
        let instElems = [];
        for (let instName in instruments) {
            let instrument = instruments[instName];
            console.log(instName, instrument);
            instElems.push(
                <div className='instrument-container' key={`ic-${instName}`}>
                    <div className='instrument' key={`i${instName}`}>{`${instName}`}</div>
                    <div className='pattern' key={`p${instName}`}>{instrument.pattern.map((obj, stepCt) => {
                        return(
                            <div className='step' id={`${instrument.name}Step${stepCt}`} key={stepCt} onClick={
                                (e) => {
                                    toggleStep(instName, stepCt);
                                    clickStepHandler(e)
                                }}>
                            </div>
                        )
                    })}</div>
                </div>
            )
        }
        // console.log(instruments);
        return instElems
    }
    return(
        <div className='step-pattern'>
            {drawPatternMap(instruments)}
        </div>
    )
}