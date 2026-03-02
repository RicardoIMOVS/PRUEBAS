"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { OrbitControls } from "@react-three/drei"

import DigitalGlobe from "./DigitalGlobe"
import GridSphere from "./GridSphere"
import ContinentLines from "./DigitalContinents"

export default function TechWorld() {
  return (
    <section className="relative w-full bg-black bg-linear-to-b from-black via-neutral-950 to-black">

      {/* Texto superior */}
      <div className="text-center my-16">
        <h2 className="text-[#8338f9] text-5xl font-semibold tracking-tight">
          Planeta Digital en Movimiento
        </h2>
        <p className="text-neutral-400 mt-4 text-lg">
          Un mundo digital 3D interactivo y giratorio futurista, con un suave resplandor púrpura.
        </p>
      </div>

      {/* Contenedor del mundo */}
      <div className="relative w-full h-175 aspect-square">

        {/* Glow externo suave */}
        <div className="absolute inset-0 bg-[#8338f9] blur-3xl opacity-20 rounded-full" />

        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>

            {/* Luz ambiental ligera */}
            <ambientLight intensity={0.4} />

            {/* Globo base */}
            <DigitalGlobe />

            {/* Grid tipo radar */}
            <GridSphere />

            {/* Continentes en líneas */}
            <ContinentLines />

            {/* Controles */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.8}
              enableDamping
            />

          </Suspense>
        </Canvas>

      </div>

    </section>
  )
}