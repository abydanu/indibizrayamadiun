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
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import type { Sales } from '../../types/sales';
import type { AgencyDisplay } from '../../types/agency';
import { ApiResult } from '../../types/api';
import { getDisplayErrorMessage } from '@/utils/api-error';
import CustomFileInput from '@/shared/components/custom/custom-file-input';
import { STO } from '../../types/sto';
import { Datel } from '../../types/datel';
import { DatePicker } from '@/shared/components/date-picker';


// Parse API date string into a local Date without timezone shift
const parseApiDateToLocal = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const dateOnlyMatch = value.match(/^\d{4}-\d{2}-\d{2}$/);
  if (dateOnlyMatch) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m as number) - 1, d as number);
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

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
    header: () => <span className="font-extrabold">Agensi</span>,
    cell: ({ row }) => {
      const agency = row.getValue('agency') as AgencyDisplay;
      return <div>{agency?.nama || '-'}</div>;
    },
  },
  {
    accessorKey: 'wilayah',
    header: () => <span className="font-extrabold">Datel</span>,
    cell: ({ row }) => {
      const wilayah = row.getValue('wilayah') as Datel;
      return <div>{wilayah?.nama || '-'}</div>;
    },
  },
  {
    accessorKey: 'sto',
    header: () => <span className="font-extrabold">STO</span>,
    cell: ({ row }) => {
      const sto = row.getValue('sto') as STO;
      return <div>{sto?.abbreviation || '-'}</div>;
    },
  },
  {
    accessorKey: 'tgl_reg',
    header: () => <span className="font-extrabold">Tanggal Registrasi</span>,
    cell: ({ row }) => {
      const raw = row.getValue('tgl_reg') as string;
      const date = parseApiDateToLocal(raw);
      return <div>{date ? date.toLocaleDateString('id-ID') : '-'}</div>;
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
  const [agencies, setAgencies] = React.useState<AgencyDisplay[]>([]);
  const [datels, setDatels] = React.useState<Datel[]>([]);
  const [sto, setSto] = React.useState<STO[]>([]);
  const [filteredStoAdd, setFilteredStoAdd] = React.useState<STO[]>([]);
  const [filteredStoEdit, setFilteredStoEdit] = React.useState<STO[]>([]);
  const [regDate, setRegDate] = React.useState<Date | undefined>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });
  const [editRegDate, setEditRegDate] = React.useState<Date | undefined>();
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  const toDateOnlyString = (inputDate: Date): string => {
    const y = inputDate.getFullYear();
    const m = String(inputDate.getMonth() + 1).padStart(2, '0');
    const d = String(inputDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  
  const [newSales, setNewSales] = React.useState<Omit<Sales, | 'id' | 'created_at' | 'updated_at' | 'agency' | 'datel' | 'wilayah' | 'sto'>>(() => {
    const today = new Date();
    return {
      nama: '',
      kode_sales: '',
      email: '',
      status: 'ACTIVE',
      agency_id: '',
      wilayah_id: '',
      sto_id: '',
      kat_umur_sa: new Date().toISOString(),
      tgl_reg: toDateOnlyString(today) 
    };
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
        `${process.env.NEXT_PUBLIC_API_URL}/agenc/list`
      );
      setAgencies((res.data as any).data || []);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  }, []);

  const fetchDatels = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/wilayah?limit=1000`
      );
      const data = (res.data as ApiResult<Datel>).result?.data || [];
      setDatels(data);
    } catch (error) {
      console.error('Error fetching datels:', error);
    }
  }, []);

  const fetchSto = React.useCallback(async () => {
    try {
      const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/sto?limit=1000`);
      const data = (res.data as ApiResult<STO>).result?.data || [];
      setSto(data);
    } catch (error) {
      console.error('Error fetching sto:', error);
    }
  }, []);

  const handlePaginationChange = (page: number, limit: number) => {
    fetchSales(page, limit);
  };

  const handleEditSales = (salesData: Sales) => {
    setEditingSales(salesData);
    setEditRegDate(parseApiDateToLocal(salesData.tgl_reg));
    
    if (salesData.wilayah_id) {
      const selectedDatel = datels.find(d => d.id === salesData.wilayah_id);
      if (selectedDatel && selectedDatel.stos) {
        const stoIds = selectedDatel.stos.map(s => s.sto.id);
        const filtered = sto.filter(s => stoIds.includes(s.id));
        setFilteredStoEdit(filtered);
      }
    }
    
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
      const payload = { ...newSales };
      
      // Debug logging
      console.log('Add Sales - Payload tgl_reg:', payload.tgl_reg);
      console.log('Add Sales - regDate:', regDate);

      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/sales`,
        payload
      );
      if (res.ok) {
        await fetchSales();
        toast.success('Sales berhasil ditambahkan');
        setIsAddDialogOpen(false);
        
        // Reset dengan tanggal hari ini (local, no timezone shift)
        const today = new Date();
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        setNewSales({
          nama: '',
          kode_sales: '',
          email: '',
          status: 'ACTIVE',
          agency_id: '',
          wilayah_id: '',
          sto_id: '',
          kat_umur_sa: new Date().toISOString(),
          tgl_reg: toDateOnlyString(todayLocal)
        });
        
        setRegDate(todayLocal);
      }
    } catch (error) {
      console.error('Error adding sales:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus Sales'
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
      const payload = { ...editingSales };
      
      // Debug logging
      console.log('Edit Sales - Payload tgl_reg:', payload.tgl_reg);
      console.log('Edit Sales - editRegDate:', editRegDate);

      const res = await api.put(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/${editingSales.id}`,
        payload
      );
      if (res.ok) {
        await fetchSales();
        toast.success('Sales berhasil diperbarui');
        setIsEditDialogOpen(false);
        setEditingSales(null);
        setEditRegDate(undefined);
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
      label: 'Wilayah',
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
            value={newSales.wilayah_id}
            onChange={(value) => {
              setNewSales((prev) => ({ 
                ...prev, 
                wilayah_id: value,
                sto_id: '' 
              }));
            }}
            placeholder="Pilih wilayah..."
            searchPlaceholder="Cari wilayah..."
            emptyMessage="Tidak ada wilayah ditemukan."
          />
        </div>
      ),
    },
    {
      id: 'sto_id',
      label: 'STO',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <ScrollableSelect
            options={filteredStoAdd.map(
              (s): ScrollableSelectOption => ({
                value: s.id,
                label: `${s.name} (${s.abbreviation})`,
              })
            )}
            value={newSales.sto_id}
            onChange={(value) =>
              setNewSales((prev) => ({ ...prev, sto_id: value }))
            }
            placeholder={!newSales.wilayah_id ? "Pilih wilayah terlebih dahulu..." : "Pilih STO..."}
            searchPlaceholder="Cari STO..."
            emptyMessage="Tidak ada STO untuk wilayah ini."
            disabled={!newSales.wilayah_id}
          />
        </div>
      ),
    },
    {
      id: 'tgl_reg',
      label: 'Tanggal Registrasi',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <DatePicker
            date={regDate}
            onSelect={(date) => {
              setRegDate(date);
              setNewSales((prev) => ({
                ...prev,
                tgl_reg: date ? toDateOnlyString(date) : prev.tgl_reg,
              }));
            }}
            placeholder="Pilih tanggal registrasi..."
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
          label: 'Wilayah',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <ScrollableSelect
                options={datels.map(
                  (d): ScrollableSelectOption => ({
                    value: d.id,
                    label: d.nama,
                  })
                )}
                value={editingSales.wilayah_id}
                onChange={(value) =>
                  setEditingSales((prev) =>
                    prev ? { ...prev, wilayah_id: value, sto_id: '' } : null
                  )
                }
                placeholder="Pilih wilayah..."
                searchPlaceholder="Cari wilayah..."
                emptyMessage="Tidak ada wilayah ditemukan."
              />
            </div>
          ),
        },
        {
          id: 'edit-sto_id',
          label: 'STO',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <ScrollableSelect
                options={filteredStoEdit.map(
                  (s): ScrollableSelectOption => ({
                    value: s.id,
                    label: `${s.name} (${s.abbreviation})`,
                  })
                )}
                value={editingSales.sto_id}
                onChange={(value) =>
                  setEditingSales((prev) =>
                    prev ? { ...prev, sto_id: value } : null
                  )
                }
                placeholder={!editingSales.wilayah_id ? "Pilih wilayah terlebih dahulu..." : "Pilih STO..."}
                searchPlaceholder="Cari STO..."
                emptyMessage="Tidak ada STO untuk wilayah ini."
                disabled={!editingSales.wilayah_id}
              />
            </div>
          ),
        },
        {
          id: 'edit-tgl_reg',
          label: 'Tanggal Registrasi',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <DatePicker
                date={editRegDate}
                onSelect={(date) => {
                  setEditRegDate(date);
                  setEditingSales((prev) =>
                    prev
                      ? { ...prev, tgl_reg: date ? toDateOnlyString(date) : prev.tgl_reg }
                      : null
                  );
                }}
                placeholder="Pilih tanggal registrasi..."
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
    if (newSales.wilayah_id) {
      const selectedDatel = datels.find(d => d.id === newSales.wilayah_id);
      if (selectedDatel && selectedDatel.stos) {
        const stoIds = selectedDatel.stos.map(s => s.sto.id);
        const filtered = sto.filter(s => stoIds.includes(s.id));
        setFilteredStoAdd(filtered);
      } else {
        setFilteredStoAdd([]);
      }
    } else {
      setFilteredStoAdd([]);
      if (newSales.sto_id) {
        setNewSales(prev => ({ ...prev, sto_id: '' }));
      }
    }
  }, [newSales.wilayah_id, datels, sto]);

  React.useEffect(() => {
    if (editingSales?.wilayah_id) {
      const selectedDatel = datels.find(d => d.id === editingSales.wilayah_id);
      if (selectedDatel && selectedDatel.stos) {
        const stoIds = selectedDatel.stos.map(s => s.sto.id);
        const filtered = sto.filter(s => stoIds.includes(s.id));
        setFilteredStoEdit(filtered);
      } else {
        setFilteredStoEdit([]);
      }
    } else {
      setFilteredStoEdit([]);
    }
  }, [editingSales?.wilayah_id, datels, sto]);

  React.useEffect(() => {
    fetchSales();
    fetchAgencies();
    fetchDatels();
    fetchSto();
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
              setFilteredStoAdd([]);
              setRegDate(undefined);
            } else {
              const parsed = parseApiDateToLocal(newSales.tgl_reg);
              setRegDate(parsed);
            }
          }}
          title="Tambah Sales Baru"
          description="Buat data sales baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddSales}
          submitText="Tambah Sales"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              // Reset filtered STO when dialog closes
              setFilteredStoEdit([]);
              setEditingSales(null);
              setEditRegDate(undefined);
            }
          }}
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
          emptyMessage="Tidak ada data Sales."
          loadingComponent={<TableSkeleton columns={salesSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
