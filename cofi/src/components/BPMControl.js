import React, {useState} from 'react'

export default function BPMControl(props){
    let [validBPM, setValidBPM] = useState('128')
    let [BPM, setBPM] = useState(validBPM);
    function handleChange(e) {
        const newBPM = (e.target.validity.valid && e.target.value.length <= 3 && Number(e.target.value) <= 200) ? e.target.value : BPM;
        setBPM(newBPM);
    }
    function handleBlur(e) {
        let bpm = e.target.value;
        if (bpm > 50 && bpm < 200) {
            setValidBPM(bpm);
            props.getBPM(bpm);
        } else {
            setBPM(validBPM);
        }
    }
    return (
        <div className='bpmcontrol'>
            <form onSubmit={e => e.preventDefault()} onBlur={handleBlur} >
                <input id='bpm-input' type="text" pattern="[0-9]*" onChange={handleChange} value={BPM} />
            </form>
        </div>
    )
}