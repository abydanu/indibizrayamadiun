"use client"

import * as React from 'react'
import { Header } from '@/features/smartsync-dashboard/components/header'
import { Main } from '@/features/smartsync-dashboard/components/main'
import { Separator } from '@/shared/ui/separator'
import { ThemeSwitch } from '@/shared/components/theme-switch'
import { PageBreadcrumb } from '@/shared/components/page-breadcrumb'
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
import { agencyDummyData } from '@/features/smartsync-dashboard/data/agency-data'
import { toast } from 'sonner'

export type AgencyDisplay = {
  id: string
  username: string
  nama: string
  regional: string
  witel: string
  datel: string
  tgl_registrasi: string
  status: "active" | "deleted"
}

const data: AgencyDisplay[] = agencyDummyData.map(agency => ({
  id: agency.id,
  username: agency.kodeAgency.toLowerCase(),
  nama: agency.namaAgency,
  regional: 'Regional 7',
  witel: 'Witel Madiun',
  datel: 'Datel Bojonegoro',
  tgl_registrasi: agency.createdAt?.split('T')[0] || '2024-01-01',
  status: agency.status === 'AKTIF' ? 'active' : 'deleted'
}))

export const createColumns = (
  handleEditAgency: (agency: AgencyDisplay) => void,
  handleDeleteAgency: (agencyId: string) => void,
  isSubmitting: boolean
): ColumnDef<AgencyDisplay>[] => [
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
      accessorKey: "username",
      header: () => {
        return (
          <a
            className="font-extrabold"
          >
            Username
          </a>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("username")}</div>,
    },
    {
      accessorKey: "nama",
      header: () => {
        return (
          <a
            className="font-extrabold"
          >
            Nama
          </a>
        )
      },
      cell: ({ row }) => <div>{row.getValue("nama")}</div>,
    },
    {
      accessorKey: "regional",
      header: () => {
        return (
          <a
            className="font-extrabold"
          >
            Regional
          </a>
        )
      },
      cell: ({ row }) => <div>{row.getValue("regional")}</div>,
    },
    {
      accessorKey: "witel",
      header: () => {
        return (
          <a
            className="font-extrabold"
          >
            Witel
          </a>
        )
      },
      cell: ({ row }) => <div>{row.getValue("witel")}</div>,
    },
    {
      accessorKey: "datel",
      header: () => {
        return (
          <a
            className="font-extrabold"
          >
            Datel
          </a>
        )
      },
      cell: ({ row }) => <div>{row.getValue("datel")}</div>,
    },
    {
      accessorKey: "tgl_registrasi",
      header: () => {
        return (
          <a
            className="font-extrabold"
          >
            Tgl Registrasi
          </a>
        )
      },
      cell: ({ row }) => <div>{row.getValue("tgl_registrasi")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <span className="font-extrabold">Status</span>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant="outline"
            className={`capitalize font-medium ${status === 'active'
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/50'
              }`}
          >
            {status === 'deleted' ? 'Suspended' : status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const agency = row.original
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
              <DropdownMenuItem onClick={() => handleEditAgency(agency)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center">
                    {isSubmitting && agency.id === editingAgency?.id ? (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting && agency.id === editingAgency?.id ? 'Menghapus...' : 'Hapus Data'}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakannya tidak dapat dibatalkan. Ini akan menghapus data <span className='font-bold'>"{agency.nama}"</span> secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteAgency(agency.id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Menghapus...' : 'Hapus'}
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


export default function ManageAgencies() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [agencies, setAgencies] = React.useState<AgencyDisplay[]>(data)
  const [editingAgency, setEditingAgency] = React.useState<AgencyDisplay | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newAgency, setNewAgency] = React.useState<Omit<AgencyDisplay, 'id'>>({
    username: '',
    nama: '',
    regional: '',
    witel: '',
    datel: '',
    tgl_registrasi: new Date().toISOString().split('T')[0],
    status: 'deleted'
  })
  const [pageSize, setPageSize] = React.useState<number>(10)

  const handleEditAgency = (agency: AgencyDisplay) => {
    setEditingAgency(agency)
    setIsEditDialogOpen(true)
  }

  const handleDeleteAgency = async (agencyId: string) => {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      setAgencies(prev => prev.filter(agency => agency.id !== agencyId));
      
      toast.success("Data berhasil dihapus");
    } catch (error) {
      console.error('Error deleting agency:', error);
      toast.error("Gagal menghapus data");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSaveEdit = async () => {
    if (!editingAgency) return;
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAgencies(prev =>
        prev.map(agency => (agency.id === editingAgency.id ? editingAgency : agency))
      );
      setIsEditDialogOpen(false);
      setEditingAgency(null);
      toast.success("Data Berhasil di Update")
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddAgency = async() => {
    try {
      setIsSubmitting(true)

      await new Promise(resolve => setTimeout(resolve, 1000));

      const id = (Math.max(...agencies.map(a => parseInt(a.id))) + 1).toString()
      const agency: AgencyDisplay = { ...newAgency, id }
      setAgencies(prev => [...prev, agency])
      setIsAddDialogOpen(false)
      setNewAgency({
        username: '',
        nama: '',
        regional: '',
        witel: '',
        datel: '',
        tgl_registrasi: new Date().toISOString().split('T')[0],
        status: 'deleted'
      })
      toast.success("Data Berhasil di Tambahkan")
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsSubmitting(false)
    }
  }
  const columns = React.useMemo(() => createColumns(handleEditAgency, handleDeleteAgency, isSubmitting), [isSubmitting])

  const table = useReactTable({
    data: agencies,
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
          <PageBreadcrumb />
          <div className="ms-auto flex items-center space-x-4">
            <ThemeSwitch />
          </div>
        </div>
      </Header>
      <Main>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              Kelola Agen
            </h1>
            <p className="text-muted-foreground">
              Kelola Agen yang terdaftar
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Data</DialogTitle>
                <DialogDescription>
                  tambahkan data agency terbaru
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={newAgency.username}
                    onChange={(e) => setNewAgency(prev => ({ ...prev, username: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nama" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="nama"
                    value={newAgency.nama}
                    onChange={(e) => setNewAgency(prev => ({ ...prev, nama: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="regional" className="text-right">
                    Regional
                  </Label>
                  <Select value={newAgency.regional} onValueChange={(value) => setNewAgency(prev => ({ ...prev, regional: value }))}>
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select regional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regional 1">Regional 1</SelectItem>
                      <SelectItem value="Regional 2">Regional 2</SelectItem>
                      <SelectItem value="Regional 3">Regional 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="witel" className="text-right">
                    Witel
                  </Label>
                  <Input
                    id="witel"
                    value={newAgency.witel}
                    onChange={(e) => setNewAgency(prev => ({ ...prev, witel: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="datel" className="text-right">
                    Datel
                  </Label>
                  <Input
                    id="datel"
                    value={newAgency.datel}
                    onChange={(e) => setNewAgency(prev => ({ ...prev, datel: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={newAgency.status} onValueChange={(value: 'active' | 'deleted') => setNewAgency(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddAgency} disabled={isSubmitting}>{isSubmitting ? "Menmbahkan..." : "Tambah"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Agency Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Data</DialogTitle>
              <DialogDescription>
                edit informasi agency
              </DialogDescription>
            </DialogHeader>
            {editingAgency && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="edit-username"
                    value={editingAgency.username}
                    onChange={(e) => setEditingAgency(prev => prev ? { ...prev, username: e.target.value } : null)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-nama" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="edit-nama"
                    value={editingAgency.nama}
                    onChange={(e) => setEditingAgency(prev => prev ? { ...prev, nama: e.target.value } : null)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-regional" className="text-right">
                    Regional
                  </Label>
                  <Select value={editingAgency.regional} onValueChange={(value) => setEditingAgency(prev => prev ? { ...prev, regional: value } : null)}>
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select regional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regional 1">Regional 1</SelectItem>
                      <SelectItem value="Regional 2">Regional 2</SelectItem>
                      <SelectItem value="Regional 3">Regional 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-witel" className="text-right">
                    Witel
                  </Label>
                  <Input
                    id="edit-witel"
                    value={editingAgency.witel}
                    onChange={(e) => setEditingAgency(prev => prev ? { ...prev, witel: e.target.value } : null)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-datel" className="text-right">
                    Datel
                  </Label>
                  <Input
                    id="edit-datel"
                    value={editingAgency.datel}
                    onChange={(e) => setEditingAgency(prev => prev ? { ...prev, datel: e.target.value } : null)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select value={editingAgency.status} onValueChange={(value: 'active' | 'deleted') => setEditingAgency(prev => prev ? { ...prev, status: value } : null)}>
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleSaveEdit} disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Simpan"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Cari Nama Sales..."
              value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("username")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
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
