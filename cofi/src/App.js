import React, {useState} from 'react';
import './App.css';
import Sequencer from './components/Sequencer';
import Visualizer from './components/Visualizer';
import Header from './components/Header';
import BPMControl from './components/BPMControl';




function App() {
    document.onkeypress = handleKeyPress
    let [patternToggle, setPatternToggle] = useState(true);
    let [globalBPM, setGlobalBPM] = useState(128);
    
    function handleKeyPress(e){
        let key = e.key;
        if (key === 'p'){
            handleSequencerToggle(e, patternToggle, setPatternToggle)
        }
    }
    
    function handleSequencerToggle(e){
        setPatternToggle(!patternToggle)
    }


    function getBPM(bpm){
        console.log('this is bpm: ', bpm);
        setGlobalBPM(Number(bpm));
    }

    return (
        <div className="App">
            <Header />
            <BPMControl getBPM={getBPM} />
            <Sequencer globalBPM={globalBPM} handleSequencerToggle={handleSequencerToggle} patternToggle={patternToggle} />
            <Visualizer globalBPM={globalBPM} />
        </div>
    );
}

export default App;
