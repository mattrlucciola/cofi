// App.js > Sequencer.jsx > SequencerLeft.jsx > InstrumentHeadList.jsx

// react
import React from 'react';

// modules

// style

// components
import InstrumentHead from './InstrumentHead';

// utilities

// global vars

// main
export default function InstrumentHeadList({instrumentsArr}) {
    const buildInstrumentList = () => {
        let instElems = []
        let buildCt = 0
        for (let instIdx = 0; instIdx < instrumentsArr.length; instIdx++) {
            buildCt++
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