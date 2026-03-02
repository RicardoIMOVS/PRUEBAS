"use client"

import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import * as THREE from "three"

type Props = {
  radius?: number
}

export default function RealisticEarth({ radius = 1.2 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null!)

  const [dayMap, specMap, normalMap, nightMap] = useLoader(TextureLoader, [
    "/textures/8k_earth_daymap.jpg",
    "/textures/8k_earth_specular_map.jpg",
    "/textures/8k_earth_normal_map.jpg",
    "/textures/8k_earth_nightmap.jpg",
  ])

  // Color correcto (importante)
  dayMap.colorSpace = THREE.SRGBColorSpace
  nightMap.colorSpace = THREE.SRGBColorSpace

    // Ajustes de calidad
    ;[dayMap, specMap, normalMap, nightMap].forEach((t) => {
      t.anisotropy = 8
      t.wrapS = THREE.ClampToEdgeWrapping
      t.wrapT = THREE.ClampToEdgeWrapping
    })

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.06
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 128, 128]} />

      <meshPhongMaterial
        map={dayMap}
        specularMap={specMap}
        specular={new THREE.Color("#6aa9ff")}
        shininess={20}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        emissiveMap={nightMap}
        emissive={new THREE.Color("#ffffff")}
        emissiveIntensity={1.5}
      />
    </mesh>
  )
}