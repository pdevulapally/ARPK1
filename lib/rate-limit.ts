type RateLimitResult = { allowed: boolean; remaining: number; resetSeconds: number }

export class RateLimiter {
  private windowSeconds: number
  private maxRequests: number
  private prefix: string
  private memoryStore: Map<string, { count: number; resetAt: number }> = new Map()

  constructor(options: { windowSeconds: number; maxRequests: number; prefix?: string }) {
    this.windowSeconds = options.windowSeconds
    this.maxRequests = options.maxRequests
    this.prefix = options.prefix || "rl"
  }

  private getUpstash(): { url: string; token: string } | null {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (url && token) return { url, token }
    return null
  }

  async check(key: string): Promise<RateLimitResult> {
    const upstash = this.getUpstash()
    const now = Math.floor(Date.now() / 1000)
    const bucketKey = `${this.prefix}:${key}:${Math.floor(now / this.windowSeconds)}`

    if (upstash) {
      // Use a simple INCR with EXPIRE pattern
      const res = await fetch(`${upstash.url}/INCR/${encodeURIComponent(bucketKey)}`, {
        headers: { Authorization: `Bearer ${upstash.token}` },
        cache: "no-store",
      })
      const value = (await res.json()) as { result: number }
      if (value.result === 1) {
        await fetch(`${upstash.url}/EXPIRE/${encodeURIComponent(bucketKey)}/${this.windowSeconds}`, {
          headers: { Authorization: `Bearer ${upstash.token}` },
        })
      }
      const remaining = Math.max(0, this.maxRequests - value.result)
      return { allowed: value.result <= this.maxRequests, remaining, resetSeconds: this.windowSeconds - (now % this.windowSeconds) }
    }

    // In-memory fallback (per instance)
    const existing = this.memoryStore.get(bucketKey)
    if (!existing) {
      this.memoryStore.set(bucketKey, { count: 1, resetAt: now + this.windowSeconds })
      return { allowed: true, remaining: this.maxRequests - 1, resetSeconds: this.windowSeconds }
    }

    existing.count += 1
    const allowed = existing.count <= this.maxRequests
    const remaining = Math.max(0, this.maxRequests - existing.count)
    return { allowed, remaining, resetSeconds: Math.max(1, existing.resetAt - now) }
  }
}