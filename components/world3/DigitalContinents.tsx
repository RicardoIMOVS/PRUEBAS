"use client"

import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function DigitalContinents() {
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

      const points: number[] = []

      // 🔹 Controla precisión aquí (menor = más detalle)
      const step = 4

      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {

          const index = (y * img.width + x) * 4
          const brightness = data[index] // rojo (imagen B/N)

          // Solo puntos donde sea blanco
          if (brightness > 200) {

            const u = x / img.width
            const v = y / img.height

            // 🔥 Conversión equirectangular correcta
            const theta = (0.5 - u) * Math.PI * 2
            const phi = (0.5 - v) * Math.PI

            const radius = 1.22

            const px = radius * Math.cos(phi) * Math.cos(theta)
            const py = radius * Math.sin(phi)
            const pz = radius * Math.cos(phi) * Math.sin(theta)

            points.push(px, py, pz)
          }
        }
      }

      setPositions(new Float32Array(points))
    }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.1
  })

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