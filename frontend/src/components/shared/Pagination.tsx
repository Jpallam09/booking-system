import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number
  lastPage: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  lastPage,
  total,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null

  return (
    <div className="flex items-center justify-between gap-4 pt-4">
      <p className="text-xs text-muted-foreground">
        {total} result{total === 1 ? "" : "s"}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {lastPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
