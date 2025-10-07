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
import { Checkbox } from '@/shared/ui/checkbox';
import { Badge } from '@/shared/ui/badge';
import type { Promo } from '../../types/promo';
import { toast } from 'sonner';
import { DatePicker } from '@/shared/components/date-picker';
import api from '@/lib/api/useFetch';
import { ApiResult } from '../../types/api';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';

const promoSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  { width: 'w-[80px]', height: 'h-6', rounded: true },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[80px]', height: 'h-6', rounded: true },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditPromo: (promo: Promo) => void,
  handleDeletePromo: (promoId: string) => void,
  isSubmitting: boolean
): ColumnDef<Promo>[] => [
  {
    id: 'select',
    header: '#',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nama',
    header: () => <span className="font-extrabold">Nama Promo</span>,
    cell: ({ row }) => {
      const value = row.getValue('nama') as string;
      const formatted = value.replace(/_/g, ' ');
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'deskripsi',
    header: () => <span className="font-extrabold">Deskripsi</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('deskripsi')}</div>
    ),
  },
  {
    accessorKey: 'jenis',
    header: () => <span className="font-extrabold">Jenis</span>,
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
    accessorKey: 'diskon',
    header: () => <span className="font-extrabold">Nilai</span>,
    cell: ({ row }) => {
      const nilai = parseFloat(row.getValue('diskon'));
      return <div className="font-medium">{nilai}%</div>;
    },
  },
  {
    accessorKey: 'mulai',
    header: () => <span className="font-extrabold">Tanggal Mulai</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('mulai'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    accessorKey: 'akhir',
    header: () => <span className="font-extrabold">Tanggal Berakhir</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('akhir'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    accessorKey: 'is_global',
    header: () => <span className="font-extrabold">Global</span>,
    cell: ({ row }) => {
      const isGlobal = row.getValue('is_global') as boolean;
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

export default function ManagePromo() {
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [editingPromo, setEditingPromo] = React.useState<Promo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [newPromo, setNewPromo] = React.useState<Omit<Promo, 'id'>>({
    nama: '',
    jenis: 'DISKON',
    diskon: '',
    deskripsi: '',
    mulai: '',
    akhir: '',
    is_global: false,
  });
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [editStartDate, setEditStartDate] = React.useState<Date | undefined>();
  const [editEndDate, setEditEndDate] = React.useState<Date | undefined>();
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const parseDateFromApi = (
    dateString: string | null | undefined
  ): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? undefined : date;
    } catch (error) {
      console.error('Error parsing date:', error);
      return undefined;
    }
  };

  const getPromos = React.useCallback(
    async (page?: number, limit?: number) => {
      setIsLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;
        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/promo?page=${currentPage}&limit=${currentLimit}`
        );
        const data = (res.data as ApiResult<Promo>).result;
        setPromos(data.data);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (error: any) {
        toast.error('Gagal memuat data promo');
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  const handlePaginationChange = (page: number, limit: number) => {
    getPromos(page, limit);
  };

  const addPromo = async () => {
    try {
      setIsSubmitting(true);

      const formData = {
        ...newPromo,
        diskon: parseFloat(newPromo.diskon as any),
        mulai: startDate ? startDate.toISOString() : '',
        akhir: endDate ? endDate.toISOString() : '',
      };

      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/promo`,
        formData
      );

      if (res.ok) {
        await getPromos();
        setIsAddDialogOpen(false);
        setNewPromo({
          nama: '',
          jenis: 'DISKON',
          diskon: '',
          deskripsi: '',
          mulai: '',
          akhir: '',
          is_global: false,
        });
        setStartDate(undefined);
        setEndDate(undefined);
        toast.success('Promo berhasil ditambahkan');
      }
    } catch (error: any) {
      console.error('Failed to add promo:', error.message);
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
        `${process.env.NEXT_PUBLIC_API_URL}/promo/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        getPromos();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePromo = async (promoId: string) => {
    try {
      setIsSubmitting(true);
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/promo/${promoId}`
      );

      if (res.ok) {
        await getPromos();
        toast.success('Promo berhasil dihapus');
      }
    } catch (error: any) {
      console.error('Failed to delete promo:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setEditStartDate(parseDateFromApi(promo.mulai));
    setEditEndDate(parseDateFromApi(promo.akhir));
    setIsEditDialogOpen(true);
  };

  const handleDeletePromo = (promoId: string) => {
    deletePromo(promoId);
  };

  const handleSaveEdit = async (id: string | undefined) => {
    if (!editingPromo || !id) return;

    setIsSubmitting(true);

    try {
      const formatForApi = (date: Date | undefined, isEndOfDay = false) => {
        if (!date) return null;
        const d = new Date(date);
        if (isEndOfDay) {
          d.setHours(23, 59, 59, 999);
        } else {
          d.setHours(0, 0, 0, 0);
        }
        return d.toISOString();
      };

      const promoData = {
        ...editingPromo,
        diskon: editingPromo.diskon
          ? parseFloat(editingPromo.diskon as string)
          : 0,
        mulai: formatForApi(editStartDate),
        akhir: formatForApi(editEndDate, true),
      };

      const response = await api.put(`/promo/${id}`, promoData);

      if (response.ok) {
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

  const handleAddPromo = () => {
    addPromo();
  };

  const addFormFields: FormField[] = [
    {
      id: 'namaPromo',
      label: 'Promo',
      type: 'text',
      value: newPromo.nama,
      onChange: (value) => setNewPromo((prev) => ({ ...prev, nama: value })),
      required: true,
    },
    {
      id: 'jenis',
      label: 'Jenis',
      type: 'select',
      value: newPromo.jenis,
      onChange: (value) => setNewPromo((prev) => ({ ...prev, jenis: value })),
      options: [
        { value: 'DISKON', label: 'Diskon' },
        { value: 'CASHBACK', label: 'Cashback' },
        { value: 'BONUS', label: 'Bonus' },
        { value: 'DLL', label: 'DLL' },
      ],
      required: true,
    },
    {
      id: 'nilai',
      label: 'Diskon (%)',
      type: 'number',
      value:
        typeof newPromo.diskon === 'string'
          ? newPromo.diskon
          : newPromo.diskon.toString(),
      onChange: (value) => setNewPromo((prev) => ({ ...prev, diskon: value })),
      min: 0,
      max: 100,
      step: 0.01,
      required: true,
    },
    {
      id: 'deskripsi',
      label: 'Deskripsi',
      type: 'text',
      value: newPromo.deskripsi,
      onChange: (value) =>
        setNewPromo((prev) => ({ ...prev, deskripsi: value })),
      required: true,
    },
    {
      id: 'mulai',
      label: 'Mulai',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <DatePicker
            date={startDate}
            onSelect={setStartDate}
            placeholder="Pilih tanggal mulai"
          />
        </div>
      ),
    },
    {
      id: 'berakhir',
      label: 'Berakhir',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <DatePicker
            date={endDate}
            onSelect={setEndDate}
            placeholder="Pilih tanggal berakhir"
          />
        </div>
      ),
    },
    {
      id: 'isGlobal',
      label: 'Global',
      type: 'select',
      value: newPromo.is_global.toString(),
      onChange: (value) =>
        setNewPromo((prev) => ({ ...prev, is_global: value === 'true' })),
      options: [
        { value: 'true', label: 'Ya' },
        { value: 'false', label: 'Tidak' },
      ],
    },
  ];

  const editFormFields: FormField[] = editingPromo
    ? [
        {
          id: 'edit-namaPromo',
          label: 'Promo',
          type: 'text',
          value: editingPromo.nama,
          onChange: (value) =>
            setEditingPromo((prev) => (prev ? { ...prev, nama: value } : null)),
          required: true,
        },
        {
          id: 'edit-jenis',
          label: 'Jenis',
          type: 'select',
          value: editingPromo.jenis,
          onChange: (value) =>
            setEditingPromo((prev) =>
              prev ? { ...prev, jenis: value } : null
            ),
          options: [
            { value: 'DISKON', label: 'Diskon' },
            { value: 'CASHBACK', label: 'Cashback' },
            { value: 'BONUS', label: 'Bonus' },
            { value: 'DLL', label: 'Dll' },
          ],
          required: true,
        },
        {
          id: 'edit-nilai',
          label: 'Diskon (%)',
          type: 'number',
          value:
            typeof editingPromo.diskon === 'string'
              ? editingPromo.diskon
              : editingPromo.diskon.toString(),
          onChange: (value) =>
            setEditingPromo((prev) =>
              prev ? { ...prev, diskon: value } : null
            ),
          min: 0,
          max: 100,
          step: 0.01,
          required: true,
        },
        {
          id: 'edit-deskripsi',
          label: 'Deskripsi',
          type: 'text',
          value: editingPromo.deskripsi,
          onChange: (value) =>
            setEditingPromo((prev) =>
              prev ? { ...prev, deskripsi: value } : null
            ),
          required: true,
        },
        {
          id: 'edit-mulai',
          label: 'Mulai',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <DatePicker
                date={editStartDate}
                onSelect={setEditStartDate}
                placeholder="Pilih tanggal mulai"
              />
            </div>
          ),
        },
        {
          id: 'edit-berakhir',
          label: 'Berakhir',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <DatePicker
                date={editEndDate}
                onSelect={setEditEndDate}
                placeholder="Pilih tanggal berakhir"
              />
            </div>
          ),
        },
        {
          id: 'edit-isGlobal',
          label: 'Global',
          type: 'select',
          value: String(editingPromo.is_global),
          onChange: (value) =>
            setEditingPromo((prev) =>
              prev ? { ...prev, is_global: value === 'true' } : null
            ),
          options: [
            { value: 'true', label: 'Ya' },
            { value: 'false', label: 'Tidak' },
          ],
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditPromo, handleDeletePromo, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    getPromos();
  }, []);

  return (
    <>
      <PageHeader title="Kelola Promo" />
      <Main>
        <PageTitle
          title="Kelola Promo"
          description="Kelola promo dan diskon paket Indibiz"
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
          title="Import Promo dari Excel"
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
          title="Tambah Promo Baru"
          description="Buat promo baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddPromo}
          submitText="Tambah Promo"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Promo"
          description="Ubah informasi promo. Klik simpan setelah selesai."
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
          searchPlaceholder="Cari Promo..."
          emptyMessage="No results."
          loadingComponent={<TableSkeleton columns={promoSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
