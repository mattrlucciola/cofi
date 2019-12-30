export default function assignGlobalClick(toggleState, setToggle){
    // set all onClick events here
    document.onclick = (e) => {
        let targetClass = e.target.className;
    
        // clicking away from the add-instrument menu
        if (toggleState['addInstrumentOpen'] && !['add-instrument-card', 'instrument-add-info', 'instrument-add-obj-container', 'instrument-add-obj', 'add-instrument active'].includes(targetClass)) {
            setToggle({type:'addInstrumentOpen' , addInstrumentOpen: !toggleState['addInstrumentOpen']})
            console.log(toggleState['addInstrumentOpen'])
    
        }
    }
}