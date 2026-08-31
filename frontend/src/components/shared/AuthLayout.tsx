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
    <div className="grid h-dvh w-full overflow-hidden bg-white lg:grid-cols-2">
      {imageSide === "left" && image}
      <main className="relative flex h-full min-h-0 flex-col">
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
        <div className="relative flex w-full max-w-sm flex-1 flex-col self-center px-4 py-4 sm:py-6">
          <div className="relative -mx-4 flex-1 min-h-0 overflow-y-auto px-4 pb-2">
            <div className={cn("flex min-h-full flex-col justify-center")}>
              {children}
            </div>
          </div>
        </div>
      </main>
      {imageSide === "right" && image}
    </div>
  )
}
