"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { IArrivalsSearchProps } from "@/types/props/arrivals"

export function ArrivalsSearch(props: IArrivalsSearchProps) {
  const { value, onChange } = props
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Paieška</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-sm">
          <Label htmlFor="flight-search">Reiso numeris</Label>
          <Input
            id="flight-search"
            placeholder="SK123"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  )
}
