import React, {useState} from 'react';
import StepPattern from './StepPattern';
import Automation from './Automation';

export default function Sequencer(props){
    let [showPattern, setShowPattern] = useState(true);

    function handleShowPattern(e){
        e.preventDefault();
        setShowPattern(!showPattern);
        console.log(e);
        console.log(showPattern, '\n');
    }
    return(
        <div className='sequencer'>
            {showPattern ? <StepPattern handleShowPattern={handleShowPattern} />: <Automation />}
        </div>
    )
}