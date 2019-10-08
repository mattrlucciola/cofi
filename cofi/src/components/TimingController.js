import React from 'react'
let IB = '128';
export default function TimingController({bpmObj, stepObj}){
    let {globalBPM, setGlobalBPM, inputBPM, setInputBPM} = bpmObj;
    let {currentStep} = stepObj;
    
    function handleChange(e){
        // const newBPM = (e.target.validity.valid && e.target.value.length <= 3 && Number(e.target.value) <= 200) ? e.target.value : String(inputBPM);
        const newBPM = (e.target.validity.valid && e.target.value.length <= 3 && Number(e.target.value) <= 200) ? e.target.value : String(IB);
        setInputBPM(newBPM);
    }
    function handleBlur(e){
        let bpm = e.target.value;
        if (bpm > 50 && bpm < 200) {
            setGlobalBPM(bpm);
            setInputBPM(bpm);
        } else {
            setGlobalBPM(globalBPM);
            setInputBPM(globalBPM)
        }
    }
    function displayStepCount(){
        return(
            <div className='beat-count'>beat count: {currentStep + 1}</div>
        )
    }
    return (
        <div className='bpm-container'>
            <div className='bpm-control'>
                <input id='bpm-input' type="text" pattern="[0-9]*" onBlur={handleBlur} onChange={handleChange} value={inputBPM} />
            </div>
            {(currentStep >= 0) && displayStepCount()}
        </div>
    )
}