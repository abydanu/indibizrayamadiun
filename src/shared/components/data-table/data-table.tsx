"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Input } from "@/shared/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Button } from "@/shared/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export interface ServerPaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  searchKey?: string
  searchPlaceholder?: string
  emptyMessage?: string
  loadingComponent?: React.ReactNode
  showPagination?: boolean
  showPageSize?: boolean
  showSearch?: boolean
  pagination: ServerPaginationState
  onPaginationChange: (page: number, limit: number) => void
  bulkActions?: (selectedCount: number, selectedRows: TData[]) => React.ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  searchKey = "nama",
  searchPlaceholder = "Cari...",
  emptyMessage = "Tidak ada data.",
  loadingComponent,
  showPagination = true,
  showPageSize = true,
  showSearch = true,
  pagination,
  onPaginationChange,
  bulkActions,
  searchValue,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true, // Server-side pagination
    pageCount: pagination.totalPages,
  })

  const selectedRows = React.useMemo(() => table.getSelectedRowModel().rows.map(r => r.original as TData), [rowSelection, table])
  const selectedCount = selectedRows.length

  const handlePageSizeChange = (newLimit: number) => {
    onPaginationChange(1, newLimit) // Reset ke halaman 1 saat limit berubah
  }

  const handlePageChange = (newPage: number) => {
    onPaginationChange(newPage, pagination.limit)
  }

  const startEntry = (pagination.page - 1) * pagination.limit + 1
  const endEntry = Math.min(pagination.page * pagination.limit, pagination.total)

  // Generate page numbers untuk pagination
  const getPageNumbers = () => {
    const pages = []
    const totalPages = pagination.totalPages
    const currentPage = pagination.page

    if (totalPages <= 7) {
      // Jika total halaman <= 7, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Jika total halaman > 7, tampilkan dengan ellipsis
      if (currentPage <= 4) {
        // Awal: 1 2 3 4 5 ... last
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Akhir: 1 ... last-4 last-3 last-2 last-1 last
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Tengah: 1 ... current-1 current current+1 ... last
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="w-full">
      {showSearch && (
        <div className="flex items-center justify-between py-4 gap-3 flex-wrap">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue ?? ""}
            onChange={(event) => {
              const v = event.target.value
              onSearchChange?.(v)
            }}
            className="max-w-sm"
          />
          {bulkActions && selectedCount > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions(selectedCount, selectedRows)}
            </div>
          )}
        </div>
      )}
      
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              loadingComponent
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
            {showPageSize && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Show:</span>
                <Select 
                  value={pagination.limit.toString()} 
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="w-[70px] sm:w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  entries per page
                </span>
              </div>
            )}
            
            <div className="text-xs sm:text-sm text-muted-foreground">
              Showing {startEntry} to {endEntry} of {pagination.total} entries
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-center sm:justify-end overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="hidden sm:flex"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1 min-w-0">
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === 'ellipsis' ? (
                    <span className="px-1 sm:px-2 text-muted-foreground text-sm">...</span>
                  ) : (
                    <Button
                      variant={pagination.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className="min-w-[32px] h-8 px-2"
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="hidden sm:flex"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
