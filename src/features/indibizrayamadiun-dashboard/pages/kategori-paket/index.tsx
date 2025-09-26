'use client';

import * as React from 'react';
import { Main } from '@/features/indibizrayamadiun-dashboard/components/main';
import { PageHeader, PageTitle } from '@/shared/components/page-layout';
import {
  DataTable,
  TableSkeleton,
  ActionDropdown,
  type ServerPaginationState,
} from '@/shared/components/data-table';
import { FormDialog, FormField } from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import type { KategoriPaket } from '../../types/kategori-paket';
import type { ApiResult } from '../../types/api';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';

const kategoriSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[200px]', height: 'h-4' },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditKategori: (kategori: KategoriPaket) => void,
  handleDeleteKategori: (kategoriId: string) => void,
  isSubmitting: boolean
): ColumnDef<KategoriPaket>[] => [
    {
      id: 'select',
      header: "#",
      cell: ({ row }) => row.index + 1,
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
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
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

        const res = await api.get<ApiResult<KategoriPaket>>(
          `${process.env.NEXT_PUBLIC_API_URL}/categori?page=${currentPage}&limit=${currentLimit}`
        );
        const data = res.data.result;
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
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKategori = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categori`,
        newKategori
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
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [importFile, setImportFile] = React.useState<File | null>(null);

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categori/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        fetchKategoris();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
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
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          addButtonText="Tambah Data"
          showImportButton
          importButtonText="Import Data"
          onImportClick={() => setIsImportDialogOpen(true)}
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        <FormDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          title="Import Kategori Paket dari Excel"
          description="Upload file Excel sesuai template yang disediakan."
          fields={[
            {
              id: 'file',
              label: 'File Excel',
              type: 'custom',
              customComponent: (
                <div className="col-span-3">
                  <CustomFileInput
                    id="agency-import"
                    value={importFile as any}
                    onChange={(file) => setImportFile(file)}
                    accept=".xls,.xlsx,.csv"
                  />
                  <div className="text-xs text-gray-500 mt-2">Format: .xls, .xlsx, .csv</div>
                </div>
              ),
            } as FormField,
          ]}
          onSubmit={handleImport}
          submitText="Upload"
          isSubmitting={isSubmitting}
        />

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

        <DataTable
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
