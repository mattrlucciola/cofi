// App.js > Center.jsx > SequencerRight.jsx

// react
import React from "react";

// modules

// components
import Step from './Step';

// start
export default function SequencerRight({instrumentsStateObj, playbackObj, handleClickStep, toggleStateObj}){
    
    // destructuring props
    let {instrumentsArr, setInstrumentsArr} = instrumentsStateObj;
    // let {instrumentsArr} = instrumentsStateObj;
    let {playbackState, currentStep} = playbackObj;
    const buildTransportPattern = () => {
        return (
            <div className='transport flexcol' >
                <div className='step-list flexrow' >
                    {
                        [...Array(playbackState['totalSteps']).keys()].map((stepCt) => {
                            return <div className='step' onClick={handleClickStep} value={stepCt} key={`ts-spt-${stepCt}`} ></div>
                        })
                    }
                </div>
            </div>
        )
    }
    const buildInstrumentPatternList = () => {
        let patternsElems = [];
        for (let instIdx = 0; instIdx < instrumentsArr.length; instIdx++) {
            let instId = instrumentsArr[instIdx]['name']
            let instPattern = instrumentsArr[instIdx]['pattern']
            patternsElems.push(
                <div className="step-list flexrow" key={`pp${instId}-${instIdx}`}>
                    {instPattern.map((stepInfo, stepCt)=>{
                        let key=`ps${instId}-${stepCt}`;
                        return <Step key={key} instrumentsStateObj={{instIdx, instrumentsArr, setInstrumentsArr}} timing={{currentStep, stepCt, stepInfo}} />
                        // return <Step key={key} instrumentsStateObj={{instIdx, instrumentsArr}} timing={{currentStep, stepCt, stepInfo}} />
                    })}
                </div>
            )
        }
        return (
            <div className="instrument-pattern-container flexcol">
                {patternsElems}
            </div>
        )
    }
    return(
        <div className="sequencer-left flexcol">
            <div className="left-container">
                {buildTransportPattern()}
                {buildInstrumentPatternList()}
            </div>
            <div></div>
        </div>
    )
}