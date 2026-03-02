"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"

export default function Globe() {
  const globeRef = useRef<THREE.Mesh>(null!)

  const [colorMap, normalMap, specularMap] = useTexture([
    "/textures/2k_earth_daymap.jpg",
    "/textures/2k_earth_normal_map.jpg",
    "/textures/2k_earth_specular_map.jpg",
  ])

  useFrame(({ clock }) => {
    globeRef.current.rotation.y = clock.getElapsedTime() * 0.05
  })

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <meshPhongMaterial
        map={colorMap}
        normalMap={normalMap}
        specularMap={specularMap}
        shininess={15}
      />
    </mesh>
  )
}