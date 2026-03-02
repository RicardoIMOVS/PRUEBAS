"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Globe from "./Globe"
import FloatingParticles from "./FloatingParticles"
import CameraRig from "./CameraRig"

export default function TechWorld() {
  return (
    <section className="relative h-screen w-full bg-linear-to-b from-black via-neutral-950 to-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 2, 5]} intensity={1.2} />
          <Globe />
          <FloatingParticles />
          <CameraRig />
        </Suspense>
      </Canvas>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-white text-6xl font-semibold tracking-tight">
          Particulas en Movimiento
        </h1>
        <p className="text-neutral-400 mt-4 text-lg">
          Mundo 3D interactivo con partículas flotantes.
        </p>
      </div>
    </section>
  )
}