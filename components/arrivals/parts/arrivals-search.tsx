"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type IProps = {
  value: string
  onChange: (val: string) => void
}

export function ArrivalsSearch(props: IProps) {
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
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  )
}
