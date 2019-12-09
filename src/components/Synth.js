export default class Synth{
    constructor(AC, freq){
        this.AC = AC;
        this.freq = freq;
        this.wave = 'sine';
        this.createNodes = this.createNodes.bind(this);
        this.setFreq = this.setFreq.bind(this);
        // this.connectNodes = this.connectNodes.bind(this);
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

// export default function Synth(AC, freq){
//     function createNodes(AC){return {'source': AC.createOscillator(), 'gain': AC.createGain()}}
//     function setFreq(source, _freq_, AC){
//         source['gain'].gain.value = 0;
//         let _t_ = AC.currentTime;
//         source['gain'].gain.setValueAtTime(0, _t_)
//         source['gain'].gain.linearRampToValueAtTime(0.2, _t_ + 0.07);
//         source['source'].frequency.value = _freq_;
//     }
//     function connectNodes(source, AC){
//         source['gain'].connect(AC.destination);
//         source['source'].connect(source['gain']);
//     }
//     function setWaveform(source, _wave_){
//         if (['sine','square','sawtooth','triangle'].includes(_wave_)) {
//             source['source'].type = _wave_
//         } else if (_wave_ === 'custom') {
//             let real = new Float32Array([0,1]);
//             let imag = new Float32Array([0,0]);
//             let wave = AudioContext.createPeriodicWave(real, imag, {disableNormalization: true});
//             source['source'].setPeriodicWave(wave);
//         } else if (_wave_ === 'none'){}
//     }
//     function setBaseValues(_wave_, _freq_, AC){
//         let source = createNodes(AC);
//         setFreq(source, _freq_, AC)
//         connectNodes(source, AC)
//         setWaveform(source, _wave_)
//         return source
//     }
//     return setBaseValues('sine', freq, AC);
// }