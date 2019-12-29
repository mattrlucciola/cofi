export default class Synth{
    constructor(AC, freq){
        this.AC = AC;
        this.freq = freq;
        this.wave = 'sine';
        this.createNodes = this.createNodes.bind(this);
        this.setFreq = this.setFreq.bind(this);
        this.setWaveform = this.setWaveform.bind(this);
        this.setBaseValues = this.setBaseValues.bind(this);

        return this.setBaseValues(this.wave, freq, AC);
    }
    createNodes(AC){return {'source': AC.createOscillator()}}
    setFreq(source, _freq_){
        source['source'].frequency.value = _freq_;
        return source
    }
    setWaveform(source, _wave_){
        if (['sine','square','sawtooth','triangle'].includes(_wave_)) {
            source['source'].type = _wave_
        } else if (_wave_ === 'custom') {
            let real = new Float32Array([0,1]);
            let imag = new Float32Array([0,0]);
            let wave = AudioContext.createPeriodicWave(real, imag, {disableNormalization: true});
            source['source'].setPeriodicWave(wave);
        } else if (_wave_ === 'none'){}
    }
    setBaseValues(_wave_, _freq_, AC){
        let source = this.createNodes(AC);
        this.setFreq(source, _freq_, AC)
        this.setWaveform(source, _wave_)
        return source
    }
}