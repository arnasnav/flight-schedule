import { extractZipEntry } from "@/utils/extract-zip-entry"
import type { IRouteLeg } from "@/types/travel-chain"

type GtfsStop = { stop_id: string; stop_name: string }
type GtfsStopTime = {
  trip_id: string
  arrival_time: string
  departure_time: string
  stop_id: string
  stop_sequence: string
}
type GtfsTrip = { trip_id: string; route_id: string }
type GtfsRoute = {
  route_id: string
  route_short_name?: string
  route_long_name?: string
}

type GtfsDataset = {
  stops: GtfsStop[]
  stopTimesByTrip: Map<string, GtfsStopTime[]>
  tripsById: Map<string, GtfsTrip>
  routesById: Map<string, GtfsRoute>
}

export function normalizeText(value: string): string {
  const map: Record<string, string> = {
    ą: "a",
    č: "c",
    ę: "e",
    ė: "e",
    į: "i",
    š: "s",
    ų: "u",
    ū: "u",
    ž: "z",
  }
  return value
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (m) => map[m] ?? m)
    .replace(/\s+/g, " ")
    .trim()
}

function parseCsv<T>(content: string): T[] {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []
  const firstLine = lines[0] as string
  const headers = firstLine.split(",").map((h) =>
    h
      .trim()
      .replace(/^\uFEFF/, "")
      .toLowerCase()
  )
  return lines.slice(1).map((line) => {
    const values = line.split(",")
    const entry: Record<string, string> = {}
    headers.forEach((h, i) => {
      if (h) entry[h] = values[i]?.trim() ?? ""
    })
    return entry as T
  })
}

export async function fetchGtfsDataset(url: string): Promise<GtfsDataset> {
  const res = await fetch(url, { cache: "no-store" })
  const buf = Buffer.from(await res.arrayBuffer())
  const stops = parseCsv<GtfsStop>(extractZipEntry(buf, "stops.txt"))
  const stopTimes = parseCsv<GtfsStopTime>(
    extractZipEntry(buf, "stop_times.txt")
  )
  const trips = parseCsv<GtfsTrip>(extractZipEntry(buf, "trips.txt"))
  const routes = parseCsv<GtfsRoute>(extractZipEntry(buf, "routes.txt"))
  const stopTimesByTrip = new Map<string, GtfsStopTime[]>()
  for (const st of stopTimes) {
    const list = stopTimesByTrip.get(st.trip_id) ?? []
    list.push(st)
    stopTimesByTrip.set(st.trip_id, list)
  }
  return {
    stops,
    stopTimesByTrip,
    tripsById: new Map(trips.map((t) => [t.trip_id, t])),
    routesById: new Map(routes.map((r) => [r.route_id, r])),
  }
}

export function findBestLeg(
  dataset: GtfsDataset,
  fromM: (n: string) => boolean,
  toM: (n: string) => boolean,
  earliest: Date
): IRouteLeg | null {
  const fromIds = new Set(
    dataset.stops.filter((s) => fromM(s.stop_name)).map((s) => s.stop_id)
  )
  const toIds = new Set(
    dataset.stops.filter((s) => toM(s.stop_name)).map((s) => s.stop_id)
  )
  let best: IRouteLeg | null = null
  for (const [tripId, stTimes] of dataset.stopTimesByTrip.entries()) {
    const sorted = [...stTimes].sort(
      (a, b) => Number(a.stop_sequence) - Number(b.stop_sequence)
    )
    let start: GtfsStopTime | null = null
    for (const st of sorted) {
      if (!start && fromIds.has(st.stop_id)) {
        start = st
        continue
      }
      if (start && toIds.has(st.stop_id)) {
        const [h, m, s] = start.departure_time.split(":").map(Number)
        const dep = new Date(earliest)
        dep.setHours(h || 0, m || 0, s || 0, 0)
        const [ah, am, as] = st.arrival_time.split(":").map(Number)
        const arr = new Date(earliest)
        arr.setHours(ah || 0, am || 0, as || 0, 0)
        if (dep >= earliest && (!best || dep < best.departureTime)) {
          const trip = dataset.tripsById.get(tripId)
          const route = trip ? dataset.routesById.get(trip.route_id) : null
          best = {
            tripId,
            fromStopId: start.stop_id,
            toStopId: st.stop_id,
            fromStopName:
              dataset.stops.find((s) => s.stop_id === start?.stop_id)
                ?.stop_name || "",
            toStopName:
              dataset.stops.find((s) => s.stop_id === st.stop_id)?.stop_name ||
              "",
            departureTime: dep,
            arrivalTime: arr,
            routeName:
              route?.route_short_name || route?.route_long_name || "Autobusas",
          }
        }
        break
      }
    }
  }
  return best
}
