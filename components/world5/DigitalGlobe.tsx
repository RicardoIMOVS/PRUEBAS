"use client"

export default function DigitalGlobe() {
  return (
    <mesh>
      <sphereGeometry args={[1.2, 128, 128]} />
      <meshBasicMaterial color="#050505" />
    </mesh>
  )
}