let audioCtx: AudioContext | null = null
let workletNode: AudioWorkletNode | null = null
let gainNode: GainNode | null = null
let initialized = false
let warmed = false

export async function initVinylEngine(audioFile: string): Promise<{
  audioCtx: AudioContext
  workletNode: AudioWorkletNode
  gainNode: GainNode
}> {
  // Create engine once
  if (!initialized) {
    initialized = true

    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext

    audioCtx = new AudioContextClass({ latencyHint: "interactive" })

    // Load worklet
    await audioCtx.audioWorklet.addModule("/worklets/vinylProcessor.js")

    workletNode = new AudioWorkletNode(audioCtx, "vinyl-processor")
    gainNode = audioCtx.createGain()
    gainNode.gain.value = 0

    workletNode.connect(gainNode)
    gainNode.connect(audioCtx.destination)
  }

  // ⭐ WARM-UP FIX (prevents first-stop pop + first-theme pop)
  if (!warmed) {
    warmed = true

    // 1. Send silent buffer to flush DC offset + initialize compressor
    const silent = new Float32Array(2048)
    workletNode!.port.postMessage({ type: "buffer", buffer: silent })

    // 2. Resume context so worklet processes one block
    await audioCtx!.resume()

    // 3. Wait for worklet to fully initialize
    await new Promise(r => setTimeout(r, 30))
  }

  // ⭐ Load new track buffer (no graph rebuild)
  const res = await fetch(audioFile)
  const arrayBuffer = await res.arrayBuffer()
  const buffer = await audioCtx!.decodeAudioData(arrayBuffer)

  const samples = new Float32Array(buffer.getChannelData(0))

  // Zero first samples to avoid Hermite click
  for (let i = 0; i < 100 && i < samples.length; i++) {
    samples[i] = 0
  }

  workletNode!.port.postMessage({ type: "buffer", buffer: samples })

  return {
    audioCtx: audioCtx!,
    workletNode: workletNode!,
    gainNode: gainNode!
  }
}

export async function startVinyl(): Promise<void> {
  if (!audioCtx || !gainNode) return

  await audioCtx.resume()

  const now = audioCtx.currentTime

  // Instant but safe fade-in
  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(1, now + 0.05)
}

export function setSpeed(speed: number): void {
  workletNode?.port.postMessage({ type: "speed", speed })
}

export function resetVinyl(): void {
  workletNode?.port.postMessage({ type: "reset" })
}

export function fadeOut(): void {
  if (!audioCtx || !gainNode) return
  const now = audioCtx.currentTime
  gainNode.gain.setValueAtTime(gainNode.gain.value, now)
  gainNode.gain.linearRampToValueAtTime(0, now + 0.05)
}

export function destroyVinylEngine() {
  try {
    // ⭐ Tell the worklet to begin graceful shutdown
    if (workletNode) {
      workletNode.port.postMessage({ type: "shutdown" })
    }

    // ⭐ Disconnect nodes
    try { workletNode?.disconnect() } catch { }
    try { gainNode?.disconnect() } catch { }

    // ⭐ Close the AudioContext
    if (audioCtx && audioCtx.state !== "closed") {
      audioCtx.suspend().catch(() => { })
      audioCtx.close().catch(() => { })
    }
  } catch (e) {
    console.warn("Vinyl teardown error:", e)
  }

  // Reset engine state
  audioCtx = null
  workletNode = null
  gainNode = null
  initialized = false
  warmed = false
}

