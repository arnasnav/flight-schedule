import {
  fetchGtfsDataset,
  findBestLeg,
  normalizeText,
} from "@/services/gtfs-service"
import type {
  ChainStatus,
  IFlightOption,
  ITravelChainResult,
} from "@/types/travel-chain"

export type {
  ChainStatus,
  IFlightOption,
  IRouteLeg,
  ITravelChainResult,
} from "@/types/travel-chain"

async function fetchFlights(): Promise<IFlightOption[]> {
  const key = process.env.AVIATIONSTACK_API_KEY
  const res = await fetch(
    `https://api.aviationstack.com/v1/flights?access_key=${key}&dep_iata=VNO`,
    { cache: "no-store" }
  )
  const payload = await res.json()
  const now = new Date()
  const minTime = new Date(now.getTime() + 3 * 60 * 60 * 1000)
  return (payload.data || [])
    .map((f: Record<string, unknown>) => {
      const flight = f.flight as Record<string, string> | undefined
      const departure = f.departure as Record<string, string> | undefined
      const airline = f.airline as Record<string, string> | undefined
      const arrival = f.arrival as Record<string, string> | undefined
      return {
        flightIata:
          flight?.iata ||
          `VNO-${new Date(departure?.scheduled ?? 0).getTime()}`,
        departureTime: new Date(departure?.scheduled ?? ""),
        airline: airline?.name ?? "",
        destinationIata: arrival?.iata ?? "",
      }
    })
    .filter(
      (f: IFlightOption) =>
        !Number.isNaN(f.departureTime.getTime()) && f.departureTime > minTime
    )
    .sort(
      (a: IFlightOption, b: IFlightOption) =>
        a.departureTime.getTime() - b.departureTime.getTime()
    )
}

export async function buildTravelChain(
  iata?: string
): Promise<ITravelChainResult> {
  const [intercity, vilnius, flights] = await Promise.all([
    fetchGtfsDataset("https://www.visimarsrutai.lt/gtfs/google_transit.zip"),
    fetchGtfsDataset("https://stops.lt/vilnius/vilnius/gtfs.zip"),
    fetchFlights(),
  ])
  const now = new Date()
  const leg1 = findBestLeg(
    intercity,
    (n) => normalizeText(n).includes("panevez"),
    (n) =>
      normalizeText(n).includes("vilniaus") &&
      normalizeText(n).includes("stotis"),
    now
  )
  if (!leg1) throw new Error("No bus")
  const leg2 = findBestLeg(
    vilnius,
    (n) => normalizeText(n).includes("stotis"),
    (n) => normalizeText(n).includes("oro uostas"),
    new Date(leg1.arrivalTime.getTime() + 600000)
  )
  if (!leg2) throw new Error("No city bus")

  let flight =
    flights.find((f) => f.flightIata === iata) ||
    flights.find(
      (f) => f.departureTime.getTime() > leg2.arrivalTime.getTime() + 7200000
    ) ||
    flights[0]
  if (!flight) throw new Error("No flights")

  const reserve = Math.floor(
    (flight.departureTime.getTime() - leg2.arrivalTime.getTime()) / 60000
  )
  const status: ChainStatus =
    reserve >= 120 ? "speja" : reserve >= 90 ? "rizikinga" : "nespeja"
  const labels = { speja: "spėja", rizikinga: "rizikinga", nespeja: "nespėja" }

  return {
    intercityLeg: leg1,
    cityLeg: leg2,
    selectedFlight: flight,
    reserveMinutes: reserve,
    status,
    statusLabel: labels[status],
  }
}

export async function getVnoDepartures() {
  const f = await fetchFlights()
  return f.map((x) => ({ ...x, departureTime: x.departureTime.toISOString() }))
}
