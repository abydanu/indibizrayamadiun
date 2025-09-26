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
import CustomFileInput from '@/shared/components/custom/custom-file-input';
import { ColumnDef } from '@tanstack/react-table';
import type { AgencyDisplay } from '../../types/agency';
import type { ApiResult } from '../../types/api';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';
import { getDisplayErrorMessage } from '@/utils/api-error';

const agencSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[200px]', height: 'h-4' },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditKategori: (kategori: AgencyDisplay) => void,
  handleDeleteKategori: (kategoriId: string) => void,
  isSubmitting: boolean
): ColumnDef<AgencyDisplay>[] => [
  {
    id: 'select',
    header: "#",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nama',
    header: () => <span className="font-extrabold">Nama Agency</span>,
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

export default function ManageAgencyDisplay() {
  const [kategoris, setKategoris] = React.useState<AgencyDisplay[]>([]);
  const [editingAgenc, setEditingAgenc] = React.useState<AgencyDisplay | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newAgenc, setNewAgenc] = React.useState<
    Omit<AgencyDisplay, 'id' | 'created_at' | 'updated_at'>
  >({
    nama: '',
  });
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const fetchAgency = React.useCallback(
    async (page?: number, limit?: number) => {
      setLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;
        const res = await api.get<ApiResult<AgencyDisplay>>(
          `${process.env.NEXT_PUBLIC_API_URL}/agenc?page=${currentPage}&limit=${currentLimit}`
        );

        const data = (res.data as ApiResult<AgencyDisplay>).result;
        setKategoris(data.data);
        setPagination({
          page: res.data.result.pagination.page,
          limit: res.data.result.pagination.limit,
          total: res.data.result.pagination.total,
          totalPages: res.data.result.pagination.totalPages,
        });
      } catch (error) {
        console.error('Error fetching Agency:', error);
        toast.error('Gagal memuat data Agency');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handlePaginationChange = (page: number, limit: number) => {
    fetchAgency(page, limit);
  };

  const handleEditAgency = (agency: AgencyDisplay) => {
    setEditingAgenc(agency);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAgency = async (agencyId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/agenc/${agencyId}`
      );
      if (res.ok) {
        await fetchAgency();
        toast.success('Agency berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting Agency:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAgency = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/agenc`,
        newAgenc
      );
      if (res.ok) {
        await fetchAgency();
        toast.success('Agency berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewAgenc({ nama: '' });
      } else {
        toast.error('Gagal menambahkan Agency');
      }
    } catch (error) {
      console.error('Error adding Agency:', error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/agenc/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        fetchAgency();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingAgenc) return;

    setIsSubmitting(true);
    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/agenc/${editingAgenc.id}`,
        editingAgenc
      );
      if (res.ok) {
        await fetchAgency();
        toast.success('Agency berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingAgenc(null);
      }
    } catch (error) {
      console.error('Error updating Agency:', error);
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
      id: 'nama_agency',
      label: 'Nama Agency',
      type: 'text',
      value: newAgenc.nama,
      onChange: (value) => setNewAgenc((prev) => ({ ...prev, nama: value })),
      required: true,
      placeholder: 'Masukkan nama Agency',
    },
  ];

  const editFormFields: FormField[] = editingAgenc
    ? [
        {
          id: 'edit-nama_agency',
          label: 'Nama Agency',
          type: 'text',
          value: editingAgenc.nama,
          onChange: (value) =>
            setEditingAgenc((prev) => (prev ? { ...prev, nama: value } : null)),
          required: true,
          placeholder: 'Masukkan nama Agency',
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditAgency, handleDeleteAgency, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchAgency();
  }, [fetchAgency]);

  return (
    <>
      <PageHeader title="Kelola Daftar Agency" />
      <Main>
        <PageTitle
          title="Kelola Daftar Agency"
          description="Kelola Daftar Agency Telkom Madiun Raya"
          showAddButton
          addButtonText="Tambah Data"
          showImportButton
          importButtonText="Import Data"
          onImportClick={() => setIsImportDialogOpen(true)}
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        <FormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          title="Tambah Data Baru"
          description="Buat data baru. Isi informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddAgency}
          submitText="Tambah Agency"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          title="Import Agency dari Excel"
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
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Agency"
          description="Ubah informasi Agency. Klik simpan setelah selesai."
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
          searchPlaceholder="Cari Agency..."
          emptyMessage="Tidak ada data Agency."
          loadingComponent={<TableSkeleton columns={agencSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
