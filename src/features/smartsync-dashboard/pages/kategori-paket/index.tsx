'use client';

import * as React from 'react';
import { Main } from '@/features/smartsync-dashboard/components/main';
import { PageHeader, PageTitle } from '@/shared/components/page-layout';
import {
  DataTable,
  TableSkeleton,
  ActionDropdown,
} from '@/shared/components/data-table';
import { FormDialog, FormField } from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/shared/ui/checkbox';
import type { KategoriPaket } from '../../types/kategori-paket';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';
import {
  HybridDataTable,
  ServerPaginationState,
} from '@/shared/components/data-table/hybrid-data-table';

// Skeleton configuration untuk tabel kategori paket
const kategoriSkeletonColumns = [
  { width: 'w-4', height: 'h-4' }, // checkbox
  { width: 'w-[200px]', height: 'h-4' }, // nama kategori
  { width: 'w-8', height: 'h-8' }, // actions
];

export const createColumns = (
  handleEditKategori: (kategori: KategoriPaket) => void,
  handleDeleteKategori: (kategoriId: string) => void,
  isSubmitting: boolean
): ColumnDef<KategoriPaket>[] => [
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
    header: () => <span className="font-extrabold">Nama Kategori</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('nama')}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const kategori = row.original;
      return (
        <ActionDropdown
          onEdit={() => handleEditKategori(kategori)}
          onDelete={() => handleDeleteKategori(kategori.id)}
          itemName={kategori.nama}
          isSubmitting={isSubmitting}
        />
      );
    },
  },
];

export default function ManageKategoriPaket() {
  const [kategoris, setKategoris] = React.useState<KategoriPaket[]>([]);
  const [editingKategori, setEditingKategori] =
    React.useState<KategoriPaket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newKategori, setNewKategori] = React.useState<
    Omit<KategoriPaket, 'id' | 'created_at' | 'updated_at'>
  >({
    nama: '',
  });
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchKategoris = React.useCallback(
    async (page?: number, limit?: number) => {
      setLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;

        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categori?page=${currentPage}&limit=${currentLimit}`,
          { requireAuth: true }
        );
        const data = res.data.result as any;
        setKategoris(data.data);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (error) {
        console.error('Error fetching kategoris:', error);
        toast.error('Gagal memuat data kategori');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  const handleEditKategori = (kategori: KategoriPaket) => {
    setEditingKategori(kategori);
    setIsEditDialogOpen(true);
  };

  const handleDeleteKategori = async (kategoriId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/categori/${kategoriId}`
      );
      if (res.ok) {
        await fetchKategoris();
        toast.success('Kategori berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting kategori:', error);
      toast.error('Gagal menghapus kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKategori = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categori`,
        newKategori,
        { requireAuth: true }
      );
      if (res.ok) {
        await fetchKategoris();
        toast.success('Kategori berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewKategori({ nama: '' });
      } else {
        toast.error('Gagal menambahkan kategori');
      }
    } catch (error) {
      console.error('Error adding kategori:', error);
      toast.error('Error saat menambahkan kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaginationChange = (page: number, limit: number) => {
    fetchKategoris(page, limit);
  };

  const handleSaveEdit = async () => {
    if (!editingKategori) return;

    setIsSubmitting(true);
    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/categori/${editingKategori.id}`,
        editingKategori
      );
      if (res.ok) {
        await fetchKategoris();
        toast.success('Kategori berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingKategori(null);
      }
    } catch (error) {
      console.error('Error updating kategori:', error);
      toast.error('Gagal memperbarui kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form fields untuk add kategori
  const addFormFields: FormField[] = [
    {
      id: 'nama_kategori',
      label: 'Nama Kategori',
      type: 'text',
      value: newKategori.nama,
      onChange: (value) => setNewKategori((prev) => ({ ...prev, nama: value })),
      required: true,
      placeholder: 'Masukkan nama kategori',
    },
  ];

  // Form fields untuk edit kategori
  const editFormFields: FormField[] = editingKategori
    ? [
        {
          id: 'edit-nama_kategori',
          label: 'Nama Kategori',
          type: 'text',
          value: editingKategori.nama,
          onChange: (value) =>
            setEditingKategori((prev) =>
              prev ? { ...prev, nama: value } : null
            ),
          required: true,
          placeholder: 'Masukkan nama kategori',
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditKategori, handleDeleteKategori, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchKategoris();
  }, [fetchKategoris]);

  return (
    <>
      <PageHeader title="Kelola Kategori Paket" />
      <Main>
        <PageTitle
          title="Kelola Kategori Paket"
          description="Kelola kategori paket internet Indibiz"
          showAddButton
          addButtonText="Tambah Kategori"
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        {/* Add Kategori Dialog */}
        <FormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Kategori Baru"
          description="Buat kategori paket baru. Isi informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddKategori}
          submitText="Tambah Kategori"
          isSubmitting={isSubmitting}
        />

        {/* Edit Kategori Dialog */}
        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Kategori"
          description="Ubah informasi kategori. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={handleSaveEdit}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        {/* Data Table */}
        <HybridDataTable
          columns={columns}
          data={kategoris}
          loading={loading}
          searchKey="nama"
          searchPlaceholder="Cari Kategori..."
          emptyMessage="Tidak ada data kategori."
          loadingComponent={<TableSkeleton columns={kategoriSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
