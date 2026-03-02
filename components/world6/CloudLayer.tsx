"use client"

import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export default function CloudLayer() {
  const clouds = useLoader(TextureLoader, "/textures/8k_earth_clouds.jpg")
  const ref = useRef<THREE.Mesh>(null!)

  clouds.colorSpace = THREE.SRGBColorSpace

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.06
  })

  return (
    <mesh ref={ref} scale={1.01}>
      <sphereGeometry args={[1.21, 128, 128]} />
      <meshPhongMaterial
        map={clouds}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </mesh>
  )
}