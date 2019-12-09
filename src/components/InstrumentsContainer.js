import Kick808 from './instruments/Kick808';
import Snare808 from './instruments/Snare808';
import HihatClosed808 from './instruments/HihatClosed808';
// import Synth from './instruments/Synth';

export default function Instruments(totalSteps){
    // init instruments state
    let initInstState = {'triggered': false, 'activated': false, 'automation':{}}
    let instrumentsInit = {
        'kick': {'source':Kick808},
        'snare': {'source':Snare808},
        'hihat_closed': {'source':HihatClosed808},
        // 'hihat_open': {'source':HihatOpen808},
        // 'clap': {'source':Synth,'context':AC, 'freq':250},
        // 'rim': {'source':Synth,'context':AC, 'freq':200},
        // 'bell': {'source':Synth,'context':AC, 'freq':180},
    }
    for (let instrument in instrumentsInit) {
        instrumentsInit[instrument]['pattern'] = new Array(totalSteps).fill(initInstState)
    }
    return instrumentsInit
}