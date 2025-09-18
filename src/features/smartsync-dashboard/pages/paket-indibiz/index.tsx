"use client"

import * as React from 'react'
import { Header } from '@/features/smartsync-dashboard/components/header'
import { Main } from '@/features/smartsync-dashboard/components/main'
import { Separator } from '@/shared/ui/separator'
import { ThemeSwitch } from '@/shared/components/theme-switch'
import { PageBreadcrumb, generateBreadcrumbItems } from '@/shared/components/page-breadcrumb'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Plus, Pencil, Trash2, Settings2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import { Label } from "@/shared/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Badge } from "@/shared/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination"
import { 
  paketData, 
  paketIndibizData, 
  getPaketById,
  type PaketIndibiz 
} from '@/features/smartsync-dashboard/data/paket-data'

const data: PaketIndibiz[] = paketIndibizData

export const createColumns = (
  handleEditPaketIndibiz: (paketIndibiz: PaketIndibiz) => void,
  handleDeletePaketIndibiz: (paketIndibizId: string) => void
): ColumnDef<PaketIndibiz>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id_paket",
    header: () => <span className="font-extrabold">Nama Paket</span>,
    cell: ({ row }) => {
      const paketId = row.getValue("id_paket") as string
      const paket = getPaketById(paketId)
      return <div className="font-medium">{paket?.nama_paket || 'Unknown'}</div>
    },
  },
  {
    accessorKey: "status_paket",
    header: () => <span className="font-extrabold">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status_paket") as string
      return (
        <Badge 
          variant="outline" 
          className={`capitalize font-medium ${
            status === 'active' 
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50' 
              : status === 'suspended'
              ? 'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/50'
              : 'text-gray-700 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-950/50'
          }`}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "tgl_aktivasi",
    header: () => <span className="font-extrabold">Tanggal Aktivasi</span>,
    cell: ({ row }) => <div>{row.getValue("tgl_aktivasi")}</div>,
  },
  {
    accessorKey: "tgl_berakhir",
    header: () => <span className="font-extrabold">Tanggal Berakhir</span>,
    cell: ({ row }) => <div>{row.getValue("tgl_berakhir")}</div>,
  },
]

