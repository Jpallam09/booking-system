import type { ReactNode } from "react"

import formImage from "@/assets/form.jpg"
import { cn } from "@/lib/utils"

export function AuthLayout({
  children,
  imageSide = "left",
}: {
  children: ReactNode
  imageSide?: "left" | "right"
}) {
  const image = (
    <section
      aria-hidden="true"
      className="relative hidden overflow-hidden bg-primary lg:block"
    >
      <img
        src={formImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </section>
  )

  return (
    <div className="grid min-h-dvh w-full bg-white lg:grid-cols-2">
      {imageSide === "left" && image}
      <main className="relative flex min-h-dvh items-center justify-center px-4 py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle 500px at 50% 100%, rgba(139,92,246,0.3), transparent),
              radial-gradient(circle 500px at 100% 80%, rgba(59,130,246,0.3), transparent)
            `,
          }}
        />
        <div className={cn("relative w-full max-w-sm")}>{children}</div>
      </main>
      {imageSide === "right" && image}
    </div>
  )
}
