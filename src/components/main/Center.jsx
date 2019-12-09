// App.js > Center.jsx

// react
import React from 'react';

// components
import Sequencer from '../sequencer/Sequencer';

// start
export default function Center({instrumentsStateObj, playbackObj, handleClickStep, toggleStateObj}){
    return (
        <div className="Center">
            <Sequencer instrumentsStateObj={instrumentsStateObj} playbackObj={playbackObj} handleClickStep={handleClickStep} toggleStateObj={toggleStateObj} />
        </div>
    )
}