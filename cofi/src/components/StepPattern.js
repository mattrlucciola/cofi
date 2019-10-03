import React from 'react';

export default function StepPattern(props){
    let {instruments, setInstruments} = props.instObj

    function clickStepHandler(e) {
        let elem = e.target;

        // turn a diff color and mark as active
        elem.className = elem.className.includes(' active') ? elem.className.replace(' active', ''): `${elem.className} active`;
    }
    function drawPatternMap(instruments){
        console.log('instruments- step pattern', instruments);
        instruments['kick']['pattern'][0] = 'lol'
        console.log('instruments after mod- step pattern', instruments);
        let instElems = [];
        for (let ii in instruments) {
            let instrument = instruments[ii];
            console.log(ii, instrument);
            
            instElems.push(
                <div className='instrument-container'>
                    <div className='instrument'>{ii}</div>
                    <div className='pattern'>{instrument.pattern.map((step, i) => {
                        return(
                             <div className='step' id={`${instrument.name}Step${i}`} onClick={clickStepHandler}></div>
                        )
                    })}</div>
                </div>
            )
        }
        console.log(instruments);
        return instElems
    }
    return(
        <div className='step-pattern'>
            {drawPatternMap(instruments)}
        </div>
    )
}