"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ISchedule } from "@/models/schedule-model"
import { getApi } from "@/utils/server-api"
import { AirportSelect } from "./parts/airport-select"
import { CompanySelect } from "./parts/company-select"
import { FlightsResultsTable } from "./parts/flights-results-table"
import type { IFlightsProps } from "@/types/props/queries"

export enum FlightFilterType {
  ByCompany = "by-company",
  DepartFromAirport = "depart-from-airport",
  ArriveToAirport = "arrive-to-airport",
}

export function Flights(props: IFlightsProps) {
  const { airports, companies } = props

  const [filterType, setFilterType] = useState<FlightFilterType | "">("")
  const [companyId, setCompanyId] = useState("")
  const [airportId, setAirportId] = useState("")
  const [schedules, setSchedules] = useState<ISchedule[]>([])
  const [hasQueried, setHasQueried] = useState(false)

  const [travelFlights, setTravelFlights] = useState<any[]>([])
  const [selectedTravelFlight, setSelectedTravelFlight] = useState("")
  const [travelResult, setTravelResult] = useState<any | null>(null)
  const [travelError, setTravelError] = useState("")
  const [travelLoading, setTravelLoading] = useState(false)

  const isCompanyFilter = filterType === FlightFilterType.ByCompany
  const companyDisabled = !isCompanyFilter
  const airportDisabled = !filterType || isCompanyFilter

  const clearSchedules = () => {
    setSchedules([])
    setHasQueried(false)
  }

  const fetchSchedules = async (url: string) => {
    const data = await getApi<ISchedule[]>(url)
    setSchedules(data ?? [])
    setHasQueried(true)
  }

  const getAirportUrl = (type: FlightFilterType, id: string) => {
    const encodedId = encodeURIComponent(id)
    return type === FlightFilterType.DepartFromAirport
      ? `/api/flights-from-airport?airportId=${encodedId}`
      : `/api/flights-to-airport?airportId=${encodedId}`
  }

  const handleFilterTypeChange = async (value: string) => {
    const newType = value as FlightFilterType
    setFilterType(newType)

    if (newType === FlightFilterType.ByCompany) {
      setAirportId("")
      if (!companyId) {
        clearSchedules()
      } else {
        await fetchSchedules(
          `/api/flights-by-company?companyId=${encodeURIComponent(companyId)}`
        )
      }
    } else {
      setCompanyId("")
      if (!airportId) {
        clearSchedules()
      } else {
        await fetchSchedules(getAirportUrl(newType, airportId))
      }
    }
  }

  const handleCompanyChange = async (id: string) => {
    setCompanyId(id)
    if (filterType !== FlightFilterType.ByCompany || !id) {
      clearSchedules()
      return
    }
    await fetchSchedules(
      `/api/flights-by-company?companyId=${encodeURIComponent(id)}`
    )
  }

  const handleAirportChange = async (id: string) => {
    setAirportId(id)
    if (!filterType || filterType === FlightFilterType.ByCompany || !id) {
      clearSchedules()
      return
    }
    await fetchSchedules(getAirportUrl(filterType, id))
  }

  const loadTravelFlights = async () => {
    const data = await getApi<any[]>("/api/travel-chain?mode=flights")
    const flights = data ?? []
    setTravelFlights(flights)
    if (flights.length > 0) {
      setSelectedTravelFlight(flights[0].flightIata)
    }
  }

  const handleTravelSearch = async () => {
    setTravelLoading(true)
    setTravelError("")
    setTravelResult(null)

    const query = selectedTravelFlight
      ? `?flightIata=${encodeURIComponent(selectedTravelFlight)}`
      : ""

    try {
      const response = await fetch(`/api/travel-chain${query}`)
      const payload = await response.json()

      if (!response.ok) {
        setTravelError(
          payload?.message || "Nepavyko sudaryti kelionės grandinės."
        )
      } else {
        setTravelResult(payload)
      }
    } catch (err) {
      setTravelError("Įvyko tinklo klaida.")
    } finally {
      setTravelLoading(false)
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("lt-LT")
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Skrydžiai
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skrydžių paieška</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Užklausos tipas
              </p>
              <Select value={filterType} onValueChange={handleFilterTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite tipą" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FlightFilterType.ByCompany}>
                    Skrydžiai pagal kompaniją
                  </SelectItem>
                  <SelectItem value={FlightFilterType.DepartFromAirport}>
                    Išskrendantys iš oro uosto
                  </SelectItem>
                  <SelectItem value={FlightFilterType.ArriveToAirport}>
                    Atskrendantys į oro uostą
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Kompanija
              </p>
              <CompanySelect
                value={companyId}
                onChange={handleCompanyChange}
                companies={companies}
                disabled={companyDisabled}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Oro uostas
              </p>
              <AirportSelect
                value={airportId}
                onChange={handleAirportChange}
                airports={airports}
                disabled={airportDisabled}
              />
            </div>
          </div>

          <FlightsResultsTable
            schedules={schedules}
            airports={airports}
            companies={companies}
            hasQueried={hasQueried}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kelionės į skrydį planavimas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Grandinė: Panevėžys - Vilniaus autobusų stotis - Vilniaus oro uostas
            - pasirinktas VNO skrydis.
          </p>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Button variant="outline" onClick={() => void loadTravelFlights()}>
              Užkrauti VNO skrydžius
            </Button>

            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm md:max-w-xl focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedTravelFlight}
              onChange={(e) => setSelectedTravelFlight(e.target.value)}
              disabled={travelFlights.length === 0}
            >
              {travelFlights.length === 0 ? (
                <option value="">Nėra skrydžių (paspauskite užkrauti)</option>
              ) : (
                travelFlights.map((f: any) => (
                  <option
                    key={`${f.flightIata}-${f.departureTime}`}
                    value={f.flightIata}
                  >
                    {f.flightIata} | {f.airline} | į {f.destinationIata} |{" "}
                    {formatDate(f.departureTime)}
                  </option>
                ))
              )}
            </select>

            <Button
              onClick={() => void handleTravelSearch()}
              disabled={travelLoading || travelFlights.length === 0}
            >
              {travelLoading ? "Skaičiuojama..." : "Skaičiuoti grandinę"}
            </Button>
          </div>

          {travelError && (
            <p className="text-sm text-red-700 font-medium">{travelError}</p>
          )}

          {travelResult && (
            <div className="mt-4 space-y-3 rounded-lg border bg-slate-50 p-4 text-sm text-slate-700">
              <div className="space-y-1">
                <p>
                  <strong>Tarpmiestinis autobusas:</strong>{" "}
                  {travelResult.intercityLeg.fromStopName} -{" "}
                  {travelResult.intercityLeg.toStopName}
                </p>
                <p className="text-muted-foreground ml-4">
                  {formatDate(travelResult.intercityLeg.departureTime)} —{" "}
                  {formatDate(travelResult.intercityLeg.arrivalTime)}
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  <strong>Vilniaus VT iki oro uosto:</strong>{" "}
                  {travelResult.cityLeg.fromStopName} -{" "}
                  {travelResult.cityLeg.toStopName}
                </p>
                <p className="text-muted-foreground ml-4">
                  {formatDate(travelResult.cityLeg.departureTime)} —{" "}
                  {formatDate(travelResult.cityLeg.arrivalTime)}
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  <strong>Pasirinktas skrydis:</strong>{" "}
                  {travelResult.selectedFlight.flightIata} (
                  {travelResult.selectedFlight.airline})
                </p>
              </div>

              <div className="pt-2 border-t">
                <p>
                  <strong>Rezervas:</strong> {travelResult.reserveMinutes} min.
                </p>
                <p>
                  <strong>Galutinė išvada:</strong> {travelResult.statusLabel}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
