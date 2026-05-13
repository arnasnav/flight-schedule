import type { IAircraft } from "@/models/aircraft-model"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ITerminal } from "@/models/terminal-model"

export function findAirportById(
  airports: readonly IAirport[],
  id: string | undefined,
): IAirport | undefined {
  if (!id) return undefined
  return airports.find((a) => a.id === id)
}

export function findCompanyById(
  companies: readonly ICompany[],
  id: string | undefined,
): ICompany | undefined {
  if (!id) return undefined
  return companies.find((c) => c.id === id)
}

export function getAirportName(
  airports: readonly IAirport[],
  id: string | undefined,
): string | undefined {
  return findAirportById(airports, id)?.name
}

export function getCompanyName(
  companies: readonly ICompany[],
  id: string | undefined,
): string | undefined {
  return findCompanyById(companies, id)?.name
}

export function getAirportNameOrId(
  airports: readonly IAirport[],
  id: string,
): string {
  return getAirportName(airports, id) ?? id
}

export function getCompanyNameOrId(
  companies: readonly ICompany[],
  id: string,
): string {
  return getCompanyName(companies, id) ?? id
}

export function findTerminalByName(
  terminals: readonly ITerminal[],
  name: string,
): ITerminal | undefined {
  return terminals.find((t) => t.name === name)
}

export function findAircraftByName(
  aircrafts: readonly IAircraft[],
  name: string,
): IAircraft | undefined {
  return aircrafts.find((a) => a.name === name)
}
