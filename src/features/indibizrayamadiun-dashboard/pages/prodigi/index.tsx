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
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import { ApiResult } from '../../types/api';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';
import { Prodigi } from '../../types/prodigi';

const prodigiSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditPromo: (promo: Prodigi) => void,
  handleDeletePromo: (promoId: string) => void,
  isSubmitting: boolean
): ColumnDef<Prodigi>[] => [
  {
    id: 'select',
    header: '#',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nama',
    header: () => <span className="font-extrabold">Nama Produk</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('nama')}</div>
    ),
  },
{
    accessorKey: 'harga',
    header: () => <span className="font-extrabold">Harga</span>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue('harga') as string);
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const promo = row.original;
      return (
        <ActionDropdown
          onEdit={() => handleEditPromo(promo)}
          onDelete={() => handleDeletePromo(promo.id)}
          itemName={promo.nama}
          isSubmitting={isSubmitting}
        />
      );
    },
  },
];

export default function ManageProdigi() {
  const [promos, setPromos] = React.useState<Prodigi[]>([]);
  const [editingPromo, setEditingPromo] = React.useState<Prodigi | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [newProdigi, setNewProdigi] = React.useState<Omit<Prodigi, 'id' | 'created_at' | 'updated_at' | 'paket_id'>>({
    nama: '',
    harga: 0,
    aktif: true,
  });
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const getProdigi = React.useCallback(
    async (page?: number, limit?: number) => {
      setIsLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;
        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/prodigi?page=${currentPage}&limit=${currentLimit}`
        );
        const data = (res.data as ApiResult<Prodigi>).result;
        setPromos(data.data as any);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (error: any) {
        toast.error('Gagal memuat data prodigi');
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  const handlePaginationChange = (page: number, limit: number) => {
    getProdigi(page, limit);
  };

  const addProdigi = async () => {
    try {
      setIsSubmitting(true);

      const formData = {
        ...newProdigi,
        harga: parseFloat(newProdigi.harga.toString())
      };

      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/prodigi`,
        formData
      );

      if (res.ok) {
        await getProdigi();
        setIsAddDialogOpen(false);
        setNewProdigi({
          nama: '',
          harga: '',
          aktif: true
        });
        toast.success('Prodigi berhasil ditambahkan');
      }
    } catch (error: any) {
      console.error('Failed to add promo:', error.message);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus Prodigi'
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
        `${process.env.NEXT_PUBLIC_API_URL}/prodigi/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        getProdigi();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProdigi = async (promoId: string) => {
    try {
      setIsSubmitting(true);
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/prodigi/${promoId}`
      );

      if (res.ok) {
        await getProdigi();
        toast.success('Prodigi berhasil dihapus');
      }
    } catch (error: any) {
      console.error('Failed to delete promo:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus prodigi'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProdigi = (prodigi: Prodigi) => {
    setEditingPromo(prodigi);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProdigi = (prodigiId: string) => {
    deleteProdigi(prodigiId);
  };

  const handleSaveEdit = async (id: string | undefined) => {
    if (!editingPromo || !id) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...editingPromo,
        harga: parseFloat(String(editingPromo.harga)),
      };
      const response = await api.put(`/prodigi/${id}`, payload);

      if (response.ok) {
        await getProdigi();
        setIsEditDialogOpen(false);
        setEditingPromo(null);
        toast.success('Prodigi berhasil diperbarui');
      }
    } catch (error: any) {
      console.error('Failed to update prodigi:', error.message);
      toast.error('Gagal memperbarui prodigi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPromo = () => {
    addProdigi();
  };

  const addFormFields: FormField[] = [
    {
      id: 'namaProdigi',
      label: 'Nama Produk',
      type: 'text',
      value: newProdigi.nama,
      onChange: (value) => setNewProdigi((prev) => ({ ...prev, nama: value })),
      required: true,
    },
    {
      id: 'harga',
      label: 'Harga',
      type: 'number',
      value: newProdigi.harga,
      onChange: (value) =>
        setNewProdigi((prev) => ({ ...prev, harga: value })),
      required: true,
    },
  ];

  const editFormFields: FormField[] = editingPromo
    ? [
        {
          id: 'edit-namaProdigi',
          label: 'Nama Produk',
          type: 'text',
          value: editingPromo.nama,
          onChange: (value) =>
            setEditingPromo((prev) => (prev ? { ...prev, nama: value } : null)),
          required: true,
        },
        {
          id: 'edit-harga',
          label: 'Harga',
          type: 'number',
          value: editingPromo.harga,
          onChange: (value) =>
            setEditingPromo((prev) =>
              prev ? { ...prev, harga: value } : null
            ),
          required: true,
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditProdigi, handleDeleteProdigi, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    getProdigi();
  }, []);

  return (
    <>
      <PageHeader title="Kelola Prodigi" />
      <Main>
        <PageTitle
          title="Kelola Produk Digital (Prodigi)"
          description="Kelola Produk Digital (Prodigi) yang tersedia untuk pelanggan Indibiz Raya Madiun."
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
          title="Import Prodigi dari Excel"
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
                  <div className="text-xs text-gray-500 mt-2">
                    Format: .xls, .xlsx{' '}
                  </div>
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
          title="Tambah Prodigi Baru"
          description="Buat Prodigi baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddPromo}
          submitText="Tambah Data"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Prodigi"
          description="Ubah informasi Prodigi. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={() => handleSaveEdit(editingPromo?.id)}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        <DataTable
          columns={columns}
          data={promos}
          loading={isLoading}
          searchKey="nama"
          searchPlaceholder="Cari Prodigi..."
          emptyMessage="No results."
          loadingComponent={<TableSkeleton columns={prodigiSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
