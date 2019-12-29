import React from 'react';
import Step from './Step';
export default function StepPattern({instruments, toggleStep, timing}){
    let {timeSignature, currentStep} = timing;

    function measureDiv(stepList) {
        return (
            <div className='measure'>
                {stepList}
                <div className='signatureSpacer'></div>
            </div>
        )
    }
    function drawPatternMap(instruments){
        let instElems = [];
        for (let instId in instruments) {
            let instrument = instruments[instId];
            // if (instId==='kick' || instId==='snare') {console.log(instId, instrument);}
            let measureList = [];
            instElems.push(
                <div className='instrument-container' key={`ic-${instId}`}>
                    <div className='instrument' key={`i${instId}`}>{`${instId}`}</div>
                    <div className='pattern' key={`p${instId}`}>{instrument.pattern.map((stepInfo, stepCt) => {
                        let key = `ps${instId}-${stepCt}`
                        if (stepCt%timeSignature===(0)){measureList = []}
                            measureList.push(<Step key={key} toggleStep={toggleStep} instId={instId} timing={{currentStep, stepCt, stepInfo}} />
                        )
                        if (stepCt%timeSignature===(timeSignature-1)){
                            return measureDiv(measureList)
                        } 
                    })}</div>
                </div>
            )
        }
        return instElems
    }
    return(
        <div className='step-pattern'>
            {drawPatternMap(instruments)}
        </div>
    )
}