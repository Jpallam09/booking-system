import type { ReactNode } from "react"
import { CalendarHeart, Star } from "lucide-react"

import formImage from "@/assets/form.jpg"

export function AuthLayout({
  children,
  imageSide = "left",
}: {
  children: ReactNode
  imageSide?: "left" | "right"
}) {
  const image = (
    <section className="relative hidden overflow-hidden bg-primary lg:block">
      <img
        src={formImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-10">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center bg-gradient-to-tr from-teal-500 to-cyan-500 text-white">
            <CalendarHeart className="size-5" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white">
            Lumina Dental
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="max-w-md font-display text-2xl leading-tight font-bold tracking-tight text-balance text-white lg:text-3xl">
            Modern dental care, booked in seconds.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/80">
            Browse services, choose a time, and manage your visits — all
            online.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-white/80">
          <Star className="size-4 fill-teal-300 text-teal-300" />
          <span className="font-medium text-white">4.9</span>
          <span className="text-white/70">Average patient rating</span>
        </div>
      </div>
    </section>
  )

  return (
    <div className="grid h-dvh w-full overflow-hidden bg-white lg:grid-cols-2">
      {imageSide === "left" && image}
      <main
        className="relative h-full overflow-y-auto"
        style={{
          backgroundImage: `
            radial-gradient(circle 500px at 50% 100%, rgba(139,92,246,0.3), transparent),
            radial-gradient(circle 500px at 100% 80%, rgba(59,130,246,0.3), transparent)
          `,
        }}
      >
        <div className="mx-auto flex min-h-full w-full max-w-sm flex-col px-4 py-10">
          <div className="my-auto flex w-full flex-col">{children}</div>
        </div>
      </main>
      {imageSide === "right" && image}
    </div>
  )
}
