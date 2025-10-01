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
import { Checkbox } from '@/shared/ui/checkbox';
import { Badge } from '@/shared/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import type { Sales, Agency, Datel } from '../../types/sales';
import { ApiResult } from '../../types/api';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';

const salesSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[120px]', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[120px]', height: 'h-4' },
  { width: 'w-[120px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[80px]', height: 'h-6', rounded: true },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditSales: (sales: Sales) => void,
  handleDeleteSales: (salesId: string) => void,
  isSubmitting: boolean
): ColumnDef<Sales>[] => [
  {
    id: 'select',
    header: '#',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'kode_sales',
    header: () => <span className="font-extrabold">Kode Sales</span>,
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue('kode_sales')}</div>
    ),
  },
  {
    accessorKey: 'nama',
    header: () => <span className="font-extrabold">Nama Sales</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('nama')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: () => <span className="font-extrabold">Email</span>,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'agency',
    header: () => <span className="font-extrabold">Agency</span>,
    cell: ({ row }) => {
      const agency = row.getValue('agency') as Agency;
      return <div>{agency?.nama || '-'}</div>;
    },
  },
  {
    accessorKey: 'datel',
    header: () => <span className="font-extrabold">Datel</span>,
    cell: ({ row }) => {
      const datel = row.getValue('datel') as Datel;
      return <div>{datel?.nama || '-'}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: () => <span className="font-extrabold">Tanggal Registrasi</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: () => <span className="font-extrabold">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${
            status === 'ACTIVE'
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/50'
          }`}
        >
          {status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const sales = row.original;
      return (
        <ActionDropdown
          onEdit={() => handleEditSales(sales)}
          onDelete={() => handleDeleteSales(sales.id)}
          itemName={sales.nama}
          isSubmitting={isSubmitting}
        />
      );
    },
  },
];

export default function ManageSales() {
  const [sales, setSales] = React.useState<Sales[]>([]);
  const [editingSales, setEditingSales] = React.useState<Sales | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [agencies, setAgencies] = React.useState<Agency[]>([]);
  const [datels, setDatels] = React.useState<Datel[]>([]);
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [newSales, setNewSales] = React.useState<
    Omit<Sales, 'id' | 'created_at' | 'updated_at' | 'agency' | 'datel'>
  >({
    nama: '',
    kode_sales: '',
    email: '',
    status: 'ACTIVE',
    agency_id: '',
    datel_id: '',
    kat_umur_sa: new Date().toISOString(),
  });

  const fetchSales = React.useCallback(
    async (page?: number, limit?: number) => {
      setLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;

        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/sales?page=${currentPage}&limit=${currentLimit}`
        );

        const data = (res.data as ApiResult<Sales>).result;
        setSales(data.data);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (error) {
        console.error('Error fetching sales:', error);
        toast.error('Gagal memuat data sales');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAgencies = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/agenc?limit=1000`
      );
      setAgencies((res.data as ApiResult<Agency>).result.data || []);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  }, []);

  const fetchDatels = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/datel?limit=1000`
      );
      const datelData = (res.data as any).data || [];

      const wilayah: any = Array.from(
        new Set(datelData.map((item: any) => item.wilayah))
      );
      setDatels(wilayah);
    } catch (error) {
      console.error('Error fetching datels:', error);
    }
  }, []);

  const handlePaginationChange = (page: number, limit: number) => {
    fetchSales(page, limit);
  };

  const handleEditSales = (salesData: Sales) => {
    setEditingSales(salesData);
    setIsEditDialogOpen(true);
  };

  const handleDeleteSales = async (salesId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/${salesId}`
      );
      if (res.ok) {
        await fetchSales();
        toast.success('Sales berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting sales:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSales = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/sales`,
        newSales
      );
      if (res.ok) {
        await fetchSales();
        toast.success('Sales berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewSales({
          nama: '',
          kode_sales: '',
          email: '',
          status: 'ACTIVE',
          agency_id: '',
          datel_id: '',
          kat_umur_sa: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error adding sales:', error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/sales/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        fetchSales();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSales) return;

    setIsSubmitting(true);
    try {
      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/${editingSales.id}`,
        editingSales
      );
      if (res.ok) {
        await fetchSales();
        toast.success('Sales berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingSales(null);
      }
    } catch (error) {
      console.error('Error updating sales:', error);
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
      id: 'kode_sales',
      label: 'Kode Sales',
      type: 'text',
      value: newSales.kode_sales,
      onChange: (value) =>
        setNewSales((prev) => ({ ...prev, kode_sales: value })),
      required: true,
      placeholder: 'Masukkan kode sales',
    },
    {
      id: 'nama',
      label: 'Nama Sales',
      type: 'text',
      value: newSales.nama,
      onChange: (value) => setNewSales((prev) => ({ ...prev, nama: value })),
      required: true,
      placeholder: 'Masukkan nama sales',
    },
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      value: newSales.email,
      onChange: (value) => setNewSales((prev) => ({ ...prev, email: value })),
      required: true,
      placeholder: 'Masukkan email',
    },
    {
      id: 'agency_id',
      label: 'Agency',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <ScrollableSelect
            options={agencies.map(
              (agency): ScrollableSelectOption => ({
                value: agency.id,
                label: agency.nama,
              })
            )}
            value={newSales.agency_id}
            onChange={(value) =>
              setNewSales((prev) => ({ ...prev, agency_id: value }))
            }
            placeholder="Pilih agency..."
            searchPlaceholder="Cari agency..."
            emptyMessage="Tidak ada agency ditemukan."
          />
        </div>
      ),
    },
    {
      id: 'datel_id',
      label: 'Datel',
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
            value={newSales.datel_id}
            onChange={(value) =>
              setNewSales((prev) => ({ ...prev, datel_id: value }))
            }
            placeholder="Pilih datel..."
            searchPlaceholder="Cari datel..."
            emptyMessage="Tidak ada datel ditemukan."
          />
        </div>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: newSales.status,
      onChange: (value) =>
        setNewSales((prev) => ({
          ...prev,
          status: value as 'ACTIVE' | 'DELETED',
        })),
      options: [
        { value: 'ACTIVE', label: 'Aktif' },
        { value: 'DELETED', label: 'Tidak Aktif' },
      ],
      required: true,
    },
  ];

  const editFormFields: FormField[] = editingSales
    ? [
        {
          id: 'edit-kode_sales',
          label: 'Kode Sales',
          type: 'text',
          value: editingSales.kode_sales,
          onChange: (value) =>
            setEditingSales((prev) =>
              prev ? { ...prev, kode_sales: value } : null
            ),
          required: true,
          placeholder: 'Masukkan kode sales',
        },
        {
          id: 'edit-nama',
          label: 'Nama Sales',
          type: 'text',
          value: editingSales.nama,
          onChange: (value) =>
            setEditingSales((prev) => (prev ? { ...prev, nama: value } : null)),
          required: true,
          placeholder: 'Masukkan nama sales',
        },
        {
          id: 'edit-email',
          label: 'Email',
          type: 'text',
          value: editingSales.email,
          onChange: (value) =>
            setEditingSales((prev) =>
              prev ? { ...prev, email: value } : null
            ),
          required: true,
          placeholder: 'Masukkan email',
        },
        {
          id: 'edit-agency_id',
          label: 'Agency',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <ScrollableSelect
                options={agencies.map(
                  (agency): ScrollableSelectOption => ({
                    value: agency.id,
                    label: agency.nama,
                  })
                )}
                value={editingSales.agency_id}
                onChange={(value) =>
                  setEditingSales((prev) =>
                    prev ? { ...prev, agency_id: value } : null
                  )
                }
                placeholder="Pilih agency..."
                searchPlaceholder="Cari agency..."
                emptyMessage="Tidak ada agency ditemukan."
              />
            </div>
          ),
        },
        {
          id: 'edit-datel_id',
          label: 'Datel',
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
                value={editingSales.datel_id}
                onChange={(value) =>
                  setEditingSales((prev) =>
                    prev ? { ...prev, datel_id: value } : null
                  )
                }
                placeholder="Pilih datel..."
                searchPlaceholder="Cari datel..."
                emptyMessage="Tidak ada datel ditemukan."
              />
            </div>
          ),
        },
        {
          id: 'edit-status',
          label: 'Status',
          type: 'select',
          value: editingSales.status,
          onChange: (value) =>
            setEditingSales((prev) =>
              prev ? { ...prev, status: value as 'ACTIVE' | 'DELETED' } : null
            ),
          options: [
            { value: 'ACTIVE', label: 'Aktif' },
            { value: 'DELETED', label: 'Tidak Aktif' },
          ],
          required: true,
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditSales, handleDeleteSales, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchSales();
    fetchAgencies();
    fetchDatels();
  }, []);

  return (
    <>
      <PageHeader title="Kelola Sales" />
      <Main>
        <PageTitle
          title="Kelola Sales"
          description="Kelola data sales penjualan"
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
          title="Import Sales dari Excel"
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
          title="Tambah Sales Baru"
          description="Buat data sales baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddSales}
          submitText="Tambah Sales"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Sales"
          description="Ubah informasi sales. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={handleSaveEdit}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        <DataTable
          columns={columns}
          data={sales}
          loading={loading}
          searchKey="nama"
          searchPlaceholder="Cari Sales..."
          emptyMessage="Tidak ada data sales."
          loadingComponent={<TableSkeleton columns={salesSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
