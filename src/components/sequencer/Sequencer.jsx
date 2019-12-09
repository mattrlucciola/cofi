// App.js > Center.jsx > Sequencer.jsx

// react
import React from "react";

// modules

// components
import SequencerLeft from './SequencerLeft';
import SequencerRight from './SequencerRight';
// import Automation from './Automation';

// start
export default function Sequencer({instrumentsStateObj, playbackObj, handleClickStep, toggleStateObj}){
    // let {handleSequencerToggle, automationToggle} = toggles;
    
    return(
        <div className='sequencer'>
            {/* <div className='sequencer-toggle' onClick={handleSequencerToggle} > {automationToggle ? 'Pattern': 'Automation'}</div> */}
            {/* <div className='sequencer-toggle' >Pattern</div> */}
            
            <SequencerLeft instrumentsStateObj={instrumentsStateObj} playbackObj={playbackObj} toggleStateObj={toggleStateObj} />
            <SequencerRight instrumentsStateObj={instrumentsStateObj} playbackObj={playbackObj} handleClickStep={handleClickStep} toggleStateObj={toggleStateObj} />
            {/* {automationToggle ? <StepPattern instrumentObj={instrumentObj} timing={timing} />: <Automation instruments={instruments} />} */}
        </div>
    )
}