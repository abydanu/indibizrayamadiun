'use client';

import * as React from 'react';
import { Main } from '@/features/smartsync-dashboard/components/main';
import { PageHeader, PageTitle } from '@/shared/components/page-layout';
import {
  HybridDataTable,
  TableSkeleton,
  ActionDropdown,
  type ServerPaginationState,
} from '@/shared/components/data-table';
import { FormDialog, FormField } from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/shared/ui/checkbox';
import { Badge } from '@/shared/ui/badge';
import type { Datel } from '@/features/smartsync-dashboard/types/datel';
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';

const datelSkeletonColumns = [
  { width: 'w-4', height: 'h-4' }, // checkbox
  { width: 'w-[150px]', height: 'h-4' }, // nama
  { width: 'w-[100px]', height: 'h-4' }, // kode sto
  { width: 'w-[120px]', height: 'h-4' }, // wilayah
  { width: 'w-[80px]', height: 'h-6', rounded: true }, // kategori
  { width: 'w-[70px]', height: 'h-6', rounded: true }, // sub area
  { width: 'w-8', height: 'h-8' }, // actions
];

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
    accessorKey: 'nama',
    header: () => <span className="font-extrabold">Nama</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('nama')}</div>
    ),
  },
  {
    accessorKey: 'kode_sto',
    header: () => <span className="font-extrabold">Kode STO</span>,
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue('kode_sto')}</div>
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
    accessorKey: 'categori',
    header: () => <span className="font-extrabold">Kategori</span>,
    cell: ({ row }) => {
      const kategori = row.getValue('categori') as string;
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
    accessorKey: 'sub_area',
    header: () => <span className="font-extrabold">Sub Area</span>,
    cell: ({ row }) => {
      const subArea = row.getValue('sub_area') as string;
      return (
        <Badge
          variant="outline"
          className="capitalize font-medium text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50"
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
        <ActionDropdown
          onEdit={() => handleEditDatel(datel)}
          onDelete={() => handleDeleteDatel(datel.id)}
          itemName={datel.nama}
          isSubmitting={isSubmitting}
        />
      );
    },
  },
];

