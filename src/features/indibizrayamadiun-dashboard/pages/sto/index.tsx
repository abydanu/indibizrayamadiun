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
import {
  FormDialog,
  FormField,
} from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import type { STO } from '@/features/indibizrayamadiun-dashboard/types/sto';
import type { ApiResult } from '../../types/api';
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';
import { Datel } from '../../types/datel';

const stoSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[200px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditSto: (sto: STO) => void,
  handleDeleteSto: (stoId: string) => void,
  isSubmitting: boolean
): ColumnDef<STO>[] => [
  {
    id: 'select',
    header: '#',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: () => <span className="font-extrabold">Nama STO</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'abbreviation',
    header: () => <span className="font-extrabold">STO</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('abbreviation')}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const sto = row.original;
      return (
        <ActionDropdown
          onEdit={() => handleEditSto(sto)}
          onDelete={() => handleDeleteSto(sto.id)}
          itemName={sto.name}
          isSubmitting={isSubmitting}
        />
      );
    },
  },
];

export default function ManageSTO() {
  const [sto, setSTO] = React.useState<STO[]>([]);
  const [editingSTO, setEditingSTO] = React.useState<STO | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [datels, setDatels] = React.useState<Datel[]>([]);
  const [newSTO, setNewSTO] = React.useState<Omit<STO, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    abbreviation: '',
  });
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchSTO = React.useCallback(
    async (page?: number, limit?: number) => {
      setLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;

        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/sto?page=${currentPage}&limit=${currentLimit}`
        );
        const data = (res.data as ApiResult<STO>).result;
        setSTO(data.data);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (error) {
        console.error('Error fetching STO:', error);
        toast.error('Gagal memuat data STO');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  const handlePaginationChange = (page: number, limit: number) => {
    fetchSTO(page, limit);
  };

  const handleEditSto = (sto: STO) => {
    setEditingSTO(sto);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSto = async (stoId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/sto/${stoId}`
      );
      if (res.ok) {
        await fetchSTO();
        toast.success('STO berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting sto:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus STO'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSto = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/sto`,
        newSTO
      );
      if (res.ok) {
        await fetchSTO();
        toast.success('STO berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewSTO({
          name: '',
          abbreviation: '',
        });
      }
    } catch (error: any) {
      console.error('Error adding STO:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menambahkan sto'
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
        `${process.env.NEXT_PUBLIC_API_URL}/sto/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        fetchSTO();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (stoId?: string) => {
    if (!editingSTO || !stoId) return;

    setIsSubmitting(true);
    const updateData: any = {
      name: editingSTO.name,
      abbreviation: editingSTO.abbreviation,
    };

    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/sto/${stoId}`,
        updateData
      );
      if (res.ok) {
        await fetchSTO();
        toast.success('STO berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingSTO(null);
      }
    } catch (error) {
      console.error('Error updating STO:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat memperbarui STO'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFormFields: FormField[] = [
    {
      id: 'nama_sto',
      label: 'Nama STO',
      type: 'text',
      value: newSTO.name,
      onChange: (value) => setNewSTO((prev) => ({ ...prev, name: value })),
      required: true,
      placeholder: 'Masukkan nama STO',
    },
    {
      id: 'abbreviation_sto',
      label: 'STO',
      type: 'text',
      value: newSTO.abbreviation,
      onChange: (value) => setNewSTO((prev) => ({ ...prev, abbreviation: value })),
      required: true,
      placeholder: 'Masukkan STO',
    },
  ];

  const editFormFields: FormField[] = editingSTO
    ? [
        {
          id: 'edit-nama_sto',
          label: 'Nama STO',
          type: 'text',
          value: editingSTO.name,
          onChange: (value) =>
            setEditingSTO((prev) => (prev ? { ...prev, name: value } : null)),
          required: true,
          placeholder: 'Masukkan nama STO',
        },
        {
          id: 'edit-abbreviation_sto',
          label: 'STO',
          type: 'text',
          value: editingSTO.abbreviation,
          onChange: (value) =>
            setEditingSTO((prev) => (prev ? { ...prev, abbreviation: value } : null)),
          required: true,
          placeholder: 'Masukkan STO',
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditSto, handleDeleteSto, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchSTO();
  }, []);

  return (
    <>
      <PageHeader title="Kelola STO" />
      <Main>
        <PageTitle
          title="Kelola STO"
          description="Kelola data STO (Sentral Telepon Otomat)"
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
          title="Import STO dari Excel"
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
                    Format: .xls, .xlsx 
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
          title="Tambah STO Baru"
          description="Buat data STO baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddSto}
          submitText="Tambah STO"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit STO"
          description="Ubah informasi STO. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={() => handleSaveEdit(editingSTO?.id)}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        <DataTable
          columns={columns}
          data={sto}
          loading={loading}
          searchKey="name"
          searchPlaceholder="Cari STO..."
          emptyMessage="Tidak ada data STO."
          loadingComponent={<TableSkeleton columns={stoSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
