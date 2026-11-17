import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Color, MeshStandardMaterial, Vector3, type DirectionalLight, type Fog, type HemisphereLight, type PerspectiveCamera, type PointLight } from 'three'
import { reducedMotion } from '../lib/util'
import { useStore } from '../store'
import { frameFor, LIGHT, OBJECTS } from './layout'
import { Basin, Border, Lantern, Stone, type PickHandlers } from './objects'
import { createGrain, createSand, PLANE_H, PLANE_W } from './sand'

/** What the camera looks at: a route of a garden object, or one of the named views. */
export type Focus = string

type Props = { focus: Focus; sheetOpen: boolean; narrow: boolean; onSelect: (route: string) => void }
type SceneProps = Props & { labels: RefObject<Record<string, HTMLButtonElement | null>>; setHover: (route: string | null) => void }

export default function Garden(props: Props) {
  const labels = useRef<Record<string, HTMLButtonElement | null>>({})
  const [hover, setHover] = useState<string | null>(null)
  return (
    <div className="gl">
      <Canvas shadows dpr={[1, 2]} gl={{ toneMappingExposure: 1 }} camera={{ fov: 35, position: [0, 23, 23], near: 0.1, far: 200 }}
        frameloop={props.sheetOpen && props.narrow ? 'never' : 'always'}>
        <Scene {...props} labels={labels} setHover={setHover} />
      </Canvas>
      {/* DOM labels, positioned every frame by <Scene> */}
      <div className="labs">
        {OBJECTS.filter((o) => o.route).map((o) => (
          <button key={o.route} type="button" ref={(el) => { labels.current[o.route!] = el }}
            className={'lab' + (o.route === props.focus || o.route === hover ? ' on' : '')} onClick={() => props.onSelect(o.route!)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Scene({ focus, sheetOpen, narrow, onSelect, labels, setHover }: SceneProps) {
  const time = useStore((s) => s.time)
  const rakeNonce = useStore((s) => s.rakeNonce)
  const { gl, size } = useThree()
  const sand = useMemo(() => createSand(OBJECTS), [])
  const grain = useMemo(createGrain, [])

  const firstRake = useRef(true)
  useEffect(() => {
    if (firstRake.current) { firstRake.current = false; return }
    sand.rakeBase()
  }, [rakeNonce, sand])
  useEffect(() => () => { sand.texture.dispose(); grain.dispose() }, [sand, grain])

  // lights, lerped toward the current time of day every frame
  const sun = useRef<DirectionalLight>(null!)
  const hemi = useRef<HemisphereLight>(null!)
  const lamp = useRef<PointLight>(null)
  const glow = useMemo(() => new MeshStandardMaterial({ color: '#2a2620', emissive: '#ffc177', emissiveIntensity: 0 }), [])
  const bg = useRef<Color>(null!)
  const fog = useRef<Fog>(null!)
  const tmp = useMemo(() => ({ c: new Color(), v: new Vector3(), tp: new Vector3(), tl: new Vector3(), camL: new Vector3(0, 0, -1) }), [])
  const still = reducedMotion()

  useFrame((state, dt) => {
    const L = LIGHT[time]
    const k = still ? 1 : 1 - Math.pow(1 - 0.035, dt * 60)
    bg.current.lerp(tmp.c.set(L.bg), k)
    fog.current.color.copy(bg.current)
    sun.current.color.lerp(tmp.c.set(L.sun), k)
    sun.current.intensity += (L.sunI - sun.current.intensity) * k
    sun.current.position.lerp(tmp.v.set(...L.sunPos), k)
    hemi.current.color.lerp(tmp.c.set(L.sky), k)
    hemi.current.groundColor.lerp(tmp.c.set(L.ground), k)
    hemi.current.intensity += (L.hemiI - hemi.current.intensity) * k
    state.gl.toneMappingExposure += (L.exposure - state.gl.toneMappingExposure) * k
    if (lamp.current) {
      const flicker = still ? 1 : 1 + 0.06 * Math.sin(state.clock.elapsedTime * 11) * Math.sin(state.clock.elapsedTime * 3.7)
      const target = L.lamp * flicker
      lamp.current.intensity += (target - lamp.current.intensity) * k
      glow.emissiveIntensity = Math.min(1.6, lamp.current.intensity / 25 + 0.05)
    }

    // camera: fit the framed content into the part of the screen the sheet leaves visible
    const fr = frameFor(focus)
    const cam = state.camera as PerspectiveCamera
    const tanH = Math.tan((cam.fov * Math.PI) / 360) * (size.width / size.height) // tan(horizontal half-FOV)
    const free = 1 - (sheetOpen && !narrow ? Math.min(820, size.width * 0.6) / size.width : 0) // visible fraction of width
    const dist = Math.min(fr.base * 1.8, Math.max(fr.base, fr.halfW / (free * tanH)))
    const shift = (1 - free) * dist * tanH // moves the content into the centre of the free area
    // gentle parallax and drift only on the garden itself; a moving background while reading is unpleasant
    const calm = still || sheetOpen
    const drift = calm ? 0 : Math.sin(state.clock.elapsedTime * 0.12) * 0.9
    const px = calm ? 0 : state.pointer.x * 0.8, py = calm ? 0 : state.pointer.y * 0.6
    tmp.tl.set(fr.center[0] + shift, fr.center[1], fr.center[2])
    tmp.tp.set(tmp.tl.x + fr.dir[0] * dist + px + drift, tmp.tl.y + fr.dir[1] * dist + py, tmp.tl.z + fr.dir[2] * dist)
    const kc = still ? 1 : 1 - Math.pow(1 - 0.045, dt * 60)
    cam.position.lerp(tmp.tp, kc)
    tmp.camL.lerp(tmp.tl, kc)
    cam.lookAt(tmp.camL)
    const d = cam.position.distanceTo(tmp.camL) // keep the fog relative to how far away we are
    fog.current.near = d * 1.05
    fog.current.far = d * 2.2
    state.camera.updateMatrixWorld()

    for (const ob of OBJECTS) {
      const el = ob.route && labels.current[ob.route]
      if (!el) continue
      tmp.v.set(ob.x, (ob.labelY ?? ob.r * 0.75) + 0.6, ob.z).project(state.camera)
      el.style.transform = `translate(${((tmp.v.x + 1) / 2) * size.width}px, ${((1 - tmp.v.y) / 2) * size.height}px) translate(-50%, -100%)`
      el.style.visibility = tmp.v.z < 1 ? 'visible' : 'hidden'
    }
  })

  // raking
  const raking = useRef(false)
  const rakeDown = (e: ThreeEvent<PointerEvent>) => {
    if (!e.uv) return
    raking.current = true
    sand.rakeStart(sand.uvToCanvas(e.uv.x, e.uv.y))
    ;(e.target as unknown as Element).setPointerCapture(e.pointerId)
  }
  const rakeMove = (e: ThreeEvent<PointerEvent>) => {
    if (raking.current && e.uv) sand.rakeMove(sand.uvToCanvas(e.uv.x, e.uv.y))
  }
  const rakeUp = () => {
    if (!raking.current) return
    raking.current = false
    sand.rakeEnd()
  }

  const pick = (route?: string): PickHandlers =>
    route
      ? {
          onPointerDown: (e) => { e.stopPropagation(); onSelect(route) },
          onPointerOver: (e) => { e.stopPropagation(); setHover(route); gl.domElement.style.cursor = 'pointer' },
          onPointerOut: () => { setHover(null); gl.domElement.style.cursor = '' },
        }
      : {}

  const L0 = LIGHT[time]
  return (
    <>
      <color ref={bg} attach="background" args={[L0.bg]} />
      <fog ref={fog} attach="fog" args={[L0.bg, 34, 70]} />
      <hemisphereLight ref={hemi} args={[L0.sky, L0.ground, L0.hemiI]} />
      <directionalLight ref={sun} position={L0.sunPos} color={L0.sun} intensity={L0.sunI} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} shadow-normalBias={0.04}
        shadow-camera-left={-26} shadow-camera-right={26} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-camera-near={1} shadow-camera-far={90} />

      <mesh rotation-x={-Math.PI / 2} receiveShadow onPointerDown={rakeDown} onPointerMove={rakeMove} onPointerUp={rakeUp} onPointerCancel={rakeUp}>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        {/* the height canvas drives both the ridges (bump) and the shade in their grooves (ambient occlusion) */}
        <meshStandardMaterial map={grain} roughness={0.95} metalness={0} bumpMap={sand.texture} bumpScale={3}
          aoMap={sand.texture} aoMapIntensity={0.45} />
      </mesh>
      <Border />

      {OBJECTS.map((o, i) =>
        o.kind === 'lantern' ? <Lantern key={i} o={o} pick={pick(o.route)} glow={glow} lamp={lamp} />
        : o.kind === 'basin' ? <Basin key={i} o={o} pick={pick(o.route)} />
        : <Stone key={i} o={o} i={i} pick={pick(o.route)} />,
      )}
    </>
  )
}
