"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const DEFAULT_TIME = "10:30:00"

function toIsoDate(date: Date, time: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}T${time.slice(0, 5)}`
}

function parseIso(value?: string): { date: Date | null; time: string | null } {
  if (!value) return { date: null, time: null }

  const date = new Date(`${value.slice(0, 10)}T00:00:00`)

  return {
    date: !Number.isNaN(date.getTime()) ? date : null,
    time: value.slice(11, 16) || null,
  }
}

function startOfTomorrow(): Date {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)
  return date
}

export type DateTimePickerProps = {
  value?: string
  onChange: (value: string) => void
  minDate?: Date
  dateTriggerId?: string
  timeInputId?: string
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  minDate,
  dateTriggerId = "date-picker",
  timeInputId = "time-picker",
  className,
}: DateTimePickerProps) {
  const { date, time } = parseIso(value)
  const [open, setOpen] = React.useState(false)
  const [timeValue, setTimeValue] = React.useState(time ?? DEFAULT_TIME)
  const min = minDate ?? startOfTomorrow()

  React.useEffect(() => {
    if (time) setTimeValue(time)
  }, [time])

  const handleSelectDate = (selected: Date | undefined) => {
    if (!selected) return
    onChange(toIsoDate(selected, timeValue))
    setOpen(false)
  }

  const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setTimeValue(next)
    if (date) onChange(toIsoDate(date, next))
  }

  return (
    <FieldGroup className={cn("flex-row items-start gap-3", className)}>
      <Field className="flex-1">
        <FieldLabel htmlFor={dateTriggerId}>Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                id={dateTriggerId}
                type="button"
                variant="outline"
                className="w-full justify-between px-2.5 font-normal"
              >
                {date ? format(date, "PPP") : "Select date"}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            }
          />
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={date ?? undefined}
              defaultMonth={date ?? min}
              disabled={{ before: min }}
              onSelect={handleSelectDate}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32 shrink-0">
        <FieldLabel htmlFor={timeInputId}>Time</FieldLabel>
        <Input
          id={timeInputId}
          type="time"
          step="1"
          value={timeValue ? `${timeValue.slice(0, 5)}:00` : ""}
          onChange={handleChangeTime}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
