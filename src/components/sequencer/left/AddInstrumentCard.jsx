// App.js > Sequencer.jsx > SequencerLeft.jsx > AddInstrumentCard.jsx

// react
import React from 'react';

// modules

// style

// components

// utilities
import {instrumentsBank} from '../../../instruments/audio/InstrumentsBank';
import {fillInstrumentPattern} from '../../../instruments/functions/instrumentFxns';

// global vars

// main
export default function AddInstrumentCard({io, playbackState, toggleStateObj}){
    // deconstruct props
    const {totalSteps} = playbackState;
    let {instrumentsArr} = io;
    let {setToggle} = toggleStateObj;
    
    // return a list of instruments in the bank
    // make every isntrument click-to-add
    const addInstrumentToList = (instrumentObj, totalSteps) => {
        // fill out the step pattern
        instrumentObj = fillInstrumentPattern(instrumentObj, totalSteps);

        // add to the running list of instruments
        instrumentsArr.push(instrumentObj)
    }
    return(
        <div className="add-instrument-card fade-in">
            {instrumentsBank().map((instrumentObj, idx) => {
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