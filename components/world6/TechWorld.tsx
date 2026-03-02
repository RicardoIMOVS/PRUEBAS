"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { OrbitControls } from "@react-three/drei"

import StarField from "./StarField"
import RealisticEarth from "./RealisticEarth"
import CloudLayer from "./CloudLayer"

export default function TechWorld() {

  return (
    <section className="relative w-full overflow-hidden bg-black py-24">

      <div className="text-center mb-12">
        <h2 className="text-white text-5xl font-semibold">
          Global Network
        </h2>
      </div>

      <div className="relative w-full h-175">

        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>

          <Suspense fallback={null}>

            <StarField />

            {/* Iluminación realista */}
            <ambientLight intensity={0.18} />

            <directionalLight
              position={[5, 3, 5]}
              intensity={1.6}
            />

            <directionalLight
              position={[-4, -2, -4]}
              intensity={0.3}
            />

            <RealisticEarth />
            <CloudLayer />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.25}
              enableDamping
              dampingFactor={0.05}
            />

          </Suspense>

        </Canvas>

      </div>

    </section>
  )
}