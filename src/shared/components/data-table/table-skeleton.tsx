import { TableRow, TableCell } from "@/shared/ui/table"
import { Skeleton } from "@/shared/ui/skeleton"

interface TableSkeletonProps {
  rows?: number
  columns: Array<{
    width: string
    height?: string
    rounded?: boolean
  }>
}

export function TableSkeleton({ rows = 5, columns }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          {columns.map((column, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton 
                className={`${column.height || 'h-4'} ${column.width} ${column.rounded ? 'rounded-full' : ''}`} 
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
