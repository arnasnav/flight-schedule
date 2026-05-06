import mongoose from "mongoose"

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const MONGO_URI = process.env.MONGO_URI!
const MONGO_DB = process.env.MONGO_DB!

type MongooseCache = {
  conn?: typeof mongoose
  promise?: Promise<typeof mongoose>
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined
}

const cache = globalThis.__mongooseCache ?? (globalThis.__mongooseCache = {})

export async function connectMongoose() {
  if (!MONGO_URI) throw new Error("Missing MONGO_URI")
  if (!MONGO_DB) throw new Error("Missing MONGO_DB")

  if (cache.conn) return cache.conn

  if (!cache.promise) {
    // Check if MONGO_URI already contains query params
    const separator = MONGO_URI.includes("?") ? "&" : "/"
    const connectionString = MONGO_URI.includes("?")
      ? MONGO_URI // URI already has params, use as-is
      : `${MONGO_URI}/${MONGO_DB}`

    cache.promise = mongoose.connect(connectionString, {
      bufferCommands: false,
      dbName: MONGO_DB,
    })
  }

  cache.conn = await cache.promise
  return cache.conn
}