import { createHash } from 'node:crypto'
import { Redis } from '@upstash/redis'
import { descriptors } from '../../../components/descriptors'

const redis = Redis.fromEnv()

const COUNTER_KEY = 'bsd:descriptor:counter'

// Key on a hash of the email, never the email itself — we don't want to store
// PII in Redis. The value (a descriptor index) is not personal data.
const emailKey = (email: string) =>
  `bsd:descriptor:email:${createHash('sha256').update(email).digest('hex')}`

// Assignments expire one week after they are handed out.
const TTL_SECONDS = 60 * 60 * 24 * 7

// Atomically assign a unique descriptor index to an email.
//   - If the email was already assigned, return its existing index.
//   - Otherwise take the next free slot via INCR and remember it for a week.
//   - Return -1 when every descriptor has been handed out.
// Running this as a single Lua script keeps the whole assignment atomic, so
// two participants can never receive the same descriptor (the birthday-paradox
// collision the previous `hash(email) % length` approach suffered from).
// The counter's TTL is refreshed on every new assignment so it always outlives
// the email keys it produced — otherwise it could expire and reset while a
// mapping is still alive, handing the same slot to someone else.
const ASSIGN_SCRIPT = `
local existing = redis.call('GET', KEYS[1])
if existing then
  return tonumber(existing)
end
local slot = redis.call('INCR', KEYS[2])
if slot > tonumber(ARGV[1]) then
  redis.call('DECR', KEYS[2])
  return -1
end
local index = slot - 1
redis.call('SET', KEYS[1], index, 'EX', ${TTL_SECONDS})
redis.call('EXPIRE', KEYS[2], ${TTL_SECONDS})
return index
`

export async function POST(request: Request) {
  let email: string
  try {
    const body = (await request.json()) as { email?: unknown }
    email = String(body.email ?? '')
      .trim()
      .toLowerCase()
  } catch {
    return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  let index: number
  try {
    index = (await redis.eval(
      ASSIGN_SCRIPT,
      [emailKey(email), COUNTER_KEY],
      [descriptors.length]
    )) as number
  } catch {
    return Response.json(
      { error: 'Não foi possível obter o descriptor. Tente novamente.' },
      { status: 502 }
    )
  }

  if (index < 0) {
    return Response.json(
      { error: 'Todos os descriptors já foram distribuídos.' },
      { status: 409 }
    )
  }

  return Response.json({ descriptor: descriptors[index] })
}
