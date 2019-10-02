import React, {useState} from 'react';
import StepPattern from './StepPattern';
import Automation from './Automation';

export default function Sequencer(props){
    let [showPattern, setShowPattern] = useState(true);

    function handleShowPattern(e){
        e.preventDefault();
        setShowPattern(!showPattern);
        console.log('this is pattern', e);
        console.log(showPattern, '\n');
    }
    return(
        <div className='sequencer'>
            <div className='sequencer-toggle' onClick={e => props.handleSequencerToggle(e, showPattern, setShowPattern)} >{showPattern ? 'Pattern': 'Automation'}</div>
            {showPattern ? <StepPattern />: <Automation />}
        </div>
    )
}