import { Canvas } from '@react-three/fiber'
import { OrbitControls, Bounds, useGLTF } from '@react-three/drei'

function TotoModel() {
  const { scene } = useGLTF('/models/dog.glb')

  // Make the dog bigger
  scene.scale.set(3, 3, 3)

  return <primitive object={scene} />
}

export default function Toto() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ fov: 35 }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      {/* Auto-fit the model so NOTHING is cropped */}
      <Bounds fit clip observe margin={1.2}>
        <TotoModel />
      </Bounds>

      <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={2} />
    </Canvas>
  )
}
