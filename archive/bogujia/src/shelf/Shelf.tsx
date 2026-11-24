import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef, useState, type RefObject } from 'react'
import { Box3, Color, Group, Vector3, type DirectionalLight, type HemisphereLight, type Mesh, type PerspectiveCamera, type PointLight } from 'three'
import { asset } from '../lib/assets'
import { reducedMotion } from '../lib/util'
import { useStore } from '../store'
import { FLOOR_Y, makeCabinet, makeItem } from './items'
import { CELLS, cellCenter, cellFloor, LIGHT, SHELF } from './layout'

/** What the camera frames: a cell's route, 'works' / 'home' for the whole cabinet. */
type Props = { focus: string; sheetOpen: boolean; narrow: boolean; onSelect: (route: string) => void }
type SceneProps = Props & { plaques: RefObject<Record<number, HTMLButtonElement | null>>; hover: number | null; setHover: (i: number | null) => void }

export default function Shelf(props: Props) {
  const plaques = useRef<Record<number, HTMLButtonElement | null>>({})
  const [hover, setHover] = useState<number | null>(null)
  const label = hover !== null ? CELLS[hover].label : undefined
  return (
    <div className="gl">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 26, position: [0, 0.2, 16], near: 0.1, far: 100 }}
        frameloop={props.sheetOpen && props.narrow ? 'never' : 'always'}>
        <Scene {...props} plaques={plaques} hover={hover} setHover={setHover} />
      </Canvas>
      {/* small name plaques under each section, positioned every frame by <Scene> */}
      <div className="labs">
        {CELLS.map((c, i) => c.route && (
          <button key={i} type="button" ref={(el) => { plaques.current[i] = el }} onClick={() => props.onSelect(c.route!)}
            className={'plaque' + (i === hover || c.route === props.focus ? ' on' : '')}>
            {c.label![0]}
          </button>
        ))}
      </div>
      <div className={'shelf-tag' + (hover !== null ? ' on' : '')} aria-hidden>
        {hover !== null && (label ? `${label[0]} · ${label[1]}` : '清玩 · 陈设')}
      </div>
    </div>
  )
}

/** Your own model for a compartment, scaled to fit it and stood on its floor. */
function GltfFit({ url, w, h }: { url: string; w: number; h: number }) {
  const { scene } = useGLTF(url)
  const obj = useMemo(() => {
    const o = scene.clone(true)
    const size = new Box3().setFromObject(o).getSize(new Vector3())
    o.scale.setScalar(Math.min((w * 0.7) / size.x, (h * 0.75) / size.y, 0.8 / size.z))
    const b = new Box3().setFromObject(o), c = b.getCenter(new Vector3())
    o.position.set(-c.x, -b.min.y, -c.z)
    o.traverse((m) => { if ((m as Mesh).isMesh) m.castShadow = m.receiveShadow = true })
    return o
  }, [scene, w, h])
  return <primitive object={obj} />
}

