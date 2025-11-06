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
import type { Paket, Kategori } from '../../types/paket';
import type { Promo } from '../../types/promo';
import type { Prodigi } from '../../types/prodigi';
import api from '@/lib/api/useFetch';
import { toast } from 'sonner';
import { getDisplayErrorMessage } from '@/utils/api-error';
import { ApiListResult, ApiResult } from '../../types/api';
import CustomFileInput from '@/shared/components/custom/custom-file-input';

const paketSkeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[80px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
  { width: 'w-[100px]', height: 'h-4' },
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
      header: '#',
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
      accessorKey: 'kode',
      header: () => <span className="font-extrabold">Kode Paket</span>,
      cell: ({ row }) => {
        const kode = row.getValue('kode') as string | null;
        return (
          <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-700">
            {kode || '-'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'jenis_paket',
      header: () => <span className="font-extrabold">Jenis Paket</span>,
      cell: ({ row }) => {
        const jenisPaket = row.getValue('jenis_paket') as string;
        return (
          <Badge variant="outline" className="text-xs">
            {jenisPaket?.replace(/_/g, ' ') || '-'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'bandwidth',
      header: () => <span className="font-extrabold">Bandwidth</span>,
      cell: ({ row }) => <div>{row.getValue('bandwidth')} Mbps</div>,
    },
    {
      accessorKey: 'ratio',
      header: () => <span className="font-extrabold">Ratio</span>,
      cell: ({ row }) => {
        const rawRatio = row.getValue('ratio') as string
        // const formatted = rawRatio.replace('RATIO_', '').replaceAll('_', ':')
        return (
          <Badge variant="outline" className="text-xs">
            {rawRatio}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'harga',
      header: () => <span className="font-extrabold">Harga Paket</span>,
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
      id: 'total_price',
      header: () => <span className="font-extrabold">Total</span>,
      cell: ({ row }) => {
        const paket = row.original;
        const base = Number(paket.harga || 0);
        const addOns = (paket.prodigis || []).reduce((sum, pr) => sum + Number(pr.harga || 0), 0);
        const subtotal = base + addOns;

        const hargaCoretFromApi = paket.promo_pakets?.find((pp) => pp.harga_coret != null)?.harga_coret ?? null;
        const effective = Number(paket.effective_harga ?? subtotal);

        const hasDiscount = (hargaCoretFromApi != null) || effective < subtotal;
        const hargaCoret = hargaCoretFromApi ?? (hasDiscount ? subtotal : null);

        const psbNormal = Number(paket.harga_psb || 0);
        const psbEffective = Number(paket.effective_psb ?? psbNormal);
        const hasPsbDiscount = psbEffective > 0 && psbEffective < psbNormal;

        const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(n));

        return (
          <div className="flex flex-col">
            <div>
              {hasDiscount && hargaCoret != null ? (
                <>
                  <span className="line-through text-muted-foreground mr-2">{fmt(hargaCoret)}</span>
                  <span className="font-semibold">{fmt(effective)}</span>
                </>
              ) : (
                <span className="font-semibold">{fmt(effective)}</span>
              )}
            </div>
            {psbNormal > 0 && (
              <div className="text-xs mt-1">
                <span className="mr-1">PSB:</span>
                {hasPsbDiscount ? (
                  <>
                    <span className="line-through text-muted-foreground mr-1">{fmt(psbNormal)}</span>
                    <span className="font-semibold">{fmt(psbEffective)}</span>
                  </>
                ) : (
                  <span className="font-semibold">{fmt(psbNormal)}</span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'prodigis',
      header: () => <span className="font-extrabold">Prodigi</span>,
      cell: ({ row }) => {
        const prodigis = row.original.prodigis || [];
        if (prodigis.length === 0) {
          return (
            <Badge
              variant="outline"
              className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
            >
              Tidak ada
            </Badge>
          );
        }
        const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(n));
        return (
          <div className="flex flex-wrap gap-1">
            {prodigis.map((prodigi) => (
              <Badge
                key={prodigi.id}
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
              >
                {prodigi.nama} ({fmt(Number(prodigi.harga || 0))})
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'promo_pakets',
      header: () => <span className="font-extrabold">Promo</span>,
      cell: ({ row }) => {
        const promoPakets = row.original.promo_pakets || [];
        if (promoPakets.length === 0) {
          return (
            <Badge
              variant="outline"
              className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
            >
              Tidak ada promo
            </Badge>
          );
        }
        const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(n));
        return (
          <div className="flex flex-wrap gap-1">
            {promoPakets.map((pp) => {
              const promo = pp.promo;
              let label = promo.nama;
              if (promo.tipe_promo === 'DISKON_PERSEN' && promo.diskon_persen) {
                label = `${promo.nama} (${promo.diskon_persen}%)`;
              } else if (promo.tipe_promo === 'DISKON_NOMINAL' && promo.diskon_nominal) {
                const nominalSanitized = promo.diskon_nominal != null ? Number(String(promo.diskon_nominal).replace(/[^\d-]/g, '')) : null;
                label = `${promo.nama} (${fmt(nominalSanitized ?? 0)})`;
              } else if (promo.tipe_promo === 'DISKON_PSB') {
                const persen = promo.psb_diskon_persen ? `${promo.psb_diskon_persen}%` : '';
                const afterNumSanitized = promo.psb_setelah_diskon != null ? Number(String(promo.psb_setelah_diskon).replace(/[^\d-]/g, '')) : null;
                const after = afterNumSanitized != null ? fmt(afterNumSanitized) : undefined;
                label = after ? `${promo.nama} (PSB ${persen} → ${after})` : `${promo.nama} (PSB ${persen})`;
              } else if (promo.tipe_promo === 'COMBO') {
                const parts = [] as string[];
                if (promo.diskon_persen) parts.push(`${promo.diskon_persen}%`);
                if (promo.psb_diskon_persen) parts.push(`PSB ${promo.psb_diskon_persen}%`);
                if (parts.length > 0) label = `${promo.nama} (${parts.join(' + ')})`;
              }
              return (
                <Badge
                  key={pp.id}
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                >
                  {label}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: 'aktif',
      header: () => <span className="font-extrabold">Status</span>,
      cell: ({ row }) => {
        const aktif = row.getValue('aktif') as boolean;

        return (
          <Badge
            variant="outline"
            className={`capitalize font-medium ${aktif
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/50'
              }`}
          >
            {aktif ? 'Aktif' : 'Tidak Aktif'}
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
      'id' | 'created_at' | 'updated_at' | 'prodigis' | 'promo_pakets'
    >
  >({
    kode: '',
    nama: '',
    kategori: '',
    ratio: '',
    jenis_paket: '',
    bandwidth: 0,
    ont_type: '',
    harga: '',
    harga_psb: '',
    aktif: true,
    total: '',
  });
  const [selectedProdigis, setSelectedProdigis] = React.useState<string[]>([]);
  const [selectedPromos, setSelectedPromos] = React.useState<string[]>([]);
  const [editSelectedProdigis, setEditSelectedProdigis] = React.useState<
    string[]
  >([]);
  const [editSelectedPromos, setEditSelectedPromos] = React.useState<string[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [prodigis, setProdigis] = React.useState<Prodigi[]>([]);
  const [loadingPromos, setLoadingPromos] = React.useState<boolean>(false);
  const [loadingProdigis, setLoadingProdigis] = React.useState<boolean>(false);
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const ratioOptions = React.useMemo(() => [
    'RATIO_1_1',
    'RATIO_1_2',
  ], []);
  const jenisPaketOptions = React.useMemo(() => [
    'INET_ONLY',
    'INET_PRODIGI',
    'INET_BASIC',
    'VOICE',
    'USEETV'
  ], []);
  const ontTypeOptions = React.useMemo(() => [
    'STANDARD',
    'DUAL_BAND',
    'PREMIUM',
  ], []);

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

  const fetchPromos = React.useCallback(async () => {
    setLoadingPromos(true);
    try {
      const res = await api.get<ApiListResult<Promo>>(
        `${process.env.NEXT_PUBLIC_API_URL}/promo/list`
      );
      const { data } = res.data;
      setPromos(data);
    } catch (error) {
      console.error('Error fetching promos:', error);
    } finally {
      setLoadingPromos(false);
    }
  }, []);

  const fetchProdigis = React.useCallback(async () => {
    setLoadingProdigis(true);
    try {
      const res = await api.get<ApiListResult<Prodigi>>(
        `${process.env.NEXT_PUBLIC_API_URL}/prodigi/list`
      );
      const { data } = res.data;
      setProdigis(data);
    } catch (error) {
      console.error('Error fetching prodigis:', error);
    } finally {
      setLoadingProdigis(false);
    }
  }, []);

  const handleEditPaket = (paket: Paket) => {
    setEditingPaket(paket);
    setEditSelectedProdigis(paket.prodigis?.map((p) => p.id) || []);
    setEditSelectedPromos(paket.promo_pakets?.map((pp) => pp.promo_id) || []);
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
        kode: newPaket.kode,
        nama: newPaket.nama,
        kategori: newPaket.kategori,
        ratio: newPaket.ratio,
        jenis_paket: newPaket.jenis_paket,
        bandwidth: newPaket.bandwidth,
        ont_type: newPaket.ont_type,
        harga: Number(newPaket.harga),
        harga_psb: Number(newPaket.harga_psb),
        total: newPaket.total ? Number(newPaket.total) : undefined,
        prodigis: selectedProdigis,
        promo_pakets: selectedPromos,
        aktif: newPaket.aktif,
      } as any;

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
          kode: '',
          nama: '',
          kategori: '',
          ratio: '',
          jenis_paket: '',
          bandwidth: 0,
          ont_type: '',
          harga: '',
          harga_psb: '',
          total: '',
          aktif: true,
        });
        setSelectedProdigis([]);
        setSelectedPromos([]);
      } else {
        toast.error('Gagal menambahkan paket');
      }
    } catch (error) {
      console.error('Error adding paket:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menambahkan paket'
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
          kode: editingPaket.kode || null,
          nama: editingPaket.nama,
          kategori: editingPaket.kategori,
          ratio: editingPaket.ratio,
          jenis_paket: editingPaket.jenis_paket,
          bandwidth: editingPaket.bandwidth,
          ont_type: editingPaket.ont_type,
          harga: Number(editingPaket.harga),
          harga_psb: Number(editingPaket.harga_psb),
          total: editingPaket.total ? Number(editingPaket.total) : undefined,
          prodigis: editSelectedProdigis,
          promo_pakets: editSelectedPromos,
          aktif: editingPaket.aktif,
        } as any;

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
          setEditSelectedProdigis([]);
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
      id: 'kode',
      label: 'Kode Paket',
      type: 'text',
      value: newPaket.kode || '',
      onChange: (value) => setNewPaket((prev) => ({ ...prev, kode: value || null })),
      placeholder: 'Opsional',
      required: false,
    },
    {
      id: 'nama_paket',
      label: 'Nama Paket',
      type: 'text',
      value: newPaket.nama,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, nama: value })),
      required: true,
    },
    {
      id: 'kategori',
      label: 'Kategori',
      type: 'text',
      value: newPaket.kategori,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, kategori: value })),
      required: true,
    },
    {
      id: 'ratio',
      label: 'Ratio',
      type: 'select',
      value: newPaket.ratio,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, ratio: value })),
      options: ratioOptions.map(v => ({ value: v, label: v.replace(/_/g, ' ') })),
      placeholder: 'Pilih ratio...',
      required: true,
    },
    {
      id: 'jenis_paket',
      label: 'Jenis Paket',
      type: 'select',
      value: newPaket.jenis_paket,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, jenis_paket: value })),
      options: jenisPaketOptions.map(v => ({ value: v, label: v.replace(/_/g, ' ') })),
      placeholder: 'Pilih jenis paket...',
      required: true,
    },
    {
      id: 'bandwidth',
      label: 'Bandwidth (Mbps)',
      type: 'number',
      value: newPaket.bandwidth,
      onChange: (value) =>
        setNewPaket((prev) => ({ ...prev, bandwidth: value })),
      required: true,
    },
    {
      id: 'ont_type',
      label: 'ONT Type',
      type: 'select',
      value: newPaket.ont_type,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, ont_type: value })),
      options: ontTypeOptions.map(v => ({ value: v, label: v.replace(/_/g, ' ') })),
      placeholder: 'Pilih ONT type...',
      required: true,
    },
    {
      id: 'harga',
      label: 'Harga Paket',
      type: 'text',
      value: newPaket.harga,
      onChange: (value) => setNewPaket((prev) => ({ ...prev, harga: value })),
      placeholder: '447000',
      required: true,
    },
    {
      id: 'harga_psb',
      label: 'Harga PSB',
      type: 'text',
      value: newPaket.harga_psb || '',
      onChange: (value) => setNewPaket((prev) => ({ ...prev, harga_psb: value })),
      placeholder: '500000',
      required: true,
    },
    {
      id: 'prodigis',
      label: 'Prodigi',
      type: 'custom',
      customComponent: (
        <div className="col-span-3">
          <MultiSelect
            options={prodigis.map(
              (prodigi): MultiSelectOption => ({
                value: prodigi.id,
                label: `${prodigi.nama} - ${new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(parseInt(String(prodigi.harga)))}`,
              })
            )}
            value={selectedProdigis}
            onChange={setSelectedProdigis}
            placeholder="Pilih prodigi..."
            disabled={loadingProdigis}
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
                label: `${promo.nama}${promo.diskon_persen ? ` (${promo.diskon_persen}%)` : ''
                  }`,
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
      id: 'aktif',
      label: 'Status',
      type: 'select',
      value: newPaket.aktif,
      onChange: (value) =>
        setNewPaket((prev) => ({
          ...prev,
          aktif: value as boolean,
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
        id: 'edit-kode_paket',
        label: 'Kode Paket',
        type: 'text',
        value: editingPaket.kode || '',
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, kode: value || null } : null
          ),
        placeholder: 'Opsional',
        required: false,
      },
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
        id: 'edit-ratio',
        label: 'Ratio',
        type: 'select',
        value: editingPaket.ratio,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, ratio: value } : null
          ),
        options: ratioOptions.map(v => ({ value: v, label: v.replace(/_/g, ' ') })),
        placeholder: 'Pilih ratio...',
        required: true,
      },
      {
        id: 'edit-jenis_paket',
        label: 'Jenis Paket',
        type: 'select',
        value: editingPaket.jenis_paket,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, jenis_paket: value } : null
          ),
        options: jenisPaketOptions.map(v => ({ value: v, label: v.replace(/_/g, ' ') })),
        placeholder: 'Pilih jenis paket...',
        required: true,
      },
      {
        id: 'edit-bandwidth',
        label: 'Bandwidth (Mbps)',
        type: 'number',
        value: editingPaket.bandwidth,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, bandwidth: value } : null
          ),
        required: true,
      },
      {
        id: 'edit-ont_type',
        label: 'ONT Type',
        type: 'select',
        value: editingPaket.ont_type,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, ont_type: value } : null
          ),
        options: ontTypeOptions.map(v => ({ value: v, label: v.replace(/_/g, ' ') })),
        placeholder: 'Pilih ONT type...',
        required: true,
      },
      {
        id: 'edit-harga',
        label: 'Harga Paket',
        type: 'text',
        value: editingPaket.harga,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, harga: value } : null
          ),
        placeholder: '447000',
        required: true,
      },
      {
        id: 'edit-prodigis',
        label: 'Prodigi',
        type: 'custom',
        customComponent: (
          <div className="col-span-3">
            <MultiSelect
              options={prodigis.map(
                (prodigi): MultiSelectOption => ({
                  value: prodigi.id,
                  label: `${prodigi.nama} - ${new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(parseInt(String(prodigi.harga)))}`,
                })
              )}
              value={editSelectedProdigis}
              onChange={setEditSelectedProdigis}
              placeholder="Pilih prodigi..."
              disabled={loadingProdigis}
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
                  label: `${promo.nama}${promo.diskon_persen ? ` (${promo.diskon_persen}%)` : ''
                    }`,
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
        id: 'edit-aktif',
        label: 'Status',
        type: 'select',
        value: editingPaket.aktif,
        onChange: (value) =>
          setEditingPaket((prev) =>
            prev ? { ...prev, aktif: value as boolean } : null
          ),
        options: [
          { value: true, label: 'Aktif' },
          { value: false, label: 'Tidak Aktif' },
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
    fetchPromos();
    fetchProdigis();
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
