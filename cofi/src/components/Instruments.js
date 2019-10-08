import {connectSrcGainDest} from './util/NodeMgmt';
import Synth from './Synth';

const kick808 = (AC) => {
    // create source object
    let source = {};
    source['source'] = AC.createOscillator();
    source['source'].frequency.value = 150;
    source['gain'] = AC.createGain();
    
    // connect to speakers
    connectSrcGainDest(source, AC.destination);

    // set envelope
    let ti = AC.currentTime;
    let tf = ti + 0.45;
    source['gain'].gain.setValueAtTime(0.5, ti);
    source['gain'].gain.exponentialRampToValueAtTime(0.001, tf);
    source['source'].start(ti);
    source['source'].stop(tf);
}
export default function Instruments(AC, totalSteps){
    // init instruments state
    let initInstState = {'triggered': false, 'activated': false, 'automation':{}}
    let instrumentsInit = {
        'kick': {'source':Synth, 'context':AC, 'freq': 261.6},
        'snare': {'source':Synth,'context':AC, 'freq': 400},
        'hihat_open': {'source':Synth,'context':AC, 'freq': 350},
        'hihat_closed': {'source':Synth,'context':AC, 'freq': 300},
        'clap': {'source':Synth,'context':AC, 'freq':250},
        'rim': {'source':Synth,'context':AC, 'freq':200},
        'bell': {'source':Synth,'context':AC, 'freq':180},
    }
    for (let instrument in instrumentsInit) {
        instrumentsInit[instrument]['pattern'] = new Array(totalSteps).fill(initInstState)
    }
    return instrumentsInit
}