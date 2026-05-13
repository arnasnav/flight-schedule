"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import { getApi } from "@/utils/server-api"
import { AirportSelect } from "./parts/airport-select"
import { CompanySelect } from "./parts/company-select"
import { FlightsResultsTable } from "./parts/flights-results-table"

type IProps = {
  airports: IAirport[]
  companies: ICompany[]
}

export function Flights(props: IProps) {
  const { airports, companies } = props

  const [filterType, setFilterType] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [airportId, setAirportId] = useState("")
  const [schedules, setSchedules] = useState<ISchedule[]>([])
  const [hasQueried, setHasQueried] = useState(false)

  const companyDisabled = filterType !== "by-company"
  const airportDisabled = !filterType || filterType === "by-company"

  const clearSchedules = () => {
    setSchedules([])
    setHasQueried(false)
  }

  const fetchSchedules = async (url: string) => {
    const data = await getApi<ISchedule[]>(url)
    setSchedules(data ?? [])
    setHasQueried(true)
  }

  const getAirportUrl = (type: string, airportId: string) => {
    const encodedId = encodeURIComponent(airportId)
    return type === "depart-from-airport"
      ? `/api/flights-from-airport?airportId=${encodedId}`
      : `/api/flights-to-airport?airportId=${encodedId}`
  }

  const handleFilterTypeChange = async (type: string) => {
    setFilterType(type)
    if (type === "by-company") {
      setAirportId("")
      if (!companyId) {
        clearSchedules()
        return
      }
      await fetchSchedules(
        `/api/flights-by-company?companyId=${encodeURIComponent(companyId)}`
      )
      return
    }
    setCompanyId("")
    if (!airportId) {
      clearSchedules()
      return
    }
    await fetchSchedules(getAirportUrl(type, airportId))
  }

  const handleCompanyChange = async (id: string) => {
    setCompanyId(id)
    if (filterType !== "by-company" || !id) {
      clearSchedules()
      return
    }
    await fetchSchedules(
      `/api/flights-by-company?companyId=${encodeURIComponent(id)}`
    )
  }

  const handleAirportChange = async (id: string) => {
    setAirportId(id)
    if (!filterType || filterType === "by-company" || !id) {
      clearSchedules()
      return
    }
    await fetchSchedules(getAirportUrl(filterType, id))
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
                  <SelectItem value="by-company">
                    Skrydžiai pagal kompaniją
                  </SelectItem>
                  <SelectItem value="depart-from-airport">
                    Išskrendantys skrydžiai iš oro uosto
                  </SelectItem>
                  <SelectItem value="arrive-to-airport">
                    Atskrendantys skrydžiai į oro uostą
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
    </div>
  )
}
