import Kick808 from './Kick808';
import Snare808 from './Snare808';
import HihatClosed808 from './HihatClosed808';
import Synth from './Synth';

export default function InstrumentsBank(totalSteps){
    // init instruments state
    let instrumentsArr = [
        {'source':Kick808, 'name':'Kick'},
        {'source':Snare808, 'name':'snare'},
        {'source':HihatClosed808, 'name':'hihat_closed'},
        {'source':Synth, 'name':'synth'},
        // 'hihat_open': {'source':HihatOpen808},
        // 'clap': {'source':Synth,'context':AC, 'freq':250},
        // 'rim': {'source':Synth,'context':AC, 'freq':200},
        // 'bell': {'source':Synth,'context':AC, 'freq':180},
    ]
    // let initInstState = {'triggered': false, 'activated': false, 'automation':{}}
    // for (let instrument in instrumentsInit) {
    //     instrumentsInit[instrument]['pattern'] = new Array(totalSteps).fill(initInstState)
    // }
    return instrumentsArr;
}