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
  ScrollableSelect,
  type ScrollableSelectOption,
} from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import type { STO } from '@/features/indibizrayamadiun-dashboard/types/sto';
import type { ApiResult } from '../../types/api';
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';
import { Datel } from '../../types/datel';

const stoSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[120px]', height: 'h-4' },
  { width: 'w-[80px]', height: 'h-6', rounded: true },
  { width: 'w-[70px]', height: 'h-6', rounded: true },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditDatel: (sto: STO) => void,
  handleDeleteDatel: (stoId: string) => void,
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
    cell: ({ row }) => {
      const datel = row.getValue('datel') as Datel;
      return <div>{datel.nama || "-"}</div>
    },
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

export default function ManageSTO() {
  const [sto, setSTO] = React.useState<STO[]>([]);
  const [editingSTO, setEditingSTO] = React.useState<STO | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [datels, setDatels] = React.useState<Datel[]>([]);
  const [newSTO, setNewSTO] = React.useState<Omit<STO, 'id' | 'wilayah'>>({
    nama: '',
    kode_sto: '',
    wilayah_id: '',
    categori: 'HERO',
    sub_area: 'INNER',
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
          `${process.env.NEXT_PUBLIC_API_URL}/datel?page=${currentPage}&limit=${currentLimit}`
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

  const fetchDatels = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/wilayah/list`
      );
      const datelData = (res.data as any).data || [];

      setDatels(datelData);
    } catch (error) {
      console.error('Error fetching datels:', error);
    }
  }, []);

  const handlePaginationChange = (page: number, limit: number) => {
    fetchSTO(page, limit);
  };

  const handleEditSto = (sto: STO) => {
    setEditingSTO(sto);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSTO = async (stoId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/datel/${stoId}`
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
        `${process.env.NEXT_PUBLIC_API_URL}/datel`,
        newSTO
      );
      if (res.ok) {
        await fetchSTO();
        toast.success('STO berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewSTO({
          nama: '',
          kode_sto: '',
          wilayah_id: '',
          categori: 'HERO',
          sub_area: 'INNER',
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

  const handleSaveEdit = async (datelId?: string) => {
    if (!editingSTO || !datelId) return;

    setIsSubmitting(true);
    const updateData = {
      kode_sto: editingSTO.kode_sto,
      nama: editingSTO.nama,
      categori: editingSTO.categori,
      datel_id: editingSTO.datel_id,
      sub_area: editingSTO.sub_area,
    };

    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/sto/${datelId}`,
        updateData
      );
      if (res.ok) {
        await fetchSTO();
        toast.success('STO berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingSTO(null);
      }
    } catch (error) {
      console.error('Error updating datel:', error);
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
      id: 'nama_sto',
      label: 'Nama',
      type: 'text',
      value: newSTO.nama,
      onChange: (value) => setNewSTO((prev) => ({ ...prev, nama: value })),
      required: true,
      placeholder: 'Masukkan nama sto',
    },
    {
      id: 'kode_sto',
      label: 'Kode STO',
      type: 'text',
      value: newSTO.kode_sto,
      onChange: (value) => setNewSTO((prev) => ({ ...prev, kode_sto: value })),
      required: true,
      placeholder: 'Masukkan kode STO',
    },
    {
      id: 'datel_id',
      label: 'sto',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <ScrollableSelect
            options={datels.map(
              (datel): ScrollableSelectOption => ({
                value: datel.id,
                label: datel.nama,
              })
            )}
            value={newSTO.wilayah_id}
            onChange={(value) =>
              setNewSTO((prev) => ({ ...prev, wilayah_id: value }))
            }
            placeholder="Pilih Wilayah..."
            searchPlaceholder="Cari Wilayah..."
            emptyMessage="Data Wilayah tidak ditemukan."
          />
        </div>
      ),
    },
    {
      id: 'categori',
      label: 'Kategori',
      type: 'select',
      value: newSTO.categori,
      onChange: (value) => setNewSTO((prev) => ({ ...prev, categori: value })),
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
      value: newSTO.sub_area,
      onChange: (value) => setNewSTO((prev) => ({ ...prev, sub_area: value })),
      options: [
        { value: 'INNER', label: 'INNER' },
        { value: 'OUTER', label: 'OUTER' },
      ],
      required: true,
    },
  ];

  const editFormFields: FormField[] = editingSTO
    ? [
        {
          id: 'edit-nama_sto',
          label: 'Nama sto',
          type: 'text',
          value: editingSTO.nama,
          onChange: (value) =>
            setEditingSTO((prev) => (prev ? { ...prev, nama: value } : null)),
          required: true,
          placeholder: 'Masukkan nama sto',
        },
        {
          id: 'edit-kode_sto',
          label: 'Kode STO',
          type: 'text',
          value: editingSTO.kode_sto,
          onChange: (value) =>
            setEditingSTO((prev) =>
              prev ? { ...prev, kode_sto: value } : null
            ),
          required: true,
          placeholder: 'Masukkan kode STO',
        },
        {
          id: 'edit-wilayah',
          label: 'Wilayah',
          type: 'text',
          value: editingSTO.wilayah,
          onChange: (value) =>
            setEditingSTO((prev) =>
              prev ? { ...prev, wilayah: value } : null
            ),
          required: true,
          placeholder: 'Masukkan wilayah',
        },
        {
          id: 'edit-categori',
          label: 'Kategori',
          type: 'select',
          value: editingSTO.categori,
          onChange: (value) =>
            setEditingSTO((prev) =>
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
          value: editingSTO.sub_area,
          onChange: (value) =>
            setEditingSTO((prev) =>
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
    () => createColumns(handleEditSto, handleDeleteSTO, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchSTO();
    fetchDatels();
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
                    Format: .xls, .xlsx, .csv
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
          title="Tambah Sto Baru"
          description="Buat data datel baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddSto}
          submitText="Tambah Datel"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Datel"
          description="Ubah informasi datel. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={() => handleSaveEdit(editingSTO?.id)}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        <DataTable
          columns={columns}
          data={sto}
          loading={loading}
          searchKey="nama"
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
