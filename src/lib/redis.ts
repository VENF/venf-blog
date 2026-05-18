import { Redis } from 'ioredis'

let client: Redis | null = null

function getRedisClient(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null

  return new Redis(url, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  })
}

export async function getCache() {
  if (!client) {
    client = getRedisClient()
  }

  return {
    async get(key: string): Promise<string | null> {
      if (!client) return null
      return client.get(key)
    },

    async set(key: string, value: string, ttlSeconds?: number) {
      if (!client) return
      if (ttlSeconds) {
        await client.setex(key, ttlSeconds, value)
      } else {
        await client.set(key, value)
      }
    },

    async del(key: string) {
      if (!client) return
      await client.del(key)
    },
  }
}

export async function closeCache() {
  if (client) {
    await client.quit()
    client = null
  }
}
