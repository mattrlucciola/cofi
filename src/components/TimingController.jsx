import React, {useState} from 'react';

export default function TimingController({bpmObj, stepObj}){
    let {globalBPM, setGlobalBPM} = bpmObj;
    let {currentStep, totalSteps, setTotalSteps, timeSignature, setTimeSignature} = stepObj;
    
    // set states
    let [inputBPM, setInputBPM] = useState(globalBPM);
    let [inputTotalSteps, setInputTotalSteps] = useState(totalSteps);
    let [inputSignature, setInputSignature] = useState(timeSignature);
    
    // handler functions

    // bpm handlers
    function handleChangeBPM(e){
        // const newBPM = (e.target.validity.valid && e.target.value.length <= 3 && Number(e.target.value) <= 200) ? e.target.value : String(inputBPM);
        const newBPM = (e.target.validity.valid && e.target.value.length <= 3 && Number(e.target.value) <= 200) ? e.target.value : globalBPM;
        setInputBPM(newBPM);
    }
    function handleBlurBPM(e){
        let bpm = e.target.value;
        if (bpm > 50 && bpm < 200) {
            setGlobalBPM(bpm);
            setInputBPM(bpm);
        } else {
            setGlobalBPM(globalBPM);
            setInputBPM(globalBPM);
        }
    }

    // total steps handlers
    const handleChangeTotalSteps = (e) => {
        let newTotalSteps = (e.target.validity.valid && Number(e.target.value) < 200) &&  e.target.value;
        setInputTotalSteps(newTotalSteps);
    }
    function handleBlurTotalSteps(e){
        let potentialNewTotalSteps = Number(e.target.value);
        if ((potentialNewTotalSteps >= timeSignature) && (potentialNewTotalSteps % timeSignature === 0)) {
            setTotalSteps(potentialNewTotalSteps);
            setInputTotalSteps(potentialNewTotalSteps);
        } else {
            setTotalSteps(totalSteps);
            setInputTotalSteps(totalSteps);
        }
    }

    // signature handlers
    const handleChangeTimeSignature = (e) => {
        let newSignature = (e.target.validity.valid && Number(e.target.value) <= 12) &&  e.target.value;
        setInputSignature(newSignature);
    };
    function handleBlurTimeSignature(e){
        let potentialNewSignature = e.target.value;
        if (([3,4,5,7].includes(Number(potentialNewSignature)))) {
            setTimeSignature(potentialNewSignature);
            setInputSignature(potentialNewSignature);
        } else {
            setTimeSignature(timeSignature);
            setInputSignature(timeSignature);
        }
    }

    // other functions
    function displayStepCount(){
        return(
            <div className='beat-count'>beat count: {currentStep + 1}</div>
        )
    }
    return (
        <div className='bpm-container'>
            <div className='bpm-control'>
                <input id='bpm-input' type="text" pattern="[0-9]*" onBlur={handleBlurBPM} onChange={handleChangeBPM} value={inputBPM} />
            </div>
            <div className='total-steps-control'>
                <input id='total-steps-input' type="text" pattern="[0-9]*" onBlur={handleBlurTotalSteps} onChange={handleChangeTotalSteps} value={inputTotalSteps} />
            </div>
            <div className='time-signature-control'>
                <input id='time-signature-input' type="text" pattern="[0-9]*" onBlur={handleBlurTimeSignature} onChange={handleChangeTimeSignature} value={inputSignature} />
            </div>
            {(currentStep >= 0) && displayStepCount()}
        </div>
    )
}