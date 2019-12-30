import {AC} from '../../util/AudioContext';
import {connectSrcGainDest} from '../../util/NodeMgmt';

export function SilentNote(AC, playbackState, init, gainValue){
    this.init = init;
    this.gainValue = gainValue;
    this.playbackState = playbackState;
}
SilentNote.prototype.setup = function(){
    this.source = {};
    this.source['source'] = AC.createOscillator();
    this.source['gain'] = AC.createGain();

    // connect to speakers
    connectSrcGainDest(this.source, AC.destination);
}
SilentNote.prototype.trigger = function(getters, setters, callback){
    const {currentStepTimeStop} = getters;
    this.setup();

    this.source['source'].frequency.setValueAtTime(666, 0);
    let gainValue = this.init ? 0 : this.gainValue;
    this.source['gain'].gain.setValueAtTime(gainValue, 0);

    this.source['source'].start(0);
    this.source['source'].stop(currentStepTimeStop);

    if (!!callback && !this.init) {this.source['source'].onended = () => {callback(getters, setters)}}
    return [this.source['source']]
}
