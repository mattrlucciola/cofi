import {AC} from '../util/AudioContext';
import {connectSrcGainDest} from '../util/NodeMgmt';
export default function Snare808(){}

Snare808.prototype.noiseBuffer = function() {
	let bufSize = AC.sampleRate;
	let buf = AC.createBuffer(1, bufSize, AC.sampleRate);
	let output = buf.getChannelData(0);
	for (let i = 0; i < bufSize; i++) {
		output[i] = Math.random() * 2 - 1;
	}
	return buf;
};

Snare808.prototype.setup = function(){
    // simulate the snare rattle
    this.snare = AC.createBufferSource();
    this.snare.buffer = this.noiseBuffer();
    let noiseFilter = AC.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    this.snare.connect(noiseFilter);

    // create envelope 
    this.noiseEnvelope = AC.createGain();
    noiseFilter.connect(this.noiseEnvelope);
    this.noiseEnvelope.connect(AC.destination);

    // make oscillator
    this.source = {'source': AC.createOscillator(), 'gain': AC.createGain()};
    this.source['source'].type = 'triangle';
    this.oscEnvelope = AC.createGain();
    this.source['source'].connect(this.oscEnvelope);
    this.oscEnvelope.connect(AC.destination);

    // connect to speakers
    connectSrcGainDest(this.source, AC.destination);
}

Snare808.prototype.trigger = function(ti, callback) {
	this.setup();

	this.noiseEnvelope.gain.setValueAtTime(1, ti);
	this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, ti + 0.2);
	this.snare.start(ti)

	this.source['source'].frequency.setValueAtTime(100, ti);
	this.oscEnvelope.gain.setValueAtTime(0.7, ti);
	this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, ti + 0.1);
	this.source['source'].start(ti)

	this.source['source'].stop(ti + 0.2);
    this.snare.stop(ti + 0.2);
    console.log(`snare 808)  ti:${ti}, `);
    
    if (!!callback) {this.source['source'].onended = callback;};
    return [this.source['source'], this.snare];
};
