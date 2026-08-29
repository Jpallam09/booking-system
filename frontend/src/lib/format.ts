export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const phpFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

export function formatCurrency(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value
  return phpFormatter.format(Number.isNaN(n) ? 0 : n)
}
