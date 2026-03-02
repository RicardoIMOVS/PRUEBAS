"use client"

import TechWorld from "@/components/world/TechWorld"
import TechWorld2 from "@/components/world2/TechWorld"
import TechWorld3 from "@/components/world3/TechWorld"
import TechWorld4 from "@/components/world4/TechWorld"
import TechWorld5 from "@/components/world5/TechWorld"
import TechWorld6 from "@/components/world6/TechWorld"
import EarthScene from "@/components/earth/EarthScene"
import EarthScene2 from "@/components/earth2/EarthScene"

export default function HomePage() {
  return (
    <main className="w-full">

      {/* Hero normal */}
      <section className="flex items-center justify-center bg-purple-300">
        <h1 className="text-5xl font-bold text-black py-4">
          Ideas Particulas y Mundos en Movimiento
        </h1>
      </section>

      {/* Section Particulas Mundo Grande 3D */}
      <TechWorld />

      {/* Section Mundo Grande Completo 3D */}
      <TechWorld2 />

      {/* Section Mundo Futurista 3D */}
      <TechWorld3 />

      {/* Section Mundo Futurista con Fondo Galactico 3D */}
      <TechWorld4 />

      {/* Section Mundo Futurista con Fondo Galactico 3D y Lineas de Conexión */}
      <TechWorld5 />

      {/* Section Mundo Personalizado con Texturas y con Particulas 3D */}
      <TechWorld6 />

      {/* Section Mundo Tierra 3D CLON */}
      <EarthScene />

      {/* Section Mundo Tierra 3D CLON2 */}
      <EarthScene2 />

    </main>
  )
}