export default function ManageDatel() {
  const [datels, setDatels] = React.useState<Datel[]>([]);
  const [editingDatel, setEditingDatel] = React.useState<Datel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newDatel, setNewDatel] = React.useState<Omit<Datel, 'id'>>({
    nama: '',
    kode_sto: '',
    wilayah: '',
    categori: 'HERO',
    sub_area: 'INNER',
  });
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchDatels = React.useCallback(async (page?: number, limit?: number) => {
    setLoading(true);
    try {
      const currentPage = page || pagination.page;
      const currentLimit = limit || pagination.limit;
      
      const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/datel?page=${currentPage}&limit=${currentLimit}`);
      const data = res.data.result;
      setDatels(data.data);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching datels:', error);
      toast.error('Gagal memuat data datel');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  const handlePaginationChange = (page: number, limit: number) => {
    fetchDatels(page, limit);
  };

  const handleEditDatel = (datel: Datel) => {
    setEditingDatel(datel);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDatel = async (datelId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/datel/${datelId}`
      );
      if (res.ok) {
        await fetchDatels();
        toast.success('Datel berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting datel:', error);
      toast.error('Gagal menghapus datel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDatel = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/datel`,
        newDatel
      );
      if (res.ok) {
        await fetchDatels();
        toast.success('Datel berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewDatel({
          nama: '',
          kode_sto: '',
          wilayah: '',
          categori: 'HERO',
          sub_area: 'INNER',
        });
      }
    } catch (error) {
      console.error('Error adding datel:', error);
      toast.error('Error saat menambahkan datel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (datelId: string) => {
    if (!editingDatel) return;

    setIsSubmitting(true);
    const updateData = {
      kode_sto: editingDatel.kode_sto,
      nama: editingDatel.nama,
      categori: editingDatel.categori,
      wilayah: editingDatel.wilayah,
      sub_area: editingDatel.sub_area,
    };

    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/datel/${datelId}`,
        updateData
      );
      if (res.ok) {
        await fetchDatels();
        toast.success('Datel berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingDatel(null);
      }
    } catch (error) {
      console.error('Error updating datel:', error);
      toast.error('Gagal memperbarui datel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFormFields: FormField[] = [
    {
      id: 'nama_datel',
      label: 'Nama Datel',
      type: 'text',
      value: newDatel.nama,
      onChange: (value) => setNewDatel((prev) => ({ ...prev, nama: value })),
      required: true,
      placeholder: 'Masukkan nama datel',
    },
    {
      id: 'kode_sto',
      label: 'Kode STO',
      type: 'text',
      value: newDatel.kode_sto,
      onChange: (value) =>
        setNewDatel((prev) => ({ ...prev, kode_sto: value })),
      required: true,
      placeholder: 'Masukkan kode STO',
    },
    {
      id: 'wilayah',
      label: 'Wilayah',
      type: 'text',
      value: newDatel.wilayah,
      onChange: (value) => setNewDatel((prev) => ({ ...prev, wilayah: value })),
      required: true,
      placeholder: 'Masukkan wilayah',
    },
    {
      id: 'categori',
      label: 'Kategori',
      type: 'select',
      value: newDatel.categori,
      onChange: (value) =>
        setNewDatel((prev) => ({ ...prev, categori: value })),
      options: [
        { value: 'HERO', label: 'HERO' },
        { value: 'NON_HERO', label: 'NON HERO' },
      ],
      required: true,
    },
    {
      id: 'sub_area',
      label: 'Sub Area',
      type: 'select',
      value: newDatel.sub_area,
      onChange: (value) =>
        setNewDatel((prev) => ({ ...prev, sub_area: value })),
      options: [
        { value: 'INNER', label: 'INNER' },
        { value: 'OUTER', label: 'OUTER' },
      ],
      required: true,
    },
  ];

  const editFormFields: FormField[] = editingDatel
    ? [
        {
          id: 'edit-nama_datel',
          label: 'Nama Datel',
          type: 'text',
          value: editingDatel.nama,
          onChange: (value) =>
            setEditingDatel((prev) => (prev ? { ...prev, nama: value } : null)),
          required: true,
          placeholder: 'Masukkan nama datel',
        },
        {
          id: 'edit-kode_sto',
          label: 'Kode STO',
          type: 'text',
          value: editingDatel.kode_sto,
          onChange: (value) =>
            setEditingDatel((prev) =>
              prev ? { ...prev, kode_sto: value } : null
            ),
          required: true,
          placeholder: 'Masukkan kode STO',
        },
        {
          id: 'edit-wilayah',
          label: 'Wilayah',
          type: 'text',
          value: editingDatel.wilayah,
          onChange: (value) =>
            setEditingDatel((prev) =>
              prev ? { ...prev, wilayah: value } : null
            ),
          required: true,
          placeholder: 'Masukkan wilayah',
        },
        {
          id: 'edit-categori',
          label: 'Kategori',
          type: 'select',
          value: editingDatel.categori,
          onChange: (value) =>
            setEditingDatel((prev) =>
              prev ? { ...prev, categori: value } : null
            ),
          options: [
            { value: 'HERO', label: 'HERO' },
            { value: 'NON_HERO', label: 'NON HERO' },
          ],
          required: true,
        },
        {
          id: 'edit-sub_area',
          label: 'Sub Area',
          type: 'select',
          value: editingDatel.sub_area,
          onChange: (value) =>
            setEditingDatel((prev) =>
              prev ? { ...prev, sub_area: value } : null
            ),
          options: [
            { value: 'INNER', label: 'INNER' },
            { value: 'OUTER', label: 'OUTER' },
          ],
          required: true,
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditDatel, handleDeleteDatel, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchDatels();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader title="Kelola Datel" />
      <Main>
        <PageTitle
          title="Kelola Datel"
          description="Kelola data datel (Divisi Akses Telekomunikasi)"
          showAddButton
          addButtonText="Tambah Datel"
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        <FormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Datel Baru"
          description="Buat data datel baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddDatel}
          submitText="Tambah Datel"
          isSubmitting={isSubmitting}
        />

        {/* Edit Datel Dialog */}
        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Datel"
          description="Ubah informasi datel. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={() => handleSaveEdit(editingDatel?.id)}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        <HybridDataTable
          columns={columns}
          data={datels}
          loading={loading}
          searchKey="nama"
          searchPlaceholder="Cari Datel..."
          emptyMessage="Tidak ada data datel."
          loadingComponent={<TableSkeleton columns={datelSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
