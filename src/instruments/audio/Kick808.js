import {AC} from '../../util/AudioContext';
import {connectSrcGainDest} from '../../util/NodeMgmt';
export default function Kick808(){}
Kick808.prototype.setup = function(){
    this.source = {'source': AC.createOscillator(), 'gain': AC.createGain()};
    this.source['source'] = AC.createOscillator();
    this.source['gain'] = AC.createGain();

    // connect to speakers
    connectSrcGainDest(this.source, AC.destination);
}
Kick808.prototype.trigger = function(ti, callback){
    this.setup();
    let tf = ti + 1;
    this.source['source'].frequency.setValueAtTime(150, ti);
    this.source['gain'].gain.setValueAtTime(0.9, 0);

    this.source['gain'].gain.exponentialRampToValueAtTime(0.001, tf);
    this.source['source'].frequency.exponentialRampToValueAtTime(0.01, tf);

    this.source['source'].start(ti);
    this.source['source'].stop(tf);
    console.log(`kick 808)  ti:${ti}, `);
    if (!!callback) {this.source['source'].onended = callback;};
    return [this.source['source']]
}