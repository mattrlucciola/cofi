// App > TimingController

// react
import React, {useState} from 'react';

// modules

// style

// components

// utilities

// global vars
const maxBPM = 250;
const minBPM = 50;

// main
export default function TimingController({currentStep, playbackObj}){
    // destructuring
    const {playbackState, setPlayback} = playbackObj;

    // state
    const [transBPM, setTransBPM] = useState(playbackState['bpm'])

    // functions
    const validateBPMInput = (e) => {
        const target = e.target;
        const inputIsBlank = !target.value
        const inputIsValid = target.validity.valid || inputIsBlank;
        const inputLengthIsLessThan3 = target.value.length <= 3;
        const inputIsLessThanMaxBPM = Number(target.value) <= maxBPM;
        if (inputIsValid && inputLengthIsLessThan3 && inputIsLessThanMaxBPM) {
            if (inputIsBlank) {
                setTransBPM('')
            } else {
                setTransBPM(Number(target.value))
            }
        }
    }
    const handleKeyPress = (e) => {
        const eventKey = e.key;
        [' ', 'Enter'].includes(eventKey) && e.currentTarget.blur()
    }
    const handleChange = (e) => {validateBPMInput(e)}
    function handleBlur(e){
        e.preventDefault()
        let bpm = e.currentTarget.length ? e.currentTarget[0].value : e.target.value;
        if (bpm >= minBPM && bpm <= maxBPM) {
            setPlayback({type: 'bpm', value: bpm})
            setTransBPM(bpm);
        } else if (bpm < minBPM) {
            setPlayback({type: 'bpm', value: minBPM})
            setTransBPM(minBPM);
        } else if (bpm > maxBPM) {
            setPlayback({type: 'bpm', value: maxBPM})
            setTransBPM(maxBPM);
        } else {
            setPlayback({type: 'bpm', value: playbackState['bpm']})
            setTransBPM(playbackState['bpm'])
        }
    }
    function displayStepCount(){
        return(
            <div className='beat-count'>Step Count: {currentStep + 1}</div>
        )
    }
    return (
        <div className='bpm-container'>
            <div className='bpm-control'>
                <input id='bpm-input' type="text" pattern="[0-9]*" onBlur={handleBlur} onChange={handleChange} onKeyPress={handleKeyPress} value={transBPM} />
            </div>
            {displayStepCount()}
        </div>
    )
}