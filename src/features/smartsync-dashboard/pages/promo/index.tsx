'use client';

import * as React from 'react';
import { Header } from '@/features/smartsync-dashboard/components/header';
import { Main } from '@/features/smartsync-dashboard/components/main';
import { Separator } from '@/shared/ui/separator';
import { ThemeSwitch } from '@/shared/components/theme-switch';
import {
  PageBreadcrumb,
  generateBreadcrumbItems,
} from '@/shared/components/page-breadcrumb';
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
import {
  ChevronDown,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Settings2,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import { Textarea } from '@/shared/ui/textarea';
import { Skeleton } from '@/shared/ui/skeleton';
import { type Promo } from './types/promo';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { DatePicker } from '@/shared/components/date-picker';

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
          <Skeleton className="h-6 w-[80px] rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-[80px] rounded-full" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-8" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export const createColumns = (
  handleEditPromo: (promo: Promo) => void,
  handleDeletePromo: (promoId: string) => void,
  isSubmitting: boolean
): ColumnDef<Promo>[] => [
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
    accessorKey: 'namaPromo',
    header: () => {
      return <span className="font-extrabold">Nama Promo</span>;
    },
    cell: ({ row }) => {
      const value = row.getValue('namaPromo') as string;
      const formatted = value.replace(/_/g, ' ');
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'deskripsi',
    header: () => {
      return <span className="font-extrabold">Deskripsi</span>;
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('deskripsi')}</div>
    ),
  },
  {
    accessorKey: 'jenis',
    header: () => {
      return <span className="font-extrabold">Jenis</span>;
    },
    cell: ({ row }) => {
      const jenis = row.getValue('jenis') as string;
      return (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${
            jenis === 'DISKON'
              ? 'text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950/50'
              : jenis === 'CASHBACK'
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-purple-700 border-purple-200 bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:bg-purple-950/50'
          }`}
        >
          {jenis}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'nilai',
    header: () => {
      return <span className="font-extrabold">Nilai</span>;
    },
    cell: ({ row }) => {
      const nilai = parseFloat(row.getValue('nilai'));
      return <div className="font-medium">{nilai}%</div>;
    },
  },
  {
    accessorKey: 'mulai',
    header: () => {
      return <span className="font-extrabold">Tanggal Mulai</span>;
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('mulai'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    accessorKey: 'berakhir',
    header: () => {
      return <span className="font-extrabold">Tanggal Berakhir</span>;
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('berakhir'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    accessorKey: 'isGlobal',
    header: () => <span className="font-extrabold">Global</span>,
    cell: ({ row }) => {
      const isGlobal = row.getValue('isGlobal') as boolean;
      return (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${
            isGlobal
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-gray-700 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-950/50'
          }`}
        >
          {isGlobal ? 'Ya' : 'Tidak'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const promo = row.original;
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
            <DropdownMenuItem onClick={() => handleEditPromo(promo)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit promo
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete promo
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the promo "{promo.namaPromo}" and remove their data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeletePromo(promo.id)}
                    disabled={isSubmitting}
                  >
                    Delete
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

export default function ManagePromo() {
  const pathname = '/agency/promo';
  const breadcrumbItems = generateBreadcrumbItems(pathname);
  const [rowSelection, setRowSelection] = React.useState({});
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [editingPromo, setEditingPromo] = React.useState<Promo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newPromo, setNewPromo] = React.useState<Omit<Promo, 'id'>>({
    namaPromo: '',
    jenis: 'DISKON',
    nilai: '',
    deskripsi: '',
    mulai: '',
    berakhir: '',
    isGlobal: false,
  });
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [editStartDate, setEditStartDate] = React.useState<Date | undefined>();
  const [editEndDate, setEditEndDate] = React.useState<Date | undefined>();
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getPromos = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `/promos?page=${pagination.page}&limit=${pagination.limit}`,
        { requireAuth: true }
      );
      setPromos(res.data.result.data);
    } catch (error: any) {
      toast.error('Gagal memuat data promo');
    } finally {
      setIsLoading(false);
    }
  };

  const addPromo = async () => {
    try {
      setIsSubmitting(true);

      const formData = {
        ...newPromo,
        nilai: parseFloat(newPromo.nilai as any),
        mulai: startDate ? startDate.toISOString() : '',
        berakhir: endDate ? endDate.toISOString() : '',
      };

      const res = await api.post('/promos', formData, { requireAuth: true });

      if (res.ok) {
        await getPromos();
        setIsAddDialogOpen(false);
        setNewPromo({
          namaPromo: '',
          jenis: 'DISKON',
          nilai: '',
          deskripsi: '',
          mulai: '',
          berakhir: '',
          isGlobal: false,
        });
        setStartDate(undefined);
        setEndDate(undefined);
        toast.success('Promo berhasil ditambahkan');
      }
    } catch (error: any) {
      console.error('Failed to add promo:', error.message);
      toast.error('Gagal menambahkan promo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePromo = async () => {
    if (!editingPromo) return;
    try {
      setIsSubmitting(true);
      const updateData = {
        namaPromo: editingPromo.namaPromo,
        jenis: editingPromo.jenis,
        nilai: parseFloat(editingPromo.nilai),
        deskripsi: editingPromo.deskripsi,
        mulai: editStartDate ? editStartDate.toISOString() : editingPromo.mulai,
        berakhir: editEndDate
          ? editEndDate.toISOString()
          : editingPromo.berakhir,
        isGlobal: editingPromo.isGlobal,
      };

      const res = await api.put(`/promos/${editingPromo.id}`, updateData, {
        requireAuth: true,
      });

      if (res.ok) {
        await getPromos();
        setIsEditDialogOpen(false);
        setEditingPromo(null);
        toast.success('Promo berhasil diperbarui');
      }
    } catch (error: any) {
      console.error('Failed to update promo:', error.message);
      toast.error('Gagal memperbarui promo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePromo = async (promoId: string) => {
    try {
      setIsSubmitting(true);
      const res = await api.delete(`/promos/${promoId}`, { requireAuth: true });

      if (res.ok) {
        await getPromos();
        toast.success('Promo berhasil dihapus');
      }
    } catch (error: any) {
      console.error('Failed to delete promo:', error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Gagal menghapus promo';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setEditStartDate(new Date(promo.mulai));
    setEditEndDate(new Date(promo.berakhir));
    setIsEditDialogOpen(true);
  };

  const handleDeletePromo = (promoId: string) => {
    deletePromo(promoId);
  };

  const handleSaveEdit = () => {
    updatePromo();
  };

  const handleAddPromo = () => {
    addPromo();
  };

  const columns = React.useMemo(
    () => createColumns(handleEditPromo, handleDeletePromo, isSubmitting),
    [isSubmitting]
  );

  const table = useReactTable({
    data: promos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      rowSelection,
    },
  });

  React.useEffect(() => {
    getPromos();
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
              Kelola Promo
            </h1>
            <p className="text-muted-foreground">
              Kelola promo dan diskon paket Indibiz
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Promo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Promo Baru</DialogTitle>
                <DialogDescription>
                  Buat promo baru. Isi semua informasi yang diperlukan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="namaPromo" className="text-right">
                    Nama Promo
                  </Label>
                  <Input
                    id="namaPromo"
                    value={newPromo.namaPromo}
                    onChange={(e) =>
                      setNewPromo((prev) => ({
                        ...prev,
                        namaPromo: e.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="jenis" className="text-right">
                    Jenis
                  </Label>
                  <Select
                    value={newPromo.jenis}
                    onValueChange={(value: 'DISKON' | 'CASHBACK' | 'GRATIS') =>
                      setNewPromo((prev) => ({ ...prev, jenis: value }))
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DISKON">Diskon</SelectItem>
                      <SelectItem value="CASHBACK">Cashback</SelectItem>
                      <SelectItem value="GRATIS">Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nilai" className="text-right">
                    Nilai (%)
                  </Label>
                  <Input
                    id="nilai"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={newPromo.nilai}
                    onChange={(e) =>
                      setNewPromo((prev) => ({
                        ...prev,
                        nilai: e.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deskripsi" className="text-right">
                    Deskripsi
                  </Label>
                  <Input
                    id="deskripsi"
                    value={newPromo.deskripsi}
                    onChange={(e) =>
                      setNewPromo((prev) => ({
                        ...prev,
                        deskripsi: e.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mulai" className="text-right">
                    Tanggal Mulai
                  </Label>
                  <div className="col-span-3">
                    <DatePicker
                      date={startDate}
                      onSelect={setStartDate}
                      placeholder="Pilih tanggal mulai"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="berakhir" className="text-right">
                    Tanggal Berakhir
                  </Label>
                  <div className="col-span-3">
                    <DatePicker
                      date={endDate}
                      onSelect={setEndDate}
                      placeholder="Pilih tanggal berakhir"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isGlobal" className="text-right">
                    Global
                  </Label>
                  <Select
                    value={newPromo.isGlobal.toString()}
                    onValueChange={(value) =>
                      setNewPromo((prev) => ({
                        ...prev,
                        isGlobal: value === 'true',
                      }))
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih status global" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ya</SelectItem>
                      <SelectItem value="false">Tidak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddPromo}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menambahkan...' : 'Tambah Promo'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Promo Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Promo</DialogTitle>
              <DialogDescription>
                Ubah informasi promo. Klik simpan setelah selesai.
              </DialogDescription>
            </DialogHeader>
            {editingPromo && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-namaPromo" className="text-right">
                    Nama Promo
                  </Label>
                  <Input
                    id="edit-namaPromo"
                    value={editingPromo.namaPromo}
                    onChange={(e) =>
                      setEditingPromo((prev) =>
                        prev ? { ...prev, namaPromo: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-jenis" className="text-right">
                    Jenis
                  </Label>
                  <Select
                    value={editingPromo.jenis}
                    onValueChange={(value: 'DISKON' | 'CASHBACK' | 'BONUS') =>
                      setEditingPromo((prev) =>
                        prev ? { ...prev, jenis: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DISKON">Diskon</SelectItem>
                      <SelectItem value="CASHBACK">Cashback</SelectItem>
                      <SelectItem value="GRATIS">Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-nilai" className="text-right">
                    Nilai (%)
                  </Label>
                  <Input
                    id="edit-nilai"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={editingPromo.nilai}
                    onChange={(e) =>
                      setEditingPromo((prev) =>
                        prev ? { ...prev, nilai: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-deskripsi" className="text-right">
                    Deskripsi
                  </Label>
                  <Input
                    id="edit-deskripsi"
                    value={editingPromo.deskripsi}
                    onChange={(e) =>
                      setEditingPromo((prev) =>
                        prev ? { ...prev, deskripsi: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-mulai" className="text-right">
                    Tanggal Mulai
                  </Label>
                  <div className="col-span-3">
                    <DatePicker
                      date={editStartDate}
                      onSelect={setEditStartDate}
                      placeholder="Pilih tanggal mulai"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-berakhir" className="text-right">
                    Tanggal Berakhir
                  </Label>
                  <div className="col-span-3">
                    <DatePicker
                      date={editEndDate}
                      onSelect={setEditEndDate}
                      placeholder="Pilih tanggal berakhir"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-isGlobal" className="text-right">
                    Global
                  </Label>
                  <Select
                    value={editingPromo.isGlobal.toString()}
                    onValueChange={(value) =>
                      setEditingPromo((prev) =>
                        prev ? { ...prev, isGlobal: value === 'true' } : null
                      )
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih status global" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ya</SelectItem>
                      <SelectItem value="false">Tidak</SelectItem>
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
              placeholder="Filter nama promo..."
              value={
                (table.getColumn('namaPromo')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('namaPromo')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
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
