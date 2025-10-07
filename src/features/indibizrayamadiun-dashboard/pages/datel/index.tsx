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
import { FormDialog, FormField, MultiScrollableSelect } from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import type { Datel } from '@/features/indibizrayamadiun-dashboard/types/datel';
import type { STO } from '@/features/indibizrayamadiun-dashboard/types/sto';
import type { ApiResult } from '../../types/api';
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';

const datelSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[200px]', height: 'h-4' },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditDatel: (datel: Datel) => void,
  handleDeleteDatel: (datelId: string) => void,
  isSubmitting: boolean
): ColumnDef<Datel>[] => [
  {
    id: 'select',
    header: '#',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nama',
    header: () => <span className="font-extrabold">Wilayah</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('nama')}</div>
    ),
  },
  {
    accessorKey: 'stos',
    header: () => <span className="font-extrabold">STO</span>,
    cell: ({ row }) => {
      const stos = row.getValue('stos') as Datel['stos'];
      if (!stos || stos.length === 0) {
        return <span className="text-muted-foreground text-xs">-</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {stos.map((s) => (
            <Badge 
              key={s.id} 
              variant="secondary" 
              className="text-xs font-medium"
            >
              {s.sto.abbreviation}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const datel = row.original as Datel;
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
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [stos, setStos] = React.useState<STO[]>([]);
  const [selectedStoIds, setSelectedStoIds] = React.useState<string[]>([]);
  const [newDatel, setNewDatel] = React.useState<Omit<Datel, 'id' | 'created_at' | 'updated_at' | 'stos'>>({
    nama: '',
  });
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchStos = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sto?limit=1000`
      );
      const data = (res.data as ApiResult<STO>).result;
      setStos(data.data);
    } catch (error) {
      console.error('Error fetching STOs:', error);
      toast.error('Gagal memuat data STO');
    }
  }, []);

  const fetchDatels = React.useCallback(
    async (page?: number, limit?: number) => {
      setLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;

        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wilayah?page=${currentPage}&limit=${currentLimit}`
        );
        const data = (res.data as ApiResult<Datel>).result;
        setDatels(data.data);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (error) {
        console.error('Error fetching datels:', error);
        toast.error('Gagal memuat data wilayah');
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  const handlePaginationChange = (page: number, limit: number) => {
    fetchDatels(page, limit);
  };

  const handleEditDatel = (datel: Datel) => {
    const stoIds = datel.stos?.map(s => s.sto.id) || [];
    setEditingDatel(datel);
    setSelectedStoIds(stoIds);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDatel = async (datelId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/wilayah/${datelId}`
      );
      if (res.ok) {
        await fetchDatels();
        toast.success('Wilayah berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting datel:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus wilayah'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDatel = async () => {
    setIsSubmitting(true);
    try {

      const requestBody = {
        ...newDatel,
        sto_ids: selectedStoIds.length > 0 ? selectedStoIds : undefined
      };
      
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/wilayah`,
        requestBody,
        { timeout: 60000 }
      );
      if (res.ok) {
        await fetchDatels();
        toast.success('Wilayah berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewDatel({ nama: '' });
        setSelectedStoIds([]);
      }
    } catch (error: any) {
      console.error('Error adding Wilayah:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menambahkan Wilayah'
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
        `${process.env.NEXT_PUBLIC_API_URL}/wilayah/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        fetchDatels();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (datelId?: string) => {
    if (!editingDatel || !datelId) return;

    setIsSubmitting(true);
    
    // Send sto_ids directly in the PUT body, just like CREATE
    const updateData = {
      nama: editingDatel.nama,
      sto_ids: selectedStoIds,
    };

    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/wilayah/${datelId}`,
        updateData,
        { timeout: 60000 }
      );
      
      if (res.ok) {
        await fetchDatels();
        toast.success('Wilayah berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingDatel(null);
        setSelectedStoIds([]);
      }
    } catch (error) {
      console.error('Error updating datel:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat memperbarui wilayah'
      );
      toast.error(errorMessage);
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
      id: 'stos',
      label: 'STO',
      type: 'custom',
      customComponent: (
        <MultiScrollableSelect
          options={stos.map(sto => ({
            value: sto.id,
            label: `${sto.name} (${sto.abbreviation})`
          }))}
          value={selectedStoIds}
          onChange={setSelectedStoIds}
          placeholder="Pilih STO..."
          searchPlaceholder="Cari STO..."
          emptyMessage="Tidak ada STO ditemukan"
        />
      ),
    } as FormField,
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
          id: 'edit-stos',
          label: 'STO',
          type: 'custom',
          customComponent: (
            <MultiScrollableSelect
              options={stos.map(sto => ({
                value: sto.id,
                label: `${sto.name} (${sto.abbreviation})`
              }))}
              value={selectedStoIds}
              onChange={setSelectedStoIds}
              placeholder="Pilih STO..."
              searchPlaceholder="Cari STO..."
              emptyMessage="Tidak ada STO ditemukan"
            />
          ),
        } as FormField,
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditDatel, handleDeleteDatel, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchDatels();
    fetchStos();
  }, []);

  return (
    <>
      <PageHeader title="Kelola Wilayah Datel" />
      <Main>
        <PageTitle
          title="Kelola Wilayah Datel"
          description="Kelola Wilayah Datel (Divisi Akses Telekomunikasi)"
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
          title="Import Datel dari Excel"
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
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              // Reset when dialog closes
              setNewDatel({ nama: '' });
              setSelectedStoIds([]);
            }
          }}
          title="Tambah Wilayah Baru"
          description="Buat data wilayah baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddDatel}
          submitText="Tambah Wilayah"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              // Reset when dialog closes
              setEditingDatel(null);
              setSelectedStoIds([]);
            }
          }}
          title="Edit Datel"
          description="Ubah informasi datel. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={() => handleSaveEdit(editingDatel?.id)}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        <DataTable
          columns={columns}
          data={datels}
          loading={loading}
          searchKey="nama"
          searchPlaceholder="Cari Datel..."
          emptyMessage="Tidak ada data Datel."
          loadingComponent={<TableSkeleton columns={datelSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
