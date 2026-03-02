import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Globe() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.08
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 128, 128]} />
      <meshStandardMaterial
        color="#0f172a"
        roughness={0.6}
        metalness={0.3}
      />
    </mesh>
  )
}