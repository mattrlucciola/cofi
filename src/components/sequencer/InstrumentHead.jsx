// App.js > Center.jsx > Sequencer.jsx > SequencerLeft.jsx > InstrumentHead.jsx

// react
import React from 'react'

// modules

// components

// start
export default function InstrumentHead({instId, instIdx}){
    
    return(
        <div className='instrument-container flexcol' key={`ic-${instId}-${instIdx}`}>
            <div className="top">
                <div className='instrument-id' key={`iii${instId}-${instIdx}`}>{`${instId}`}</div>
            </div>
            <div className='bottom'>
                <div className="instrument-settings">
                    <div className="slider-container">
                        <input type='range' min='0' max='100' value='50' onChange={()=>{}} className="amplitude"></input>
                    </div>
                </div>
            </div>
        </div>
    )
}