"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function DigitalGlobe() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <meshBasicMaterial color="#050505" />
    </mesh>
  )
}