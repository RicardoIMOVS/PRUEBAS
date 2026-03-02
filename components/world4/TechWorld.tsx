"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { OrbitControls } from "@react-three/drei"

import StarField from "./StarField"
import DigitalGlobe from "./DigitalGlobe"
import DigitalContinents from "./DigitalContinents"
import GridSphere from "./GridSphere"

export default function TechWorld() {
  return (
    <section className="relative w-full bg-black bg-linear-to-b from-black via-neutral-950 to-black">

      {/* Texto */}
      <div className="text-center py-16">
        <h2 className="text-[#8338f9] text-5xl font-semibold tracking-tight">
          Particulas y Planeta Digital en Movimiento
        </h2>
        <p className="text-neutral-400 mt-4 text-lg">
          Un mundo digital 3D interactivo y giratorio futurista, con particulas flotantes y con un suave resplandor púrpura.
        </p>
      </div>

      {/* Canvas FULL WIDTH */}
      <div className="relative w-full h-175 aspect-square">

        {/* Glow externo suave */}
        <div className="absolute inset-0 bg-[#8338f9] blur-3xl opacity-20 rounded-full" />

        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>

            {/* 🌌 Fondo galaxia ocupa todo */}
            <StarField />

            <ambientLight intensity={0.4} />

            {/* 🌍 Mundo centrado */}
            <group position={[0, 0, 0]} scale={0.95}>
              <DigitalGlobe />
              <DigitalContinents />
              <GridSphere />
            </group>

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.4}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
              enableDamping
              dampingFactor={0.05}
            />

          </Suspense>
        </Canvas>
      </div>

    </section>
  )
}