function Scene({ focus, sheetOpen, narrow, onSelect, plaques, hover, setHover }: SceneProps) {
  const time = useStore((s) => s.time)
  const { gl, size } = useThree()
  const cabinet = useMemo(makeCabinet, [])
  const models = useMemo(() => CELLS.map((c) => asset(`shelf/${c.item}.glb`)), [])
  const items = useMemo(() => CELLS.map((c, i) => (models[i] ? null : makeItem(c.item))), [models])
  const holders = useRef<(Group | null)[]>([])
  const cab = useRef<Group>(null!)
  const key = useRef<DirectionalLight>(null!)
  const hemi = useRef<HemisphereLight>(null!)
  const lamp = useRef<PointLight>(null!)
  const tmp = useMemo(() => ({ c: new Color(), v: new Vector3(), tp: new Vector3(), tl: new Vector3(), look: new Vector3() }), [])
  const still = reducedMotion()

  useFrame((state, dt) => {
    const L = LIGHT[time]
    const k = still ? 1 : 1 - Math.pow(1 - 0.04, dt * 60)
    key.current.color.lerp(tmp.c.set(L.key), k)
    key.current.intensity += (L.keyI - key.current.intensity) * k
    key.current.position.lerp(tmp.v.set(...L.keyPos), k)
    hemi.current.color.lerp(tmp.c.set(L.sky), k)
    hemi.current.groundColor.lerp(tmp.c.set(L.ground), k)
    hemi.current.intensity += (L.hemiI - hemi.current.intensity) * k
    lamp.current.intensity += (L.lamp - lamp.current.intensity) * k
    state.gl.toneMappingExposure += (L.exposure - state.gl.toneMappingExposure) * k

    // objects: the hovered or focused one lifts a little and turns slowly
    const fi = CELLS.findIndex((c) => c.route === focus)
    holders.current.forEach((h, i) => {
      if (!h) return
      const active = i === hover || i === fi
      h.position.y += ((cellFloor(CELLS[i]) + (active ? 0.12 : 0)) - h.position.y) * Math.min(1, dt * 8)
      if (active && !still) h.rotation.y += dt * 0.9
      else h.rotation.y += (0 - h.rotation.y) * Math.min(1, dt * 4)
    })

    // camera: frame the whole cabinet, or one cell, inside the screen area left free by the sheet
    // (on the right) or by the name and intro (on the left, home view only)
    const cam = state.camera as PerspectiveCamera
    const tanV = Math.tan((cam.fov * Math.PI) / 360), tanH = tanV * (size.width / size.height)
    const right = sheetOpen && !narrow ? Math.min(820, size.width * 0.6) : 0
    const left = !sheetOpen && size.width > 900 ? Math.min(380, size.width * 0.26) : 0
    const free = (size.width - left - right) / size.width
    const c = fi >= 0 ? CELLS[fi] : null
    const [cx, cy] = c ? cellCenter(c) : [0, -0.15]
    const halfW = c ? Math.max(c.w, c.h * 0.9) * 0.95 : SHELF.W / 2 + 1
    const halfH = c ? c.h * 0.95 : SHELF.H / 2 + 1.2
    const dist = Math.min(40, Math.max(c ? 4.5 : 12, halfW / (free * tanH), halfH / tanV)) + SHELF.DEP / 2
    const shift = ((right - left) / size.width) * (dist - SHELF.DEP / 2) * tanH
    tmp.tl.set(cx + shift, cy, 0)
    tmp.tp.set(cx + shift, cy + 0.15, dist)
    const kc = still ? 1 : 1 - Math.pow(1 - 0.05, dt * 60)
    cam.position.lerp(tmp.tp, kc)
    tmp.look.lerp(tmp.tl, kc)
    cam.lookAt(tmp.look)
    cam.updateMatrixWorld()

    // a gentle turn of the whole cabinet toward the pointer, only on the home view
    const calm = still || sheetOpen
    cab.current.rotation.y += ((calm ? 0 : state.pointer.x * 0.08) - cab.current.rotation.y) * Math.min(1, dt * 3)
    cab.current.rotation.x += ((calm ? 0 : -state.pointer.y * 0.04) - cab.current.rotation.x) * Math.min(1, dt * 3)
    cab.current.updateMatrixWorld()

    CELLS.forEach((cell, i) => {
      const el = plaques.current[i]
      if (!el) return
      const [px] = cellCenter(cell)
      tmp.v.set(px, -SHELF.H / 2 + cell.y + SHELF.T / 2, SHELF.DEP / 2 + 0.02).applyMatrix4(cab.current.matrixWorld).project(cam)
      el.style.transform = `translate(${((tmp.v.x + 1) / 2) * size.width}px, ${((1 - tmp.v.y) / 2) * size.height}px) translate(-50%, -50%)`
    })
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={[LIGHT[time].sky, LIGHT[time].ground, LIGHT[time].hemiI]} />
      <directionalLight ref={key} position={LIGHT[time].keyPos} intensity={LIGHT[time].keyI} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} shadow-normalBias={0.02}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-camera-near={1} shadow-camera-far={40} />
      <pointLight ref={lamp} position={[-3.2, 1.6, 4.2]} intensity={0} distance={18} decay={2} color="#ffb067" />

      {/* the room: a plaster wall behind, a wooden floor below */}
      <mesh position={[0, 0, -SHELF.DEP / 2 - 0.35]} receiveShadow>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial color="#d9d1c3" roughness={0.95} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, 0]} receiveShadow>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial color="#4b3426" roughness={0.75} />
      </mesh>

      <group ref={cab}>
        <primitive object={cabinet} />
        {CELLS.map((c, i) => {
          const [x] = cellCenter(c)
          return (
            <group key={i} ref={(g) => { holders.current[i] = g }} position={[x, cellFloor(c), 0.05]}>
              {items[i] ? <primitive object={items[i]!} /> : (
                <Suspense fallback={null}><GltfFit url={models[i]!} w={c.w} h={c.h} /></Suspense>
              )}
            </group>
          )
        })}
        {/* invisible panes over each compartment catch hover and clicks */}
        {CELLS.map((c, i) => {
          const [x, y] = cellCenter(c)
          return (
            <mesh key={'hit' + i} position={[x, y, SHELF.DEP / 2]}
              onPointerOver={(e) => { e.stopPropagation(); setHover(i); gl.domElement.style.cursor = c.route ? 'pointer' : 'default' }}
              onPointerOut={() => { setHover(null); gl.domElement.style.cursor = '' }}
              onClick={(e) => { e.stopPropagation(); if (c.route) onSelect(c.route) }}>
              <planeGeometry args={[c.w - SHELF.T, c.h - SHELF.T]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          )
        })}
      </group>
    </>
  )
}
