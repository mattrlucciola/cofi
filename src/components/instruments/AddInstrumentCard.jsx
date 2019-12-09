// App.js > Center.jsx > Sequencer.jsx > SequencerLeft.jsx > AddInstrumentCard.jsx

// react
import React from 'react';

// instrument bank
import InstrumentsBank from './InstrumentsBank';

// instrument functions
import {fillInstrumentPattern} from './instrumentFxns';

// start
export default function AddInstrumentCard({io, playbackState, toggleStateObj}){
    // deconstruct props
    const {totalSteps} = playbackState;
    // let {instrumentsArr, setInstrumentsArr} = io;
    let {instrumentsArr} = io;
    let {setToggle} = toggleStateObj;
    
    // return a list of instruments in the bank
    // make every isntrument click-to-add
    const addInstrumentToList = (instrumentObj, totalSteps) => {
        // fill out the step pattern
        instrumentObj = fillInstrumentPattern(instrumentObj, totalSteps);

        // add to the running list of instruments
        // setInstrumentsArr([...instrumentsArr, instrumentObj])
        instrumentsArr.push(instrumentObj)
    }
    return(
        <div className="add-instrument-card fade-in">
            {InstrumentsBank().map((instrumentObj, idx) => {
                return (
                    <div className="instrument-add-obj-container" key={`${idx}-aix`} >
                        <div className="instrument-add-obj" onClick={() => {addInstrumentToList(instrumentObj, totalSteps); setToggle({type:'addInstrumentOpen','addInstrumentOpen':false})}} key={`ical-${idx}`} >{instrumentObj['name']}</div>
                        <div className="instrument-add-info">{`>`}</div>
                    </div>
                )
            })}
        </div>
    )
}