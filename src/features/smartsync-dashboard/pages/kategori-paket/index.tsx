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
  kategoriPaketData, 
  type KategoriPaket 
} from '@/features/smartsync-dashboard/data/paket-data'

const data: KategoriPaket[] = kategoriPaketData

export const createColumns = (
  handleEditKategori: (kategori: KategoriPaket) => void,
  handleDeleteKategori: (kategoriId: string) => void
): ColumnDef<KategoriPaket>[] => [
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
    accessorKey: "nama_kategori",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Nama Kategori
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("nama_kategori")}</div>,
  },
  {
    accessorKey: "deskripsi_kategori",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Deskripsi
        </Button>
      )
    },
    cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("deskripsi_kategori")}</div>,
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
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Tanggal Diperbarui
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("updated_at")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const kategori = row.original
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
            <DropdownMenuItem onClick={() => handleEditKategori(kategori)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit kategori
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete kategori
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the kategori
                    "{kategori.nama_kategori}" and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteKategori(kategori.id)}>
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

export default function ManageKategoriPaket() {
  const pathname = '/admin/kategori-paket' // Since this is admin only page
  const breadcrumbItems = generateBreadcrumbItems(pathname)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [kategoris, setKategoris] = React.useState<KategoriPaket[]>(data)
  const [editingKategori, setEditingKategori] = React.useState<KategoriPaket | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newKategori, setNewKategori] = React.useState<Omit<KategoriPaket, 'id' | 'created_at' | 'updated_at'>>({
    nama_kategori: '',
    deskripsi_kategori: '',
  })

  const handleEditKategori = (kategori: KategoriPaket) => {
    setEditingKategori(kategori)
    setIsEditDialogOpen(true)
  }

  const handleDeleteKategori = (kategoriId: string) => {
    setKategoris(prev => prev.filter(kategori => kategori.id !== kategoriId))
  }

  const handleSaveEdit = () => {
    if (editingKategori) {
      setKategoris(prev => prev.map(kategori => 
        kategori.id === editingKategori.id ? { ...editingKategori, updated_at: new Date().toISOString().split('T')[0] } : kategori
      ))
      setIsEditDialogOpen(false)
      setEditingKategori(null)
    }
  }

  const handleAddKategori = () => {
    const id = (Math.max(...kategoris.map(k => parseInt(k.id))) + 1).toString()
    const currentDate = new Date().toISOString().split('T')[0]
    const kategori: KategoriPaket = { 
      ...newKategori, 
      id, 
      created_at: currentDate,
      updated_at: currentDate
    }
    setKategoris(prev => [...prev, kategori])
    setIsAddDialogOpen(false)
    setNewKategori({
      nama_kategori: '',
      deskripsi_kategori: '',
    })
  }

  const columns = React.useMemo(() => createColumns(handleEditKategori, handleDeleteKategori), [])
  
  const table = useReactTable({
    data: kategoris,
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
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

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
            Kelola Kategori Paket
          </h1>
          <p className="text-muted-foreground">
            Kelola kategori paket internet Indibiz
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
              <DialogDescription>
                Buat kategori paket baru. Isi semua informasi yang diperlukan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nama_kategori" className="text-right">
                  Nama Kategori
                </Label>
                <Input
                  id="nama_kategori"
                  value={newKategori.nama_kategori}
                  onChange={(e) => setNewKategori(prev => ({ ...prev, nama_kategori: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deskripsi" className="text-right">
                  Deskripsi
                </Label>
                <Textarea
                  id="deskripsi"
                  value={newKategori.deskripsi}
                  onChange={(e) => setNewKategori(prev => ({ ...prev, deskripsi: e.target.value }))}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddKategori}>Tambah Kategori</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Kategori Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Ubah informasi kategori. Klik simpan setelah selesai.
            </DialogDescription>
          </DialogHeader>
          {editingKategori && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nama_kategori" className="text-right">
                  Nama Kategori
                </Label>
                <Input
                  id="edit-nama_kategori"
                  value={editingKategori.nama_kategori}
                  onChange={(e) => setEditingKategori(prev => prev ? { ...prev, nama_kategori: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deskripsi" className="text-right">
                  Deskripsi
                </Label>
                <Textarea
                  id="edit-deskripsi"
                  value={editingKategori.deskripsi}
                  onChange={(e) => setEditingKategori(prev => prev ? { ...prev, deskripsi: e.target.value } : null)}
                  className="col-span-3"
                  rows={3}
                />
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
          placeholder="Filter nama kategori..."
          value={(table.getColumn("nama_kategori")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nama_kategori")?.setFilterValue(event.target.value)
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
          <Select 
            value={table.getState().pagination.pageSize.toString()} 
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
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
    title: 'Kategori Paket',
    href: '/admin/kategori-paket',
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
