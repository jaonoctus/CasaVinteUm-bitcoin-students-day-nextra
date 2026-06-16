'use client'

import { useState, type FormEvent } from 'react'
import { Pre, Code } from 'nextra/components'

export function GetDescriptor() {
  const [email, setEmail] = useState('')
  const [descriptor, setDescriptor] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || loading) {
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/descriptor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = (await res.json()) as { descriptor?: string; error?: string }
      if (!res.ok || !data.descriptor) {
        setError(data.error ?? 'Algo deu errado. Tente novamente.')
        return
      }
      setDescriptor(data.descriptor)
    } catch {
      setError('Não foi possível obter o descriptor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (descriptor) {
    return (
      <Pre data-copy="" className="mt-4 p-4">
        <Code>{descriptor}</Code>
      </Pre>
    )
  }

  return (
    <form className="mt-4 flex max-w-md flex-col gap-2" onSubmit={onSubmit}>
      <label className="font-semibold" htmlFor="bsd-email">
        Email
      </label>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Digite seu e-mail para ver o seu descriptor que será usado no workshop:
      </p>
      <input
        id="bsd-email"
        type="email"
        placeholder="Digite seu e-mail aqui"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-bitcoin focus:ring-2 focus:ring-bitcoin/30 dark:border-neutral-700"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-md bg-bitcoin px-5 py-2 font-semibold text-black transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Carregando…' : 'Ok'}
      </button>
    </form>
  )
}
