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

const data: Agency[] = [
  {
    id: "1",
    username: "john_doe",
    nama: "John Doe",
    regional: "Regional 1",
    witel: "Witel Jakarta",
    datel: "Datel Jakarta Pusat",
    tgl_registrasi: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    username: "jane_smith",
    nama: "Jane Smith",
    regional: "Regional 2",
    witel: "Witel Bandung",
    datel: "Datel Bandung Kota",
    tgl_registrasi: "2024-01-20",
    status: "deleted",
  },
  {
    id: "3",
    username: "bob_wilson",
    nama: "Bob Wilson",
    regional: "Regional 1",
    witel: "Witel Jakarta",
    datel: "Datel Jakarta Selatan",
    tgl_registrasi: "2024-02-01",
    status: "active",
  },
  {
    id: "4",
    username: "alice_brown",
    nama: "Alice Brown",
    regional: "Regional 3",
    witel: "Witel Surabaya",
    datel: "Datel Surabaya Pusat",
    tgl_registrasi: "2024-02-10",
    status: "deleted",
  },
  {
    id: "5",
    username: "charlie_davis",
    nama: "Charlie Davis",
    regional: "Regional 2",
    witel: "Witel Bandung",
    datel: "Datel Bandung Timur",
    tgl_registrasi: "2024-02-15",
    status: "active",
  },
  {
    id: "6",
    username: "diana_miller",
    nama: "Diana Miller",
    regional: "Regional 1",
    witel: "Witel Jakarta",
    datel: "Datel Jakarta Barat",
    tgl_registrasi: "2024-03-01",
    status: "deleted",
  },
  {
    id: "7",
    username: "evan_taylor",
    nama: "Evan Taylor",
    regional: "Regional 3",
    witel: "Witel Surabaya",
    datel: "Datel Surabaya Utara",
    tgl_registrasi: "2024-03-05",
    status: "active",
  },
  {
    id: "8",
    username: "fiona_clark",
    nama: "Fiona Clark",
    regional: "Regional 2",
    witel: "Witel Bandung",
    datel: "Datel Bandung Selatan",
    tgl_registrasi: "2024-03-10",
    status: "deleted",
  },
  {
    id: "9",
    username: "george_hall",
    nama: "George Hall",
    regional: "Regional 1",
    witel: "Witel Jakarta",
    datel: "Datel Jakarta Utara",
    tgl_registrasi: "2024-03-15",
    status: "active",
  },
  {
    id: "10",
    username: "helen_white",
    nama: "Helen White",
    regional: "Regional 3",
    witel: "Witel Surabaya",
    datel: "Datel Surabaya Selatan",
    tgl_registrasi: "2024-03-20",
    status: "deleted",
  },
]

export type Agency = {
  id: string
  username: string
  nama: string
  regional: string
  witel: string
  datel: string
  tgl_registrasi: string
  status: "active" | "deleted" | "deleted"
}

export const createColumns = (
  handleEditAgency: (agency: Agency) => void,
  handleDeleteAgency: (agencyId: string) => void
): ColumnDef<Agency>[] => [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Username
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("username")}</div>,
  },
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Nama
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("nama")}</div>,
  },
  {
    accessorKey: "regional",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Regional
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("regional")}</div>,
  },
  {
    accessorKey: "witel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Witel
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("witel")}</div>,
  },
  {
    accessorKey: "datel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Datel
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("datel")}</div>,
  },
  {
    accessorKey: "tgl_registrasi",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-extrabold"
        >
          Tgl Registrasi
        </Button>
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
          className={`capitalize font-medium ${
            status === 'active' 
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
              Edit agency
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete agency
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the agency
                    "{agency.nama}" and remove their data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteAgency(agency.id)}>
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


export default function ManageAgencies() {
  const pathname = '/admin/agencies' // Admin only page
  const breadcrumbItems = generateBreadcrumbItems(pathname)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [agencies, setAgencies] = React.useState<Agency[]>(data)
  const [editingAgency, setEditingAgency] = React.useState<Agency | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newAgency, setNewAgency] = React.useState<Omit<Agency, 'id'>>({
    username: '',
    nama: '',
    regional: '',
    witel: '',
    datel: '',
    tgl_registrasi: new Date().toISOString().split('T')[0],
    status: 'deleted'
  })
  const [pageSize, setPageSize] = React.useState<number>(10)

  const handleEditAgency = (agency: Agency) => {
    setEditingAgency(agency)
    setIsEditDialogOpen(true)
  }

  const handleDeleteAgency = (agencyId: string) => {
    setAgencies(prev => prev.filter(agency => agency.id !== agencyId))
  }

  const handleSaveEdit = () => {
    if (editingAgency) {
      setAgencies(prev => prev.map(agency => 
        agency.id === editingAgency.id ? editingAgency : agency
      ))
      setIsEditDialogOpen(false)
      setEditingAgency(null)
    }
  }

  const handleAddAgency = () => {
    const id = (Math.max(...agencies.map(a => parseInt(a.id))) + 1).toString()
    const agency: Agency = { ...newAgency, id }
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
  }
  const columns = React.useMemo(() => createColumns(handleEditAgency, handleDeleteAgency), [])
  
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

  // Update page size when dropdown changes
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
            Kelola Agen/Sales
          </h1>
          <p className="text-muted-foreground">
            Kelola akun Agen/Sales
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Agency
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Agency</DialogTitle>
              <DialogDescription>
                Create a new agency account. Fill in all the required information.
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
                  <SelectTrigger className="col-span-3">
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
                  <SelectTrigger className="col-span-3">
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
              <Button type="submit" onClick={handleAddAgency}>Tambah Agency</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Agency Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Agency</DialogTitle>
            <DialogDescription>
              Make changes to the agency account. Click save when you're done.
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
                  <SelectTrigger className="col-span-3">
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
                  <SelectTrigger className="col-span-3">
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
            <Button type="submit" onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

            <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter username..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
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
