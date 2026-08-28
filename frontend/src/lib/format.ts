export function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function formatCurrency(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value
  return `$${Number.isNaN(n) ? "0.00" : n.toFixed(2)}`
}
