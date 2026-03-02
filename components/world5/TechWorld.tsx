"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

import StarField from "./StarField"
import DigitalGlobe from "./DigitalGlobe"
import DigitalContinents from "./DigitalContinents"
import GridSphere from "./GridSphere"
import ConnectionLines from "./ConnectionLines"

function WorldGroup() {
  const worldRef = useRef<THREE.Group>(null!)
  const [continentPoints, setContinentPoints] = useState<THREE.Vector3[]>([])

  useFrame(() => {
    if (!worldRef.current) return
    worldRef.current.rotation.y += 0.002
  })

  return (
    <group ref={worldRef} scale={0.95}>
      <DigitalGlobe />
      <DigitalContinents onReady={setContinentPoints} />
      <GridSphere />
      <ConnectionLines continentPoints={continentPoints} />
    </group>
  )
}

export default function TechWorld() {
  return (
    <section className="relative w-full bg-black">

      <div className="text-center py-16">
        <h2 className="text-[#8338f9] text-5xl font-semibold tracking-tight">
          Conexiones Dinámicas Globales
        </h2>
      </div>

      <div className="relative w-full h-175">

        {/* Glow externo suave */}
        <div className="absolute inset-0 bg-[#8338f9] blur-3xl opacity-20 rounded-full" />

        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>

            <StarField />
            <ambientLight intensity={0.4} />

            <WorldGroup />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              enableDamping
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
            />

          </Suspense>
        </Canvas>
      </div>

    </section>
  )
}