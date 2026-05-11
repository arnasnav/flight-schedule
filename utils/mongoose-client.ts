import mongoose from "mongoose"
import dns from "node:dns/promises"

dns.setServers(["1.1.1.1", "8.8.8.8"])

const MONGO_URI = process.env.MONGO_URI!
const MONGO_DB = process.env.MONGO_DB!

type MongooseCache = {
  conn?: typeof mongoose
  promise?: Promise<typeof mongoose>
}

declare global {
  var __mongooseCache: MongooseCache | undefined
}

const cache = globalThis.__mongooseCache ?? (globalThis.__mongooseCache = {})

export async function connectMongoose() {
  if (!MONGO_URI) throw new Error("Missing MONGO_URI")
  if (!MONGO_DB) throw new Error("Missing MONGO_DB")

  if (cache.conn) return cache.conn

  if (!cache.promise) {
    const connectionString = MONGO_URI.includes("?")
      ? MONGO_URI
      : `${MONGO_URI}/${MONGO_DB}`

    cache.promise = mongoose.connect(connectionString, {
      bufferCommands: false,
      dbName: MONGO_DB,
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}
