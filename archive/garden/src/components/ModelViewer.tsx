import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { Mesh } from 'three'
import { reducedMotion } from '../lib/util'

function Gltf({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

/** Stand-in object: a soft dome that slowly inflates, like a pneumatic actuator. */
function Dome() {
  const dome = useRef<Mesh>(null!)
  const still = reducedMotion()
  useFrame(({ clock }) => {
    const b = still ? 0.5 : (Math.sin(clock.elapsedTime * 1.1) + 1) / 2
    dome.current.scale.set(1.05, 0.45 + 0.4 * b * b * (3 - 2 * b), 1.05)
  })
  return (
    <group rotation-x={0.35}>
      <mesh ref={dome}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial color="#efeeea" roughness={0.5} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.3, 0.32, 24, 90]} />
        <meshStandardMaterial color="#dcdad3" roughness={0.6} />
      </mesh>
    </group>
  )
}

export default function ModelViewer({ url }: { url?: string }) {
  return (
    <Canvas flat dpr={[1, 2]} camera={{ position: [0, 1.2, 6.4], fov: 30 }}>
      <hemisphereLight args={['#ffffff', '#999080', 2.4]} />
      <directionalLight position={[-3, 5, 4]} intensity={2.8} />
      {url ? (
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center><Gltf url={url} /></Center>
          </Bounds>
        </Suspense>
      ) : (
        <Dome />
      )}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reducedMotion()} autoRotateSpeed={0.6} />
    </Canvas>
  )
}
