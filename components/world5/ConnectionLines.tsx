"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"

type Props = {
  continentPoints: THREE.Vector3[]
}

function AnimatedArc({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  const lineRef = useRef<any>(null)
  const startNode = useRef<THREE.Mesh>(null!)
  const endNode = useRef<THREE.Mesh>(null!)

  const progress = useRef(Math.random())
  const speed = useRef(0.0015 + Math.random() * 0.0015)

  const curve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5)
    mid.normalize().multiplyScalar(2.2)
    return new THREE.QuadraticBezierCurve3(start, mid, end)
  }, [start, end])

  const baked = useMemo(() => {
    return curve.getPoints(120)
  }, [curve])

  useFrame(({ clock }) => {
    progress.current += speed.current
    if (progress.current > 1) progress.current = 0

    const trailSize = 0.18

    const total = baked.length
    const endIndex = Math.floor(progress.current * total)
    const startIndex = Math.max(0, endIndex - Math.floor(trailSize * total))

    if (lineRef.current?.geometry) {
      lineRef.current.geometry.setDrawRange(startIndex, endIndex - startIndex)
    }

    // pulso suave en nodos
    const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.15
    startNode.current.scale.setScalar(pulse)
    endNode.current.scale.setScalar(pulse)
  })

  return (
    <group>
      <Line
        ref={lineRef}
        points={baked}
        color="#22d3ee"
        transparent
        opacity={1}
        depthWrite={false}
        lineWidth={1.5}
        blending={THREE.AdditiveBlending}
      />

      <mesh ref={startNode} position={start}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial
          color="#60a5fa"
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={endNode} position={end}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial
          color="#60a5fa"
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default function ConnectionLines({ continentPoints }: Props) {
  const arcs = useMemo(() => {
    if (!continentPoints.length) return []

    const list: { start: THREE.Vector3; end: THREE.Vector3 }[] = []

    for (let i = 0; i < 18; i++) {
      let start: THREE.Vector3
      let end: THREE.Vector3

      let tries = 0
      do {
        start =
          continentPoints[Math.floor(Math.random() * continentPoints.length)]
        end =
          continentPoints[Math.floor(Math.random() * continentPoints.length)]
        tries++
      } while (start.distanceTo(end) < 0.9 && tries < 50)

      list.push({ start, end })
    }

    return list
  }, [continentPoints])

  return (
    <group>
      {arcs.map((arc, i) => (
        <AnimatedArc key={i} start={arc.start} end={arc.end} />
      ))}
    </group>
  )
}