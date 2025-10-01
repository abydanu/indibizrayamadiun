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
  MultiSelect,
  type MultiSelectOption,
} from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/ui/badge';
import type { Paket, Kategori, Promo } from '../../types/paket';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';
import { getDisplayErrorMessage } from '@/utils/api-error';
import { ApiListResult, ApiResult } from '../../types/api';
import CustomFileInput from '@/shared/components/custom/custom-file-input';

const paketSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  { width: 'w-[80px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[60px]', height: 'h-4' },
  { width: 'w-[120px]', height: 'h-6', rounded: true },
  { width: 'w-[120px]', height: 'h-6', rounded: true },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEditPaket: (paket: Paket) => void,
  handleDeletePaket: (paketId: string) => Promise<void>,
  isSubmitting: boolean
): ColumnDef<Paket>[] => [
    {
      id: 'select',
      header: "#",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nama',
      header: () => <span className="font-extrabold">Nama Paket</span>,
      cell: ({ row }) => <div>{row.getValue('nama')}</div>,
    },
    {
      accessorKey: 'bandwith',
      header: () => <span className="font-extrabold">Bandwidth</span>,
      cell: ({ row }) => <div>{row.getValue('bandwith')} Mbps</div>,
    },
    {
      accessorKey: 'price',
      header: () => <span className="font-extrabold">Harga Paket</span>,
      cell: ({ row }) => {
        const amount = parseInt(row.getValue('price') as string);
        const formatted = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'price_psb',
      header: () => <span className="font-extrabold">Harga PSB</span>,
      cell: ({ row }) => {
        const amount = parseInt(row.getValue('price_psb') as string);
        const formatted = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'ppn',
      header: () => <span className="font-extrabold">PPN (%)</span>,
      cell: ({ row }) => {
        const ppn = row.getValue('ppn') as number;
        return <div>{ppn}%</div>;
      },
    },
    {
      accessorKey: 'categories',
      header: () => <span className="font-extrabold">Kategori</span>,
      cell: ({ row }) => {
        const categories = row.getValue('categories') as Kategori[];
        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((kategori) => (
              <Badge key={kategori.id} variant="outline" className="text-xs">
                {kategori.nama}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'applied_promos',
      header: () => <span className="font-extrabold">Promo</span>,
      cell: ({ row }) => {
        const promos = row.getValue('applied_promos') as Promo[];
        if (!promos || promos.length === 0) {
          return (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
              Tidak ada promo
            </Badge>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {promos.map((promo) => (
              <Badge
                key={promo.id}
                variant="outline"
                className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
              >
                {promo.nama} ({promo.diskon}%)
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'final_price',
      header: () => <span className="font-extrabold">Harga Total</span>,
      cell: ({ row }) => {
        const amount = parseInt(row.getValue('final_price') as string);
        const formatted = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'is_show',
      header: () => <span className="font-extrabold">Tampilkan</span>,
      cell: ({ row }) => {
        const isShow = row.getValue('is_show') as boolean;

        return (
          <Badge
            variant="outline"
            className={`capitalize font-medium ${isShow
                ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
                : 'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/50'
              }`}
          >
            {isShow ? 'Aktif' : 'Hide'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const paket = row.original;
        return (
          <ActionDropdown
            onEdit={() => handleEditPaket(paket)}
            onDelete={() => handleDeletePaket(paket.id)}
            itemName={paket.nama}
            isSubmitting={isSubmitting}
          />
        );
      },
    },
  ];

export default function ManagePaket() {
  const [pakets, setPakets] = React.useState<Paket[]>([]);
  const [editingPaket, setEditingPaket] = React.useState<Paket | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [newPaket, setNewPaket] = React.useState<
    Omit<
      Paket,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'paket_categories'
      | 'paket_promos'
      | 'categories'
      | 'promos'
      | 'applied_promos'
      | 'promo_type'
      | 'final_price'
    >
  >({
    nama: '',
    bandwith: 0,
    price: '',
    price_psb: '',
    ppn: 11,
    is_show: true
  });
  const [selectedKategoris, setSelectedKategoris] = React.useState<string[]>(
    []
  );
  const [selectedPromos, setSelectedPromos] = React.useState<string[]>([]);
  const [editSelectedKategoris, setEditSelectedKategoris] = React.useState<
    string[]
  >([]);
  const [editSelectedPromos, setEditSelectedPromos] = React.useState<string[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [kategoris, setKategoris] = React.useState<Kategori[]>([]);
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [loadingKategoris, setLoadingKategoris] =
    React.useState<boolean>(false);
  const [loadingPromos, setLoadingPromos] = React.useState<boolean>(false);
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPakets = React.useCallback(
    async (page?: number, limit?: number) => {
      setLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;
        const res = await api.get<ApiResult<Paket>>(
          `${process.env.NEXT_PUBLIC_API_URL}/paket?page=${currentPage}&limit=${currentLimit}`
        );

        const { data: paketData, pagination: paginationData } = res.data.result;

        setPakets(paketData ?? []);
        setPagination({
          page: paginationData.page,
          limit: paginationData.limit,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        });
      } catch (error) {
        console.error('Error fetching pakets:', error);
        setPakets([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handlePaginationChange = (page: number, limit: number) => {
    fetchPakets(page, limit);
  };

  const fetchKategoris = React.useCallback(async () => {
    setLoadingKategoris(true);
    try {
      const res = await api.get<ApiListResult<Kategori>>(`${process.env.NEXT_PUBLIC_API_URL}/categori/list`);
      setKategoris(res.data.data);
    } catch (error) {
      console.error('Error fetching kategoris:', error);
    } finally {
      setLoadingKategoris(false);
    }
  }, []);

  const fetchPromos = React.useCallback(async () => {
    setLoadingPromos(true);
    try {
      const res = await api.get<ApiListResult<Promo>>(`${process.env.NEXT_PUBLIC_API_URL}/promo/list`);
      setPromos(res.data.data);
    } catch (error) {
      console.error('Error fetching promos:', error);
    } finally {
      setLoadingPromos(false);
    }
  }, []);

  const handleEditPaket = (paket: Paket) => {
    setEditingPaket(paket);
    setEditSelectedKategoris(paket.categories?.map((k) => k.id) || []);
    setEditSelectedPromos(paket.applied_promos?.map((p) => p.id) || []);
    setIsEditDialogOpen(true);
  };

  const handleDeletePaket = async (paketId: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/paket/${paketId}`,
        { timeout: 30000 }
      );

      if (res.ok) {
        await fetchPakets();
        toast.success('Paket berhasil dihapus');
      } else {
        toast.error('Gagal menghapus paket');
      }
    } catch (error: any) {
      console.error('Error deleting paket:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menghapus paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPaket = async () => {
    setIsSubmitting(true);
    try {
      const paketData = {
        nama: newPaket.nama,
        bandwith: newPaket.bandwith,
        price: parseFloat(newPaket.price.toString()),
        price_psb: parseFloat(newPaket.price_psb.toString()),
        ppn: newPaket.ppn,
        category_ids: selectedKategoris,
        promo_ids: selectedPromos,
        is_show: newPaket.is_show
      };

      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/paket`,
        paketData,
        { timeout: 60000 }
      );

      if (res.ok) {
        await fetchPakets();
        toast.success('Paket berhasil ditambahkan');
        setIsAddDialogOpen(false);
        setNewPaket({
          nama: '',
          bandwith: 0,
          price: '',
          price_psb: '',
          ppn: 11,
          is_show: true
        });
        setSelectedKategoris([]);
        setSelectedPromos([]);
      } else {
        toast.error('Gagal menambahkan paket');
      }
    } catch (error: any) {
      console.error('Error adding paket:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menambahkan paket'
      );
      toast.error('Error :', errorMessage);
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
        `${process.env.NEXT_PUBLIC_API_URL}/paket/import`,
        formData,
        { timeout: 120000 }
      );
      if (res.ok) {
        toast.success('Import berhasil');
        setIsImportDialogOpen(false);
        setImportFile(null);
        fetchPakets();
      }
    } catch (error) {
      const errorMessage = getDisplayErrorMessage(error, 'Gagal import data');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (paketId: string) => {
    if (editingPaket) {
      setIsSubmitting(true);
      try {
        const updatedPaket = {
          ...editingPaket,
          nama: editingPaket.nama,
          bandwith: editingPaket.bandwith,
          price: parseFloat(editingPaket.price.toString()),
          price_psb: parseFloat(editingPaket.price_psb.toString()),
          ppn: editingPaket.ppn,
          final_price: parseFloat(editingPaket.final_price.toString()),
          category_ids: editSelectedKategoris,
          promo_ids: editSelectedPromos,
          is_show: editingPaket.is_show
        };

        const res = await api.put(
          `${process.env.NEXT_PUBLIC_API_URL}/paket/${paketId}`,
          updatedPaket,
          { timeout: 60000 }
        );

        if (res.ok) {
          await fetchPakets();
          toast.success('Berhasil Memperbarui Paket');
          setIsEditDialogOpen(false);
          setEditingPaket(null);
          setEditSelectedKategoris([]);
          setEditSelectedPromos([]);
        } else {
          toast.error('Gagal memperbarui paket');
        }
      } catch (error: any) {
        console.error('Error updating paket:', error);
        const errorMessage = getDisplayErrorMessage(
          error,
          'Error saat memperbarui paket'
        );
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const addFormFields: FormField[] = [
    {
      id: 'nama_paket',
      label: 'Nama Paket',
      type: 'text',
      value: newPaket.nama,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, nama: value })),
      required: true,
    },
    {
      id: 'bandwith_paket',
      label: 'Bandwidth',
      type: 'number',
      value: newPaket.bandwith,
      onChange: (value) =>
        setNewPaket((prev) => ({ ...prev, bandwith: value })),
      required: true,
    },
    {
      id: 'harga_paket',
      label: 'Harga Paket',
      type: 'text',
      value: newPaket.price,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, price: value })),
      placeholder: '500000',
      required: true,
    },
    {
      id: 'harga_psb',
      label: 'Harga PSB',
      type: 'text',
      value: newPaket.price_psb,
      onChange: (value) =>
        setNewPaket((prev) => ({ ...prev, price_psb: value })),
      placeholder: '200000',
      required: true,
    },
    {
      id: 'ppn',
      label: 'PPN (%)',
      type: 'number',
      value: newPaket.ppn,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, ppn: value })),
      placeholder: '11',
      required: true,
    },
    {
      id: 'kategoris',
      label: 'Kategori',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <MultiSelect
            options={kategoris.map(
              (kategori): MultiSelectOption => ({
                value: kategori.id,
                label: kategori.nama,
              })
            )}
            value={selectedKategoris}
            onChange={setSelectedKategoris}
            placeholder="Pilih kategori..."
            disabled={loadingKategoris}
          />
        </div>
      ),
    },
    {
      id: 'promos',
      label: 'Promo',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <MultiSelect
            options={promos.map(
              (promo): MultiSelectOption => ({
                value: promo.id,
                label: `${promo.nama} (${promo.diskon}%)`,
              })
            )}
            value={selectedPromos}
            onChange={setSelectedPromos}
            placeholder="Pilih promo..."
            disabled={loadingPromos}
          />
        </div>
      ),
    },
    {
      id: 'is_show',
      label: 'Tampilkan',
      type: 'select',
      value: newPaket.is_show,
      onChange: (value) =>
        setNewPaket((prev) => ({
          ...prev,
          is_show: value as boolean,
        })),
      options: [
        { value: true, label: 'Aktif' },
        { value: false, label: 'Tidak Aktif' },
      ],
      required: true,
    },
  ];

  const editFormFields: FormField[] = editingPaket
    ? [
      {
        id: 'edit-nama_paket',
        label: 'Nama Paket',
        type: 'text',
        value: editingPaket.nama,
        onChange: (value) =>
          setEditingPaket((prev) => (prev ? { ...prev, nama: value } : null)),
        required: true,
      },
      {
        id: 'edit-bandwith_paket',
        label: 'Bandwidth',
        type: 'number',
        value: editingPaket.bandwith,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, bandwith: value } : null
          ),
        required: true,
      },
      {
        id: 'edit-harga_paket',
        label: 'Harga Paket',
        type: 'text',
        value: editingPaket.price,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, price: value } : null
          ),
        placeholder: '500000',
        required: true,
      },
      {
        id: 'edit-harga_psb',
        label: 'Harga PSB',
        type: 'text',
        value: editingPaket.price_psb,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, price_psb: value } : null
          ),
        placeholder: '200000',
        required: true,
      },
      {
        id: 'edit-ppn',
        label: 'PPN (%)',
        type: 'number',
        value: editingPaket.ppn,
        onChange: (value) =>
          setEditingPaket((prev) => (prev ? { ...prev, ppn: value } : null)),
        placeholder: '11',
        required: true,
      },
      {
        id: 'edit-kategoris',
        label: 'Kategori',
        type: 'custom',
        customComponent: (
          <div className="col-span-3">
            <MultiSelect
              options={kategoris.map(
                (kategori): MultiSelectOption => ({
                  value: kategori.id,
                  label: kategori.nama,
                })
              )}
              value={editSelectedKategoris}
              onChange={setEditSelectedKategoris}
              placeholder="Pilih kategori..."
              disabled={loadingKategoris}
            />
          </div>
        ),
      },
      {
        id: 'edit-promos',
        label: 'Promo',
        type: 'custom',
        customComponent: (
          <div className="col-span-3">
            <MultiSelect
              options={promos.map(
                (promo): MultiSelectOption => ({
                  value: promo.id,
                  label: `${promo.nama} (${promo.diskon}%)`,
                })
              )}
              value={editSelectedPromos}
              onChange={setEditSelectedPromos}
              placeholder="Pilih promo..."
              disabled={loadingPromos}
            />
          </div>
        ),
      },
      {
        id: 'edit-is_show',
        label: 'Tampilkan',
        type: 'select',
        value: editingPaket.is_show,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, is_show: value as boolean } : null
          ),
        options: [
          { value: true, label: 'Tampilkan' },
          { value: false, label: 'Sembunyikan' },
        ],
        required: true,
      },
    ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEditPaket, handleDeletePaket, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    fetchPakets();
    fetchKategoris();
    fetchPromos();
  }, []);

  return (
    <>
      <PageHeader title="Kelola Paket" />
      <Main>
        <PageTitle
          title="Kelola Paket"
          description="Kelola paket internet Indibiz"
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
          title="Import Paket dari Excel"
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
          title="Tambah Paket Baru"
          description="Buat paket internet baru. Isi semua informasi yang diperlukan."
          fields={addFormFields}
          onSubmit={handleAddPaket}
          submitText="Tambah Paket"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Paket"
          description="Ubah informasi paket. Klik simpan setelah selesai."
          fields={editFormFields}
          onSubmit={() => handleSaveEdit(editingPaket?.id || '')}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={pakets}
          loading={loading}
          searchKey="nama"
          searchPlaceholder="Cari Nama Paket..."
          emptyMessage="Tidak ada data Paket."
          loadingComponent={<TableSkeleton columns={paketSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
