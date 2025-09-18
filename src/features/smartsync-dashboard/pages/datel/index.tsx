'use client';

import * as React from 'react';
import { Header } from '@/features/smartsync-dashboard/components/header';
import { Main } from '@/features/smartsync-dashboard/components/main';
import { ThemeSwitch } from '@/shared/components/theme-switch';
import {
  PageBreadcrumb,
  generateBreadcrumbItems,
} from '@/shared/components/page-breadcrumb';
import { type Datel } from './types/datel';
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
} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, Settings2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
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
} from '@/shared/ui/alert-dialog';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';

const TableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[150px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[80px] rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[70px] rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-8" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export const createColumns = (
  handleEditDatel: (datel: Datel) => void,
  handleDeleteDatel: (datelId: string) => void,
  isSubmitting: boolean
): ColumnDef<Datel>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    accessorKey: 'namaSto',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-extrabold"
        >
          Nama
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('namaSto')}</div>
    ),
  },
  {
    accessorKey: 'kodeSto',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-extrabold"
        >
          Kode STO
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue('kodeSto')}</div>
    ),
  },
  {
    accessorKey: 'wilayah',
    header: () => <span className="font-extrabold">Wilayah</span>,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue('wilayah')}</div>
    ),
  },
  {
    accessorKey: 'kategori',
    header: () => <span className="font-extrabold">Kategori</span>,
    cell: ({ row }) => {
      const kategori = row.getValue('kategori') as string;
      const format = kategori.replace(/_/g, ' ');
      return (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${
            kategori === 'HERO'
              ? 'text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950/50'
              : 'text-gray-700 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-950/50'
          }`}
        >
          {format}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'subArea',
    header: () => <span className="font-extrabold">Sub Area</span>,
    cell: ({ row }) => {
      const subArea = row.getValue('subArea') as string;
      return (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${
            subArea === 'INNER'
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-orange-700 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-950/50'
          }`}
        >
          {subArea}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const datel = row.original;
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
            <DropdownMenuItem onClick={() => handleEditDatel(datel)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit datel
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus datel
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus
                    promo <span className="font-bold">"{datel.namaSto}"</span>{' '}
                    secara permanen
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteDatel(datel.id)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Menghapus...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ManageDatel() {
  const pathname = '/admin/datel';
  const breadcrumbItems = generateBreadcrumbItems(pathname);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [datels, setDatels] = React.useState<Datel[]>([]);
  const [editingDatel, setEditingDatel] = React.useState<Datel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newDatel, setNewDatel] = React.useState<Omit<Datel, 'id'>>({
    kodeSto: '',
    namaSto: '',
    kategori: 'HERO',
    wilayah: '',
    subArea: 'INNER',
  });
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getDatels = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `/datels?page=${pagination.page}&limit=${pagination.limit}`,
        { requireAuth: true }
      );

      const result = res.data.result;

      setDatels(result.data);
      setPagination({
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      });
    } catch (error: any) {
      toast.error('Failed to fetch datels: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDatel = (datel: Datel) => {
    setEditingDatel(datel);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDatel = async (datelId: string) => {
    try {
      setIsSubmitting(true);
      const res = await api.delete(`/datels/${datelId}`, {
        requireAuth: true,
      });

      if (res.ok) {
        await getDatels();
        toast.success('Datel Berhasil Dihapus');
      }
    } catch (error: any) {
      console.error('Failed to delete datel:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (editingDatel) {
      try {
        setIsSubmitting(true);
        const updateData = {
          kodeSto: editingDatel.kodeSto,
          namaSto: editingDatel.namaSto,
          kategori: editingDatel.kategori,
          wilayah: editingDatel.wilayah,
          subArea: editingDatel.subArea,
        };

        const res = await api.put(`/datels/${editingDatel.id}`, updateData, {
          requireAuth: true,
        });

        if (res.ok) {
          await getDatels();
          setIsEditDialogOpen(false);
          setEditingDatel(null);
          toast.success('Berhasil Edit Datel');
        }
      } catch (error: any) {
        console.error('Failed to update datel:', error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddDatel = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.post('/datels', newDatel, {
        requireAuth: true,
      });

      if (res.ok) {
        await getDatels();
        setIsAddDialogOpen(false);
        setNewDatel({
          kodeSto: '',
          namaSto: '',
          kategori: 'HERO',
          wilayah: '',
          subArea: 'INNER',
        });
        toast.success('Berhasil Membuat Datel');
      }
    } catch (error: any) {
      console.error('Failed to add datel:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = React.useMemo(
    () => createColumns(handleEditDatel, handleDeleteDatel, isSubmitting),
    [isSubmitting]
  );

  const table = useReactTable({
    data: datels,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    getDatels();
  }, [pagination.page, pagination.limit]);

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
              Kelola Datel
            </h1>
            <p className="text-muted-foreground">
              Kelola data daerah telekomunikasi
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Datel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Data Baru</DialogTitle>
                <DialogDescription>
                  Buat Datel baru. Isi semua informasi yang diperlukan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nama" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="nama"
                    value={newDatel.namaSto}
                    onChange={(e) =>
                      setNewDatel((prev) => ({
                        ...prev,
                        nama: e.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kodeSto" className="text-right">
                    Kode STO
                  </Label>
                  <Input
                    id="kodeSto"
                    value={newDatel.kodeSto}
                    onChange={(e) =>
                      setNewDatel((prev) => ({
                        ...prev,
                        kodeSto: e.target.value.toUpperCase(),
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="wilayah" className="text-right">
                    Wilayah
                  </Label>
                  <Input
                    id="wilayah"
                    value={newDatel.wilayah}
                    onChange={(e) =>
                      setNewDatel((prev) => ({
                        ...prev,
                        wilayah: e.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kategori" className="text-right">
                    Kategori
                  </Label>
                  <Select
                    value={newDatel.kategori}
                    onValueChange={(value: 'HERO' | 'NON_HERO') =>
                      setNewDatel((prev) => ({ ...prev, kategori: value }))
                    }
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HERO">HERO</SelectItem>
                      <SelectItem value="NON_HERO">NON HERO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subArea" className="text-right">
                    Sub Area
                  </Label>
                  <Select
                    value={newDatel.subArea}
                    onValueChange={(value: 'INNER' | 'OUTER') =>
                      setNewDatel((prev) => ({ ...prev, subArea: value }))
                    }
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Pilih sub area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INNER">INNER</SelectItem>
                      <SelectItem value="OUTER">OUTER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddDatel}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menambah...' : 'Tambah STO'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Datel Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              <DialogDescription>
                Ubah informasi Datel. Klik simpan setelah selesai.
              </DialogDescription>
            </DialogHeader>
            {editingDatel && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-nama" className="text-right">
                    Nama
                  </Label>
                  <Input
                    id="edit-nama"
                    value={editingDatel.namaSto}
                    onChange={(e) =>
                      setEditingDatel((prev) =>
                        prev ? { ...prev, nama: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-kodeSto" className="text-right">
                    Kode STO
                  </Label>
                  <Input
                    id="edit-kodeSto"
                    value={editingDatel.kodeSto}
                    onChange={(e) =>
                      setEditingDatel((prev) =>
                        prev
                          ? {
                              ...prev,
                              kodeSto: e.target.value.toUpperCase(),
                            }
                          : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-wilayah" className="text-right">
                    Wilayah
                  </Label>
                  <Input
                    id="edit-wilayah"
                    value={editingDatel.wilayah}
                    onChange={(e) =>
                      setEditingDatel((prev) =>
                        prev ? { ...prev, wilayah: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-kategori" className="text-right">
                    Kategori
                  </Label>
                  <Select
                    value={editingDatel.kategori}
                    onValueChange={(value: 'HERO' | 'NON_HERO') =>
                      setEditingDatel((prev) =>
                        prev ? { ...prev, kategori: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HERO">HERO</SelectItem>
                      <SelectItem value="NON_HERO">NON HERO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-subArea" className="text-right w-full">
                    Sub Area
                  </Label>
                  <Select
                    value={editingDatel.subArea}
                    onValueChange={(value: 'INNER' | 'OUTER') =>
                      setEditingDatel((prev) =>
                        prev ? { ...prev, subArea: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Pilih sub area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INNER">INNER</SelectItem>
                      <SelectItem value="OUTER">OUTER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleSaveEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter nama STO..."
              value={
                (table.getColumn('namaSto')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('namaSto')?.setFilterValue(event.target.value)
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
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
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
                      Tidak ada Data.
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
                value={pagination.limit.toString()}
                onValueChange={(value) =>
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                    limit: Number(value),
                  }))
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
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
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    className={
                      pagination.page <= 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => {
                  const isCurrentPage = pagination.page === page;
                  const shouldShow =
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 1;

                  if (
                    !shouldShow &&
                    page !== 2 &&
                    page !== pagination.totalPages - 1
                  ) {
                    if (page === 3 || page === pagination.totalPages - 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: page,
                          }))
                        }
                        isActive={isCurrentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    className={
                      pagination.page >= pagination.totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Main>
    </>
  );
}
