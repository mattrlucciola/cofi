// Center.jsx > Sequencer.jsx > SequencerRight.jsx > Step.jsx

// react
import React from 'react'

// modules

// components
import {useCountRenders} from '../useCountRenders';

// start
export default function Step({instrumentsStateObj, timing}){
    useCountRenders("STEP RERENDER")
    // destructuring props
    let {instIdx, instrumentsArr, setInstrumentsArr} = instrumentsStateObj;
    // let {instIdx, instrumentsArr} = instrumentsStateObj;
    let {currentStep, stepCt, stepInfo} = timing;

    // default variables
    let triggered = `${currentStep===stepCt}`;
    let activated = `${stepInfo['activated']}`;
    let id = `${instrumentsArr[instIdx]}Step${stepCt}`;
    let key = `s-${stepCt}`;

    const toggleStep = () => {
        let x = 2;
        if (x === 1) {
            let instrumentsArrCopy = [...instrumentsArr];
            let {activated, ...other} = instrumentsArrCopy[instIdx]['pattern'][stepCt];
            instrumentsArrCopy[instIdx]['pattern'][stepCt] = {'activated': !activated, ...other};
            // setInstrumentsArr(instrumentsArrCopy)
            instrumentsArr = instrumentsArrCopy
        } else {
            let {activated, ...other} = instrumentsArr[instIdx]['pattern'][stepCt];
            instrumentsArr[instIdx]['pattern'][stepCt] = {'activated': !activated, ...other};
            setInstrumentsArr([...instrumentsArr])
        }
    }

    return(
        <div className='step' triggered={triggered} activated={activated} id={id} key={key} onClick={
            () => {toggleStep()}}>
        </div>
    )
}