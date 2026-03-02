"use client"

import * as THREE from "three"

export default function GridSphere() {
  const geometry = new THREE.SphereGeometry(1.21, 32, 32)

  return (
    <lineSegments>
      <edgesGeometry args={[geometry]} />
      <lineBasicMaterial color="#1f0e3c" />
    </lineSegments>
  )
}