// App.js > Center.jsx > Sequencer.jsx > SequencerLeft.jsx

// react
import React from "react";

// modules

// components
import AddInstrumentCard from '../instruments/AddInstrumentCard';
import InstrumentHeadList from './InstrumentHeadList';

// start
export default function SequencerLeft({instrumentsStateObj, playbackObj, toggleStateObj}){
    // destructuring props
    let {playbackState} = playbackObj;
    // let {timeSignature} = playbackState;
    let {toggleState, setToggle} = toggleStateObj;
    let {instrumentsArr, setInstrumentsArr} = instrumentsStateObj;
    // let {instrumentsArr} = instrumentsStateObj;

    const buildSequencerHead = () => {
        return (
            <div className='head'>
                {!toggleState['addInstrumentOpen'] ? 
                    <div className="add-instrument" onClick={() => {setToggle({type:'addInstrumentOpen' , addInstrumentOpen: true})}} title="Add Instrument" unselectable="on">&#10010;</div>: 
                    <div className="add-instrument active" onClick={() => {setToggle({type:'addInstrumentOpen' , addInstrumentOpen: false})}} title="Add Instrument" unselectable="on">&#10010;</div>}
                {toggleState['addInstrumentOpen'] && <AddInstrumentCard io={{instrumentsArr, setInstrumentsArr}} playbackState={playbackState} toggleStateObj={toggleStateObj} />}
                {/* {toggleState['addInstrumentOpen'] && <AddInstrumentCard io={{instrumentsArr}} playbackState={playbackState} toggleStateObj={toggleStateObj} />} */}
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