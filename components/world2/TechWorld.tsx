"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import Globe from "./Globe"
import FloatingParticles from "./FloatingParticles"

export default function TechWorld() {
  return (
    <section className="relative w-full bg-linear-to-b from-black via-neutral-950 to-black">

      {/* TEXTO */}
      <div className="text-center my-16">
        <h2 className="text-white text-5xl font-semibold tracking-tight">
          Paticulas y Planeta en Movimiento
        </h2>
        <p className="text-neutral-400 mt-4 text-lg">
          Un mundo 3D interactivo con partículas flotantes y un planeta giratorio.
        </p>
      </div>

      {/* CONTENEDOR DEL PLANETA */}
      <div className="relative w-full h-175 aspect-square">

        {/* Glow suave detrás (premium minimal) */}
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full" />

        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <Suspense fallback={null}>

            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={1.2} />
            <directionalLight position={[-5, -3, -5]} intensity={0.4} />

            <Globe />
            <FloatingParticles />

            {/* <OrbitControls
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.6}
                dampingFactor={0.05}
                enableDamping
              /> */}

            {/* Con este solo rota el planeta horizontal, limitando la inclinación vetical para mantener una vista más estable y profesional. */}
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