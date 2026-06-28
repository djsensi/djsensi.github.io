// class VinylProcessor extends AudioWorkletProcessor {

//   constructor() {
//     super()

//     this.buffer = null
//     this.position = 0
//     this.speed = 0

//     // compressor state
//     this.compGain = 1.0

//     this.port.onmessage = (event) => {
//       const data = event.data

//       if (data.type === "buffer") {
//         this.buffer = data.buffer
//         this.position = 0
//       }

//       if (data.type === "speed") {
//         if (data.speed === 0 || data.speed === 1) {
//           this.speed = data.speed
//         } else {
//           this.speed = this.speed * 0.85 + data.speed * 0.15
//         }
//       }
//     }
//   }

//   hermite(buffer, length, pos) {
//     const i0 = Math.floor(pos)
//     const frac = pos - i0

//     const im1 = (i0 - 1 + length) % length
//     const i1 = (i0 + 1) % length
//     const i2 = (i0 + 2) % length

//     const xm1 = buffer[im1]
//     const x0  = buffer[i0]
//     const x1  = buffer[i1]
//     const x2  = buffer[i2]

//     const c0 = x0
//     const c1 = 0.5 * (x1 - xm1)
//     const c2 = xm1 - 2.5 * x0 + 2 * x1 - 0.5 * x2
//     const c3 = 0.5 * (x2 - xm1) + 1.5 * (x0 - x1)

//     return ((c3 * frac + c2) * frac + c1) * frac + c0
//   }

//   process(inputs, outputs) {
//     const output = outputs[0]
//     if (!this.buffer) return true

//     const channel = output[0]
//     const bufferLength = this.buffer.length

//     const oversample = 2

//     for (let i = 0; i < channel.length; i++) {

//       let sample = 0

//       for (let o = 0; o < oversample; o++) {
//         let pos = this.position + (o / oversample) * this.speed

//         while (pos < 0) pos += bufferLength
//         pos = pos % bufferLength

//         sample += this.hermite(this.buffer, bufferLength, pos)
//       }

//       sample /= oversample

//       // --- ULTRA SCRATCH GAIN CURVE ---
//       const absSpeed = Math.abs(this.speed)

//       // Up to +30 dB near zero speed
//       let gain = 1.0 + Math.pow(1.0 - absSpeed, 2.5) * 8.0

//       // --- TRANSIENT EXCITER ---
//       // Adds bite to the attack
//       const exciter = sample * 0.25
//       sample += exciter

//       // Apply gain
//       sample *= gain

//       // --- SCRATCH COMPRESSOR ---
//       const target = 0.6
//       const level = Math.abs(sample)

//       if (level > target) {
//         this.compGain = this.compGain * 0.9 + (target / level) * 0.1
//       } else {
//         this.compGain = this.compGain * 0.98 + 1.0 * 0.02
//       }

//       sample *= this.compGain

//       // --- SOFT LIMITER ---
//       const limit = 0.9
//       if (sample > limit) sample = limit + (sample - limit) * 0.05
//       if (sample < -limit) sample = -limit + (sample + limit) * 0.05

//       channel[i] = sample

//       this.position += this.speed
//     }

//     return true
//   }
// }

// registerProcessor("vinyl-processor", VinylProcessor)

class VinylProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = null;
    this.phase = 0;
    
    this.targetSpeed = 0;  
    this.currentSpeed = 0; 
    this.currentGain = 0; // Internal micro-volume fader (0 to 1)
    
    this.port.onmessage = (e) => {
      if (e.data.type === 'buffer') {
        this.buffer = e.data.buffer;
      }
      if (e.data.type === 'speed') {
        this.targetSpeed = e.data.speed;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const outputChannel = output[0];
    
    if (!this.buffer) return true;

    for (let i = 0; i < outputChannel.length; i++) {
      // Speed smoothing (keeps your sweet spot feel)
      this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.02;

      if (Math.abs(this.currentSpeed) < 0.0001) {
        this.currentSpeed = 0;
      }

      // --- DYNAMIC INTERACTION VOLUME LAYER ---
      // If speed is 0, target gain is 0 (silence). If moving, target gain is 1 (full volume).
      const targetGain = this.currentSpeed === 0 ? 0 : 1;
      
      // Smoothly fade the volume over a handful of samples (0.05 rate)
      // This eliminates the stop/start pop without adding audible lag
      this.currentGain += (targetGain - this.currentGain) * 0.05;

      this.phase += this.currentSpeed;
      
      if (this.phase >= this.buffer.length) {
        this.phase -= this.buffer.length;
      } else if (this.phase < 0) {
        this.phase += this.buffer.length;
      }

      // Linear sample interpolation
      const indexA = Math.floor(this.phase);
      const indexB = (indexA + 1) >= this.buffer.length ? 0 : indexA + 1;
      const t = this.phase - indexA;

      const sampleA = this.buffer[indexA] || 0;
      const sampleB = this.buffer[indexB] || 0;
      const smoothedSample = sampleA + t * (sampleB - sampleA);

      // Apply our micro-gain filter to the final output sample
      const finalSample = smoothedSample * this.currentGain;

      outputChannel[i] = finalSample;
      if (output[1]) {
        output[1][i] = finalSample;
      }
    }

    return true;
  }
}

registerProcessor('vinyl-processor', VinylProcessor);