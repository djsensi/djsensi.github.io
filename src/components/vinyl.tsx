import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, useGLTF, Center, Bounds } from '@react-three/drei'
import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import * as THREE from 'three'

// Audio engine (persistent)
import { initVinylEngine, startVinyl, setSpeed, resetVinyl, fadeOut } from "../audio/vinylEngine"

export interface VinylHandle {
  stop: () => void
  reset: () => void
  fadeOut: () => void
}

interface VinylModelProps {
  onSpeedChange: (speed: number) => void
  spinning: boolean
  setDragging: (dragging: boolean) => void
  onReady?: () => void
}

function VinylModel({
  onSpeedChange,
  spinning,
  setDragging,
  onReady = () => {},
}: VinylModelProps) {
  const ref = useRef<THREE.Group>(null)
  const wrapper = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/vinyl_single.glb') as any

  useEffect(() => {
    if (!scene) return
    scene.traverse((child: any) => {
      if (child.isMesh) {
        const name = child.material?.name?.toLowerCase() || ''
        if (name.includes('vinyl') || name.includes('disc'))
          child.material.color = new THREE.Color('#444')
        if (name.includes('label'))
          child.material.color = new THREE.Color('#ddd')
      }
    })
  }, [scene])

  useEffect(() => {
    if (ref.current) ref.current.rotation.x = 0.45
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      if (wrapper.current) {
        wrapper.current.scale.set(0.90, 0.90, 0.90)
        onReady()
      }
    }, 60)
    return () => clearTimeout(t)
  }, [onReady])

  const velocity = useRef<number>(0)

  const onPointerDown = () => setDragging(true)
  const onPointerUp = () => {
    setDragging(false)
    velocity.current = 0
    onSpeedChange(0)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!ref.current || !e.buttons) return
    const raw = e.movementX * 0.004
    velocity.current = velocity.current * 0.8 + raw * 0.2
    ref.current.rotation.y += velocity.current
    onSpeedChange(velocity.current)
  }

  useEffect(() => {
    let frame: number
    const animate = () => {
      if (spinning && ref.current) {
        ref.current.rotation.y -= 0.02
      }
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [spinning])

  return (
    <Center>
      <group ref={wrapper}>
        <primitive
          ref={ref}
          object={scene}
          scale={4.3}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerOut={onPointerUp}
          onPointerMove={onPointerMove}
        />
      </group>
    </Center>
  )
}

interface VinylProps {
  audioFile: string
  onReady?: () => void
}

const Vinyl = forwardRef<VinylHandle, VinylProps>(function Vinyl(
  { audioFile, onReady = () => {} },
  ref
) {
  const [spinning, setSpinning] = useState(false)
  const [speed, setSpeedState] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useImperativeHandle(ref, () => ({
    stop() {
      resetVinyl()
    },
    reset() {
      setSpinning(false)
      setSpeedState(0)
      setDragging(false)
      resetVinyl()
    },
    fadeOut() {
      fadeOut()
    }
  }))

  // Load new track buffer WITHOUT rebuilding the audio graph
  useEffect(() => {
    initVinylEngine(audioFile)
  }, [audioFile])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Speed control
  useEffect(() => {
    if (dragging) {
      setSpeed(Math.max(-1.3, Math.min(1.3, speed)))
      return
    }

    if (spinning) {
      setSpeed(1)
      return
    }

    setSpeed(0)
  }, [speed, spinning, dragging])

  const handleClick = async () => {
    await startVinyl()
    setSpinning(prev => !prev)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        cursor: dragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
    >
      <Canvas camera={{ fov: 20 }} onClick={handleClick}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 35, 5]} intensity={8.0} castShadow />

        <Bounds fit clip margin={1.2} key={isMobile ? 'mobile' : 'desktop'}>
          <VinylModel
            spinning={spinning}
            onSpeedChange={setSpeedState}
            setDragging={setDragging}
            onReady={onReady}
          />
        </Bounds>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.25} />
        </mesh>

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  )
})

export default Vinyl
