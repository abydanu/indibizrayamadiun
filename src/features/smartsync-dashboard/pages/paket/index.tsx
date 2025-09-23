'use client';

import * as React from 'react';
import { Main } from '@/features/smartsync-dashboard/components/main';
import { PageHeader, PageTitle } from '@/shared/components/page-layout';
import {
  DataTable,
  TableSkeleton,
  ActionDropdown,
} from '@/shared/components/data-table';
import { FormDialog, FormField, MultiSelect, type MultiSelectOption } from '@/shared/components/forms';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/shared/ui/checkbox';
import { Badge } from '@/shared/ui/badge';
import type {
  Paket,
  PaketApiResponse,
  Kategori,
  Promo,
} from '../../types/paket';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';
import {
  HybridDataTable,
  ServerPaginationState,
} from '@/shared/components/data-table/hybrid-data-table';

// Skeleton configuration untuk tabel paket
const paketSkeletonColumns = [
  { width: 'w-4', height: 'h-4' }, // checkbox
  { width: 'w-[150px]', height: 'h-4' }, // nama
  { width: 'w-[80px]', height: 'h-4' }, // bandwidth
  { width: 'w-[100px]', height: 'h-4' }, // harga paket
  { width: 'w-[100px]', height: 'h-4' }, // harga psb
  { width: 'w-[60px]', height: 'h-4' }, // ppn
  { width: 'w-[120px]', height: 'h-6', rounded: true }, // kategori
  { width: 'w-[120px]', height: 'h-6', rounded: true }, // promo
  { width: 'w-[100px]', height: 'h-4' }, // harga total
  { width: 'w-8', height: 'h-8' }, // actions
];

export const createColumns = (
  handleEditPaket: (paket: Paket) => void,
  handleDeletePaket: (paketId: string) => void,
  isSubmitting: boolean
): ColumnDef<Paket>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
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
          <Badge variant="outline" className="text-xs bg-gray-50">
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
              className="text-xs bg-green-50 text-green-700 border-green-200"
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
  const [pageSize, setPageSize] = React.useState<number>(10);
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
        const res = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/paket?page=${currentPage}&limit=${currentLimit}`,
          { requireAuth: true }
        );
        
        let data, paketData, paginationData;
        
        if (res.data.result) {
          data = res.data.result;
          console.log('Using res.data.result:', data); // Debug log
        } else if (res.data.data) {
          data = res.data;
          console.log('Using res.data:', data); // Debug log
        } else {
          data = res.data;
          console.log('Using raw res.data:', data); // Debug log
        }

        // Extract paket data
        if (data.success && data.data) {
          paketData = data.data;
          paginationData = data.pagination;
        } else if (Array.isArray(data)) {
          paketData = data;
          paginationData = null;
        } else if (data.data) {
          paketData = data.data;
          paginationData = data.pagination;
        } else {
          paketData = [];
          paginationData = null;
        }
        
        setPakets(paketData || []);
        
        if (paginationData) {
          setPagination({
            page: paginationData.page || 1,
            limit: paginationData.limit || 10,
            total: paginationData.total || 0,
            totalPages: paginationData.totalPages || 1,
          });
        }
      } catch (error) {
        console.error('Error fetching pakets:', error);
        setPakets([]);
      } finally {
        setLoading(false);
      }
    },
    [] // Remove dependency to avoid infinite loop
  );

  const handlePaginationChange = (page: number, limit: number) => {
    fetchPakets(page, limit);
  };

  const fetchKategoris = React.useCallback(async () => {
    setLoadingKategoris(true);
    try {
      const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/categori?limit=1000`, {
        requireAuth: true,
      });
      setKategoris((res.data.result as any).data);
    } catch (error) {
      console.error('Error fetching kategoris:', error);
    } finally {
      setLoadingKategoris(false);
    }
  }, []);

  const fetchPromos = React.useCallback(async () => {
    setLoadingPromos(true);
    try {
      const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/promo?limit=1000`, {
        requireAuth: true,
      });
      setPromos((res.data.result as any).data);
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

  const handleDeletePaket = (paketId: string) => {
    setPakets((prev) => prev.filter((paket) => paket.id !== paketId));
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
      };

      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/paket`,
        paketData,
        { requireAuth: true }
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
        });
        setSelectedKategoris([]);
        setSelectedPromos([]);
      } else {
        toast.error('Gagal menambahkan paket');
      }
    } catch (error) {
      console.error('Error adding paket:', error);
      toast.error('Error saat menambahkan paket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (paketId: string) => {
    if (editingPaket) {
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
      };

      try {
        const res = await api.put(
          `${process.env.NEXT_PUBLIC_API_URL}/paket/${paketId}`,
          updatedPaket
        );
        if (res.ok) {
          await fetchPakets();
          toast.success('Berhasil Memperbarui Paket');
          setIsEditDialogOpen(false);
          setEditingPaket(null);
          setEditSelectedKategoris([]);
          setEditSelectedPromos([]);
        }
      } catch (error) {
        console.log(error);
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
            options={kategoris.map((kategori): MultiSelectOption => ({
              value: kategori.id,
              label: kategori.nama,
            }))}
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
            options={promos.map((promo): MultiSelectOption => ({
              value: promo.id,
              label: `${promo.nama} (${promo.diskon}%)`,
            }))}
            value={selectedPromos}
            onChange={setSelectedPromos}
            placeholder="Pilih promo..."
            disabled={loadingPromos}
          />
        </div>
      ),
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
                options={kategoris.map((kategori): MultiSelectOption => ({
                  value: kategori.id,
                  label: kategori.nama,
                }))}
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
                options={promos.map((promo): MultiSelectOption => ({
                  value: promo.id,
                  label: `${promo.nama} (${promo.diskon}%)`,
                }))}
                value={editSelectedPromos}
                onChange={setEditSelectedPromos}
                placeholder="Pilih promo..."
                disabled={loadingPromos}
              />
            </div>
          ),
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader title="Kelola Paket" />
      <Main>
        <PageTitle
          title="Kelola Paket"
          description="Kelola paket internet Indibiz"
          showAddButton
          addButtonText="Tambah Paket"
          onAddClick={() => setIsAddDialogOpen(true)}
        />

        {/* Add Paket Dialog */}
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

        {/* Edit Paket Dialog */}
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
        <HybridDataTable
          columns={columns}
          data={pakets}
          loading={loading}
          searchKey="nama"
          searchPlaceholder="Cari Nama Paket..."
          emptyMessage="Tidak ada data paket."
          loadingComponent={<TableSkeleton columns={paketSkeletonColumns} />}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
