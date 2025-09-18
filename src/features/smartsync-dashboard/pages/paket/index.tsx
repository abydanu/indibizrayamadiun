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
import { ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, Settings2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog"
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
import { Textarea } from "@/shared/ui/textarea"
import { 
  paketData, 
  kategoriPaketData, 
  promoData, 
  getKategoriById, 
  getPromoById, 
  calculateFinalPrice,
  type Paket 
} from '@/features/smartsync-dashboard/data/paket-data'

const data: Paket[] = paketData

export const createColumns = (
  handleEditPaket: (paket: Paket) => void,
  handleDeletePaket: (paketId: string) => void
): ColumnDef<Paket>[] => [
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
    accessorKey: "nama_paket",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Nama Paket
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("nama_paket")}</div>,
  },
  {
    accessorKey: "bandwith_paket",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Bandwidth
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("bandwith_paket")} Mbps</div>,
  },
  {
    accessorKey: "harga_paket",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Harga Paket
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("harga_paket"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "harga_psb",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Harga PSB
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("harga_psb"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "harga_pkt_ppn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Harga + PPN
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("harga_pkt_ppn"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "id_kategori",
    header: () => <span className="font-extrabold">Kategori</span>,
    cell: ({ row }) => {
      const kategoriId = row.getValue("id_kategori") as string
      const kategori = getKategoriById(kategoriId)
      return <div>{kategori?.nama_kategori || 'Unknown'}</div>
    },
  },
  {
    accessorKey: "id_promo",
    header: () => <span className="font-extrabold">Promo</span>,
    cell: ({ row }) => {
      const promoId = row.getValue("id_promo") as string
      const promo = getPromoById(promoId)
      return (
        <div className="flex items-center gap-2">
          <span>{promo?.nama_promo || 'No Promo'}</span>
          {promo && promo.status_promo === 'active' && (
            <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50">
              -{promo.diskon}%
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "harga_final",
    header: () => <span className="font-extrabold">Harga Final</span>,
    cell: ({ row }) => {
      const paket = row.original
      const finalPrice = calculateFinalPrice(paket)
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(finalPrice)
      return <div className="font-medium text-green-600">{formatted}</div>
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Tanggal Dibuat
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const paket = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEditPaket(paket)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit paket
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete paket
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the paket
                    "{paket.nama_paket}" and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeletePaket(paket.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ManagePaket() {
  const pathname = '/agency/paket' // Agency page
  const breadcrumbItems = generateBreadcrumbItems(pathname)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pakets, setPakets] = React.useState<Paket[]>(data)
  const [editingPaket, setEditingPaket] = React.useState<Paket | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newPaket, setNewPaket] = React.useState<Omit<Paket, 'id' | 'created_at' | 'updated_at'>>({
    nama_paket: '',
    bandwith_paket: '',
    harga_psb: '',
    harga_paket: '',
    harga_pkt_ppn: '',
    id_kategori: '',
    id_promo: '',
  })
  const [pageSize, setPageSize] = React.useState<number>(10)

  const handleEditPaket = (paket: Paket) => {
    setEditingPaket(paket)
    setIsEditDialogOpen(true)
  }

  const handleDeletePaket = (paketId: string) => {
    setPakets(prev => prev.filter(paket => paket.id !== paketId))
  }

  const handleSaveEdit = () => {
    if (editingPaket) {
      setPakets(prev => prev.map(paket => 
        paket.id === editingPaket.id ? { ...editingPaket, updated_at: new Date().toISOString().split('T')[0] } : paket
      ))
      setIsEditDialogOpen(false)
      setEditingPaket(null)
    }
  }

  const handleAddPaket = () => {
    const id = (Math.max(...pakets.map(p => parseInt(p.id))) + 1).toString()
    const currentDate = new Date().toISOString().split('T')[0]
    const paket: Paket = { 
      ...newPaket, 
      id, 
      created_at: currentDate,
      updated_at: currentDate
    }
    setPakets(prev => [...prev, paket])
    setIsAddDialogOpen(false)
    setNewPaket({
      nama_paket: '',
      bandwith_paket: '',
      harga_psb: '',
      harga_paket: '',
      harga_pkt_ppn: '',
      id_kategori: '',
      id_promo: '',
    })
  }

  const columns = React.useMemo(() => createColumns(handleEditPaket, handleDeletePaket), [])
  
  const table = useReactTable({
    data: pakets,
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
    initialState: {
      pagination: {
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
            Kelola Paket
          </h1>
          <p className="text-muted-foreground">
            Kelola paket internet Indibiz
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Paket Baru</DialogTitle>
              <DialogDescription>
                Buat paket internet baru. Isi semua informasi yang diperlukan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nama_paket" className="text-right">
                  Nama Paket
                </Label>
                <Input
                  id="nama_paket"
                  value={newPaket.nama_paket}
                  onChange={(e) => setNewPaket(prev => ({ ...prev, nama_paket: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bandwith_paket" className="text-right">
                  Bandwidth (Mbps)
                </Label>
                <Input
                  id="bandwith_paket"
                  type="number"
                  value={newPaket.bandwith_paket}
                  onChange={(e) => setNewPaket(prev => ({ ...prev, bandwith_paket: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="harga_paket" className="text-right">
                  Harga Paket
                </Label>
                <Input
                  id="harga_paket"
                  type="number"
                  value={newPaket.harga_paket}
                  onChange={(e) => setNewPaket(prev => ({ ...prev, harga_paket: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="harga_psb" className="text-right">
                  Harga PSB
                </Label>
                <Input
                  id="harga_psb"
                  type="number"
                  value={newPaket.harga_psb}
                  onChange={(e) => setNewPaket(prev => ({ ...prev, harga_psb: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="harga_pkt_ppn" className="text-right">
                  Harga + PPN
                </Label>
                <Input
                  id="harga_pkt_ppn"
                  type="number"
                  value={newPaket.harga_pkt_ppn}
                  onChange={(e) => setNewPaket(prev => ({ ...prev, harga_pkt_ppn: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_kategori" className="text-right">
                  Kategori
                </Label>
                <Select value={newPaket.id_kategori} onValueChange={(value) => setNewPaket(prev => ({ ...prev, id_kategori: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriPaketData.map((kategori) => (
                      <SelectItem key={kategori.id} value={kategori.id}>
                        {kategori.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_promo" className="text-right">
                  Promo
                </Label>
                <Select value={newPaket.id_promo || "no-promo"} onValueChange={(value) => setNewPaket(prev => ({ ...prev, id_promo: value === "no-promo" ? "" : value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih promo (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-promo">Tanpa Promo</SelectItem>
                    {promoData.filter(promo => promo.status_promo === 'active').map((promo) => (
                      <SelectItem key={promo.id} value={promo.id}>
                        {promo.nama_promo} (-{promo.diskon}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddPaket}>Tambah Paket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Paket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Paket</DialogTitle>
            <DialogDescription>
              Ubah informasi paket. Klik simpan setelah selesai.
            </DialogDescription>
          </DialogHeader>
          {editingPaket && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nama_paket" className="text-right">
                  Nama Paket
                </Label>
                <Input
                  id="edit-nama_paket"
                  value={editingPaket.nama_paket}
                  onChange={(e) => setEditingPaket(prev => prev ? { ...prev, nama_paket: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-bandwith_paket" className="text-right">
                  Bandwidth (Mbps)
                </Label>
                <Input
                  id="edit-bandwith_paket"
                  type="number"
                  value={editingPaket.bandwith_paket}
                  onChange={(e) => setEditingPaket(prev => prev ? { ...prev, bandwith_paket: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-harga_paket" className="text-right">
                  Harga Paket
                </Label>
                <Input
                  id="edit-harga_paket"
                  type="number"
                  value={editingPaket.harga_paket}
                  onChange={(e) => setEditingPaket(prev => prev ? { ...prev, harga_paket: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-harga_psb" className="text-right">
                  Harga PSB
                </Label>
                <Input
                  id="edit-harga_psb"
                  type="number"
                  value={editingPaket.harga_psb}
                  onChange={(e) => setEditingPaket(prev => prev ? { ...prev, harga_psb: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-harga_pkt_ppn" className="text-right">
                  Harga + PPN
                </Label>
                <Input
                  id="edit-harga_pkt_ppn"
                  type="number"
                  value={editingPaket.harga_pkt_ppn}
                  onChange={(e) => setEditingPaket(prev => prev ? { ...prev, harga_pkt_ppn: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-id_kategori" className="text-right">
                  Kategori
                </Label>
                <Select value={editingPaket.id_kategori} onValueChange={(value) => setEditingPaket(prev => prev ? { ...prev, id_kategori: value } : null)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriPaketData.map((kategori) => (
                      <SelectItem key={kategori.id} value={kategori.id}>
                        {kategori.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-id_promo" className="text-right">
                  Promo
                </Label>
                <Select value={editingPaket.id_promo || "no-promo"} onValueChange={(value) => setEditingPaket(prev => prev ? { ...prev, id_promo: value === "no-promo" ? "" : value } : null)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih promo (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-promo">Tanpa Promo</SelectItem>
                    {promoData.filter(promo => promo.status_promo === 'active').map((promo) => (
                      <SelectItem key={promo.id} value={promo.id}>
                        {promo.nama_promo} (-{promo.diskon}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

            <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter nama paket..."
          value={(table.getColumn("nama_paket")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nama_paket")?.setFilterValue(event.target.value)
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
    title: 'Paket',
    href: '/admin/paket',
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
