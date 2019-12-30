// App.js > Sequencer.jsx > SequencerLeft.jsx

// react
import React from "react";

// modules

// style

// components
import AddInstrumentCard from './AddInstrumentCard';
import InstrumentHeadList from './InstrumentHeadList';

// utilities

// global vars

// main
export default function SequencerLeft({instrumentsStateObj, playbackObj, toggleStateObj}){
    // destructuring props
    let {playbackState} = playbackObj;
    let {toggleState, setToggle} = toggleStateObj;
    let {instrumentsArr, setInstrumentsArr} = instrumentsStateObj;

    const buildSequencerHead = () => {
        return (
            <div className='head'>
                {!toggleState['addInstrumentOpen'] ? 
                    <div className="add-instrument" onClick={() => {setToggle({type:'addInstrumentOpen' , addInstrumentOpen: true})}} title="Add Instrument" unselectable="on">&#10010;</div>: 
                    <div className="add-instrument active" onClick={() => {setToggle({type:'addInstrumentOpen' , addInstrumentOpen: false})}} title="Add Instrument" unselectable="on">&#10010;</div>}
                {toggleState['addInstrumentOpen'] && <AddInstrumentCard io={{instrumentsArr, setInstrumentsArr}} playbackState={playbackState} toggleStateObj={toggleStateObj} />}
            </div>
        )
    }

    return(
        <div className="sequencer-right flexcol">
            {buildSequencerHead()}
            <InstrumentHeadList instrumentsArr={instrumentsArr} />
        </div>
    )
}