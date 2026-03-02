"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

type Props = {
  onReady?: (points: THREE.Vector3[]) => void
}

export default function DigitalContinents({ onReady }: Props) {
  const ref = useRef<THREE.Points>(null!)
  const [positions, setPositions] = useState<Float32Array | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = "/textures/earth-mask1.jpg"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data

      const raw: number[] = []
      const vecPoints: THREE.Vector3[] = []
      const step = 4
      const radius = 1.22

      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          const index = (y * img.width + x) * 4
          const brightness = data[index]

          if (brightness > 200) {
            const u = x / img.width
            const v = y / img.height

            const theta = (0.5 - u) * Math.PI * 2
            const phi = (0.5 - v) * Math.PI

            const px = radius * Math.cos(phi) * Math.cos(theta)
            const py = radius * Math.sin(phi)
            const pz = radius * Math.cos(phi) * Math.sin(theta)

            raw.push(px, py, pz)
            vecPoints.push(new THREE.Vector3(px, py, pz))
          }
        }
      }

      setPositions(new Float32Array(raw))
      onReady?.(vecPoints)
    }
  }, [onReady])

  if (!positions) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#8338f9"
        depthTest
        depthWrite={false}
      />
    </points>
  )
}