export default function ManagePaketIndibiz() {
  const pathname = '/admin/paket-indibiz' // Admin only page
  const breadcrumbItems = generateBreadcrumbItems(pathname)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [paketIndibizList, setPaketIndibizList] = React.useState<PaketIndibiz[]>(data)
  const [editingPaketIndibiz, setEditingPaketIndibiz] = React.useState<PaketIndibiz | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newPaketIndibiz, setNewPaketIndibiz] = React.useState<Omit<PaketIndibiz, 'id' | 'created_at' | 'updated_at'>>({
    id_paket: '',
    id_agency: '',
    status_paket: 'active',
    tgl_aktivasi: '',
    tgl_berakhir: '',
  })
  const [pageSize, setPageSize] = React.useState<number>(10)

  const handleEditPaketIndibiz = (paketIndibiz: PaketIndibiz) => {
    setEditingPaketIndibiz(paketIndibiz)
    setIsEditDialogOpen(true)
  }

  const handleDeletePaketIndibiz = (paketIndibizId: string) => {
    setPaketIndibizList(prev => prev.filter(item => item.id !== paketIndibizId))
  }

  const handleSaveEdit = () => {
    if (editingPaketIndibiz) {
      setPaketIndibizList(prev => prev.map(item => 
        item.id === editingPaketIndibiz.id ? { ...editingPaketIndibiz, updated_at: new Date().toISOString().split('T')[0] } : item
      ))
      setIsEditDialogOpen(false)
      setEditingPaketIndibiz(null)
    }
  }

  const handleAddPaketIndibiz = () => {
    const id = (Math.max(...paketIndibizList.map(p => parseInt(p.id))) + 1).toString()
    const currentDate = new Date().toISOString().split('T')[0]
    const paketIndibiz: PaketIndibiz = { 
      ...newPaketIndibiz, 
      id, 
      created_at: currentDate,
      updated_at: currentDate
    }
    setPaketIndibizList(prev => [...prev, paketIndibiz])
    setIsAddDialogOpen(false)
    setNewPaketIndibiz({
      id_paket: '',
      id_agency: '',
      status_paket: 'active',
      tgl_aktivasi: '',
      tgl_berakhir: '',
    })
  }

  const columns = React.useMemo(() => createColumns(handleEditPaketIndibiz, handleDeletePaketIndibiz), [])
  
  const table = useReactTable({
    data: paketIndibizList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
  })

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  return (
    <>
      <Header fixed>
        <div className="flex items-center justify-between w-full">
          <PageBreadcrumb items={breadcrumbItems} />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
          </div>
        </div>
      </Header>
      <Main>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Kelola Paket Indibiz
            </h1>
            <p className="text-muted-foreground">
              Kelola paket Indibiz yang digunakan oleh agen
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Paket Indibiz
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Paket Indibiz Baru</DialogTitle>
                <DialogDescription>
                  Assign paket ke agen. Pilih paket yang tersedia.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_paket" className="text-right">
                    Paket
                  </Label>
                  <Select value={newPaketIndibiz.id_paket} onValueChange={(value) => setNewPaketIndibiz(prev => ({ ...prev, id_paket: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih paket" />
                    </SelectTrigger>
                    <SelectContent>
                      {paketData.map((paket) => (
                        <SelectItem key={paket.id} value={paket.id}>
                          {paket.nama_paket} - {paket.bandwith_paket} Mbps
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id_agency" className="text-right">
                    ID Agen
                  </Label>
                  <Input
                    id="id_agency"
                    value={newPaketIndibiz.id_agency}
                    onChange={(e) => setNewPaketIndibiz(prev => ({ ...prev, id_agency: e.target.value }))}
                    className="col-span-3"
                    placeholder="Masukkan ID agen"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tgl_aktivasi" className="text-right">
                    Tanggal Aktivasi
                  </Label>
                  <Input
                    id="tgl_aktivasi"
                    type="date"
                    value={newPaketIndibiz.tgl_aktivasi}
                    onChange={(e) => setNewPaketIndibiz(prev => ({ ...prev, tgl_aktivasi: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tgl_berakhir" className="text-right">
                    Tanggal Berakhir
                  </Label>
                  <Input
                    id="tgl_berakhir"
                    type="date"
                    value={newPaketIndibiz.tgl_berakhir}
                    onChange={(e) => setNewPaketIndibiz(prev => ({ ...prev, tgl_berakhir: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status_paket" className="text-right">
                    Status
                  </Label>
                  <Select value={newPaketIndibiz.status_paket} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setNewPaketIndibiz(prev => ({ ...prev, status_paket: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddPaketIndibiz}>Tambah Paket Indibiz</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter paket..."
              value={(table.getColumn("id_paket")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("id_paket")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  View <Settings2 />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                {table.getRowModel().rows?.length ? (
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                entries per page
              </span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => table.previousPage()}
                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => {
                  const isCurrentPage = table.getState().pagination.pageIndex + 1 === page
                  const shouldShow = 
                    page === 1 || 
                    page === table.getPageCount() || 
                    Math.abs(page - (table.getState().pagination.pageIndex + 1)) <= 1
                  
                  if (!shouldShow && page !== 2 && page !== table.getPageCount() - 1) {
                    if (page === 3 || page === table.getPageCount() - 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  }
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(page - 1)}
                        isActive={isCurrentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => table.nextPage()}
                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Main>
    </>
  );
};

const topNav = [
  {
    title: 'Dasbor',
    href: '/admin/dashboard',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Agen',
    href: '/admin/agencies',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Paket Indibiz',
    href: '/admin/paket-indibiz',
    isActive: true,
    disabled: true,
  },
  {
    title: 'Pengaturan',
    href: '/admin/settings',
    isActive: false,
    disabled: false,
  },
]
