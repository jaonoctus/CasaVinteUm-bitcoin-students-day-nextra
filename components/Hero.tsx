import Link from 'next/link'
import type { ReactNode } from 'react'

export function Hero({
  title,
  subtitle,
  description,
  ctaHref,
  ctaLabel
}: {
  title: string
  subtitle?: string
  description: ReactNode
  ctaHref: string
  ctaLabel: string
}) {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
        {title}
        {subtitle && (
          <span className="mt-3 block text-2xl font-medium text-bitcoin sm:text-3xl">
            {subtitle}
          </span>
        )}
      </h1>
      <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
        {description}
      </p>
      <Link
        href={ctaHref}
        className="group inline-flex items-center gap-2 rounded-xl bg-bitcoin px-7 py-3.5 text-lg font-semibold text-black transition-transform hover:-translate-y-0.5"
      >
        {ctaLabel}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  )
}
