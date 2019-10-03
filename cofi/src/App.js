import React, {useState} from 'react';
import './App.css';
import Sequencer from './components/Sequencer';
// import Visualizer from './components/Visualizer';
import Header from './components/Header';
import BPMControl from './components/BPMControl';
import Transport from './components/Transport'

function App() {
    document.onkeypress = handleKeyPress
    let [automationToggle, setAutomationToggle] = useState(true);
    let [globalBPM, setGlobalBPM] = useState(128);
    
    function handleKeyPress(e){
        let key = e.key;
        if (key === 'p'){
            handleSequencerToggle(e, automationToggle, setAutomationToggle)
        }
    }
    
    function handleSequencerToggle(e){
        setAutomationToggle(!automationToggle)
    }

    function getBPM(bpm){
        console.log('this is bpm: ', bpm);
        setGlobalBPM(Number(bpm));
    }

    return (
        <div className="App">
            <Header />
            <Transport />
            <BPMControl getBPM={getBPM} />
            <Sequencer globalBPM={globalBPM} handleSequencerToggle={handleSequencerToggle} automationToggle={automationToggle} />
            {/* <Visualizer globalBPM={globalBPM} /> */}
        </div>
    );
}

export default App;
