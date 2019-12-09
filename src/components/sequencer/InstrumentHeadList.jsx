// App.js > Center.jsx > Sequencer.jsx > SequencerLeft.jsx > InstrumentHeadList.jsx

// react
import React from 'react';

// modules

// components
import InstrumentHead from './InstrumentHead';
// import {useCountRenders} from '../useCountRenders';

// start
export default function InstrumentHeadList({instrumentsArr}) {
    // useCountRenders("instrument head list")
    const buildInstrumentList = () => {
        let instElems = []
        let buildCt = 0
        for (let instIdx = 0; instIdx < instrumentsArr.length; instIdx++) {
            buildCt++
            // console.log(`Build Instrument list ${instIdx} ${buildCt}`)
            let instId = instrumentsArr[instIdx]['name']
            instElems.push(<InstrumentHead key={`insthead-${instId}-${instIdx}`} instId={instId} instIdx={instIdx} />)
        }
        return instElems
    }
    return (
        <div className='instrument-list'>
            {buildInstrumentList()}
        </div>
    )
}