import Link from 'next/link'
import type { ReactNode } from 'react'

export function FeatureCards({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">{children}</div>
  )
}

export function FeatureCard({
  icon,
  title,
  byline,
  href,
  children
}: {
  icon: ReactNode
  title: string
  byline?: string
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-bitcoin dark:border-neutral-800 dark:bg-neutral-900"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-lg bg-bitcoin/10 text-2xl text-bitcoin">
        {icon}
      </span>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      {byline && (
        <p className="mt-1 text-sm font-medium text-bitcoin">{byline}</p>
      )}
      <div className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </Link>
  )
}
