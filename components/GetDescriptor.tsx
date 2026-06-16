'use client'

import { useState, type FormEvent } from 'react'
import { Pre, Code } from 'nextra/components'
import { descriptors } from './descriptors'

export function GetDescriptor() {
  const [email, setEmail] = useState('')
  const [descriptor, setDescriptor] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email) {
      return
    }
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(email)
    )
    const dataView = new DataView(digest.slice(-8))
    const randomValue = dataView.getBigUint64(0, true)
    const index = Number(randomValue % BigInt(descriptors.length))
    setDescriptor(descriptors[index])
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
      <button
        type="submit"
        className="self-start rounded-md bg-bitcoin px-5 py-2 font-semibold text-black transition-colors hover:opacity-90"
      >
        Ok
      </button>
    </form>
  )
}
