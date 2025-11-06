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
    accessorKey: 'tipe_promo',
    header: () => <span className="font-extrabold">Tipe</span>,
    cell: ({ row }) => {
      const tipe = row.getValue('tipe_promo') as string;
      const tipeLabels: Record<string, string> = {
        DISKON_PERSEN: 'Diskon %',
        DISKON_NOMINAL: 'Diskon Nominal',
        DISKON_PSB: 'DISKON_PSB',
        COMBO: 'Combo',
      };
      return (
        <Badge variant="outline" className="capitalize font-medium">
          {tipeLabels[tipe] || tipe}
        </Badge>
      );
    },
  },
  {
    id: 'nilai',
    header: () => <span className="font-extrabold">Nilai Promo</span>,
    cell: ({ row }) => {
      const promo = row.original;
      const toNum = (v: any) => {
        if (v == null) return null;
        const s = String(v).replace(/[^\d-]/g, '');
        return s ? Number(s) : null;
      };
      const formatIDR = (amount: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

      // DISKON_PERSEN
      if (promo.tipe_promo === 'DISKON_PERSEN' && promo.diskon_persen != null) {
        return <div className="font-medium">{parseFloat(promo.diskon_persen as any)}%</div>;
      }

      // DISKON_NOMINAL
      if (promo.tipe_promo === 'DISKON_NOMINAL' && promo.diskon_nominal != null) {
        return <div className="font-medium">{formatIDR(toNum(promo.diskon_nominal)!)}</div>;
      }

      // DISKON_PSB
      if (promo.tipe_promo === 'DISKON_PSB') {
        const normal = toNum(promo.psb_normal);
        const after = toNum(promo.psb_setelah_diskon);
        const percent = promo.psb_diskon_persen != null ? `${parseFloat(promo.psb_diskon_persen as any)}%` : null;
        if (normal != null && after != null && percent) {
          return (
            <div className="font-medium text-sm">
              {formatIDR(normal)} <span className="mx-1">→</span> {formatIDR(after)} ({percent})
            </div>
          );
        }
        if (percent) return <div className="font-medium">{percent}</div>;
        return <div className="text-muted-foreground">-</div>;
      }

      // COMBO
      if (promo.tipe_promo === 'COMBO') {
        const parts: string[] = [];
        if (promo.diskon_persen != null) parts.push(`Paket: ${parseFloat(promo.diskon_persen as any)}%`);
        if (promo.psb_diskon_persen != null) {
          const after = toNum(promo.psb_setelah_diskon);
          const percent = `${parseFloat(promo.psb_diskon_persen as any)}%`;
          parts.push(after != null ? `PSB: ${percent} → ${formatIDR(after)}` : `PSB: ${percent}`);
        }
        return <div className="font-medium text-sm">{parts.length > 0 ? parts.join(' + ') : '-'}</div>;
      }

      return <div className="text-muted-foreground">-</div>;
    },
  },
  {
    accessorKey: 'tanggal_mulai',
    header: () => <span className="font-extrabold">Tanggal Mulai</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('tanggal_mulai'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    accessorKey: 'tanggal_selesai',
    header: () => <span className="font-extrabold">Tanggal Berakhir</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('tanggal_selesai'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
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
          className={`capitalize font-medium ${
            aktif
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-gray-700 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-950/50'
          }`}
        >
          {aktif ? 'Aktif' : 'Nonaktif'}
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
  const [newPromo, setNewPromo] = React.useState<Omit<Promo, 'id' | 'created_at' | 'updated_at'>>({
    nama: '',
    deskripsi: null,
    tipe_promo: 'DISKON_PERSEN',
    diskon_persen: null,
    diskon_nominal: null,
    psb_normal: null,
    psb_diskon_persen: null,
    psb_setelah_diskon: null,
    tanggal_mulai: '',
    tanggal_selesai: '',
    aktif: true,
    is_global: false
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

      const formData: any = {
        nama: newPromo.nama,
        deskripsi: newPromo.deskripsi ?? undefined,
        tipe_promo: newPromo.tipe_promo,
        tanggal_mulai: startDate ? startDate.toISOString() : undefined,
        tanggal_selesai: endDate ? endDate.toISOString() : undefined,
        aktif: newPromo.aktif,
        is_global: newPromo.is_global,
      };

      // DISKON_PERSEN
      if (newPromo.tipe_promo === 'DISKON_PERSEN') {
        formData.diskon_persen = newPromo.diskon_persen ? Number(newPromo.diskon_persen) : undefined;
      }

      // DISKON_NOMINAL
      if (newPromo.tipe_promo === 'DISKON_NOMINAL') {
        formData.diskon_nominal = newPromo.diskon_nominal ? Number(String(newPromo.diskon_nominal).replace(/[^\d-]/g, '')) : undefined;
      }

      // DISKON_PSB
      if (newPromo.tipe_promo === 'DISKON_PSB') {
        formData.psb_normal = newPromo.psb_normal ? Number(String(newPromo.psb_normal).replace(/[^\d-]/g, '')) : undefined;
        formData.psb_diskon_persen = newPromo.psb_diskon_persen ? Number(newPromo.psb_diskon_persen) : undefined;
        formData.psb_setelah_diskon = newPromo.psb_setelah_diskon ? Number(String(newPromo.psb_setelah_diskon).replace(/[^\d-]/g, '')) : undefined;
      }

      // COMBO
      if (newPromo.tipe_promo === 'COMBO') {
        formData.diskon_persen = newPromo.diskon_persen ? Number(newPromo.diskon_persen) : undefined;
        formData.psb_normal = newPromo.psb_normal ? Number(newPromo.psb_normal) : undefined;
        formData.psb_diskon_persen = newPromo.psb_diskon_persen ? Number(newPromo.psb_diskon_persen) : undefined;
        formData.psb_setelah_diskon = newPromo.psb_setelah_diskon ? Number(newPromo.psb_setelah_diskon) : undefined;
      }

      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/promo`,
        formData
      );

      if (res.ok) {
        await getPromos();
        setIsAddDialogOpen(false);
        setNewPromo({
          nama: '',
          deskripsi: null,
          tipe_promo: 'DISKON_PERSEN',
          diskon_persen: null,
          diskon_nominal: null,
          psb_normal: null,
          psb_diskon_persen: null,
          psb_setelah_diskon: null,
          tanggal_mulai: '',
          tanggal_selesai: '',
          aktif: true,
          is_global: false
        });
        setStartDate(undefined);
        setEndDate(undefined);
        toast.success('Promo berhasil ditambahkan');
      }
    } catch (error: any) {
      console.error('Failed to add promo:', error.message);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat menambah promo'
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
        'Error saat menghapus promo'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setEditStartDate(parseDateFromApi(promo.tanggal_mulai));
    setEditEndDate(parseDateFromApi(promo.tanggal_selesai));
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

      const promoData: any = {
        nama: editingPromo.nama,
        deskripsi: editingPromo.deskripsi ?? undefined,
        tipe_promo: editingPromo.tipe_promo,
        tanggal_mulai: formatForApi(editStartDate) ?? undefined,
        tanggal_selesai: formatForApi(editEndDate, true) ?? undefined,
        aktif: editingPromo.aktif,
        is_global: editingPromo.is_global,
      };

      // DISKON_PERSEN
      if (editingPromo.tipe_promo === 'DISKON_PERSEN') {
        promoData.diskon_persen = editingPromo.diskon_persen ? Number(editingPromo.diskon_persen) : undefined;
      }

      // DISKON_NOMINAL
      if (editingPromo.tipe_promo === 'DISKON_NOMINAL') {
        promoData.diskon_nominal = editingPromo.diskon_nominal ? Number(String(editingPromo.diskon_nominal).replace(/[^\d-]/g, '')) : undefined;
      }

      // DISKON_PSB
      if (editingPromo.tipe_promo === 'DISKON_PSB') {
        promoData.psb_normal = editingPromo.psb_normal ? Number(String(editingPromo.psb_normal).replace(/[^\d-]/g, '')) : undefined;
        promoData.psb_diskon_persen = editingPromo.psb_diskon_persen ? Number(editingPromo.psb_diskon_persen) : undefined;
        promoData.psb_setelah_diskon = editingPromo.psb_setelah_diskon ? Number(String(editingPromo.psb_setelah_diskon).replace(/[^\d-]/g, '')) : undefined;
      }

      // COMBO
      if (editingPromo.tipe_promo === 'COMBO') {
        promoData.diskon_persen = editingPromo.diskon_persen ? Number(editingPromo.diskon_persen) : undefined;
        promoData.psb_normal = editingPromo.psb_normal ? Number(editingPromo.psb_normal) : undefined;
        promoData.psb_diskon_persen = editingPromo.psb_diskon_persen ? Number(editingPromo.psb_diskon_persen) : undefined;
        promoData.psb_setelah_diskon = editingPromo.psb_setelah_diskon ? Number(editingPromo.psb_setelah_diskon) : undefined;
      }

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

  const addFormFields: FormField[] = (() => {
    const fields: FormField[] = [
      {
        id: 'namaPromo',
        label: 'Nama Promo',
        type: 'text',
        value: newPromo.nama,
        onChange: (value) => setNewPromo((prev) => ({ ...prev, nama: value })),
        required: true,
      },
      {
        id: 'tipe_promo',
        label: 'Tipe Promo',
        type: 'select',
        value: newPromo.tipe_promo,
        onChange: (value) => setNewPromo((prev) => ({ ...prev, tipe_promo: value })),
        options: [
          { value: 'DISKON_PERSEN', label: 'Diskon (Persen)' },
          { value: 'DISKON_NOMINAL', label: 'Diskon (Nominal)' },
          { value: 'DISKON_PSB', label: 'Diskon PSB' },
          { value: 'COMBO', label: 'Combo (Paket + PSB)' },
        ],
        required: true,
      },
    ];

    // DISKON_PSB - Diskon khusus biaya PSB
    if (newPromo.tipe_promo === 'DISKON_PSB') {
      fields.push(
        {
          id: 'psb_normal',
          label: 'PSB Normal',
          type: 'number',
          value: newPromo.psb_normal ?? '',
          onChange: (value) => setNewPromo((prev) => ({ ...prev, psb_normal: value })),
          min: 0,
          step: 1000,
          placeholder: 'Contoh: 500000',
        },
        {
          id: 'psb_diskon_persen',
          label: 'Diskon PSB (%)',
          type: 'number',
          value: newPromo.psb_diskon_persen ?? '',
          onChange: (value) => setNewPromo((prev) => ({ ...prev, psb_diskon_persen: value })),
          min: 0,
          max: 100,
          step: 0.01,
          placeholder: 'Contoh: 70',
        },
        {
          id: 'psb_setelah_diskon',
          label: 'PSB Setelah Diskon',
          type: 'number',
          value: newPromo.psb_setelah_diskon ?? '',
          onChange: (value) => setNewPromo((prev) => ({ ...prev, psb_setelah_diskon: value })),
          min: 0,
          step: 1000,
          placeholder: 'Contoh: 150000',
        }
      );
    }

    // DISKON_PERSEN
    if (newPromo.tipe_promo === 'DISKON_PERSEN') {
      fields.push({
        id: 'diskon_persen',
        label: 'Diskon (%)',
        type: 'number',
        value: newPromo.diskon_persen ?? '',
        onChange: (value) => setNewPromo((prev) => ({ ...prev, diskon_persen: value })),
        min: 0,
        max: 100,
        step: 0.01,
        required: true,
        placeholder: 'Contoh: 10',
      });
    }

    // DISKON_NOMINAL
    if (newPromo.tipe_promo === 'DISKON_NOMINAL') {
      fields.push({
        id: 'diskon_nominal',
        label: 'Diskon (Nominal)',
        type: 'number',
        value: newPromo.diskon_nominal ?? '',
        onChange: (value) => setNewPromo((prev) => ({ ...prev, diskon_nominal: value })),
        min: 0,
        step: 1000,
        required: true,
        placeholder: 'Contoh: 50000',
      });
    }

    fields.push({
      id: 'deskripsi',
      label: 'Deskripsi',
      type: 'text',
      value: newPromo.deskripsi,
      onChange: (value) => setNewPromo((prev) => ({ ...prev, deskripsi: value })),
      required: true,
    });

    // COMBO - Kombinasi diskon paket + PSB
    if (newPromo.tipe_promo === 'COMBO') {
      fields.push(
        {
          id: 'diskon_persen_combo',
          label: 'Diskon Paket Bulanan (%)',
          type: 'number',
          value: newPromo.diskon_persen ?? '',
          onChange: (value) => setNewPromo((prev) => ({ ...prev, diskon_persen: value })),
          min: 0,
          max: 100,
          step: 0.01,
          placeholder: 'Contoh: 10',
        },
        {
          id: 'psb_normal',
          label: 'PSB Normal',
          type: 'number',
          value: newPromo.psb_normal ?? '',
          onChange: (value) => setNewPromo((prev) => ({ ...prev, psb_normal: value })),
          min: 0,
          step: 1000,
          placeholder: 'Contoh: 500000',
        },
        {
          id: 'psb_diskon_persen',
          label: 'Diskon PSB (%)',
          type: 'number',
          value: newPromo.psb_diskon_persen ?? '',
          onChange: (value) => setNewPromo((prev) => ({ ...prev, psb_diskon_persen: value })),
          min: 0,
          max: 100,
          step: 0.01,
          placeholder: 'Contoh: 20',
        },
        {
          id: 'psb_setelah_diskon',
          label: 'PSB Setelah Diskon',
          type: 'number',
          value: newPromo.psb_setelah_diskon ?? '',
          onChange: (value) => setNewPromo((prev) => ({ ...prev, psb_setelah_diskon: value })),
          min: 0,
          step: 1000,
          placeholder: 'Contoh: 400000',
        }
      );
    }

    fields.push(
      {
        id: 'mulai',
        label: 'Tanggal Mulai',
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
        label: 'Tanggal Berakhir',
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
        id: 'is_global',
        label: 'Terapkan ke Semua Paket',
        type: 'select',
        value: newPromo.is_global,
        onChange: (value) =>
          setNewPromo((prev) => ({
            ...prev,
            is_global: typeof value === 'boolean' ? value : value === 'true',
          })),
        options: [
          { value: 'true', label: 'Terapkan' },
          { value: 'false', label: 'Tidak' },
        ],
      },
      {
        id: 'aktif',
        label: 'Status',
        type: 'select',
        value: newPromo.aktif,
        onChange: (value) =>
          setNewPromo((prev) => ({
            ...prev,
            aktif: typeof value === 'boolean' ? value : value === 'true',
          })),
        options: [
          { value: 'true', label: 'Aktif' },
          { value: 'false', label: 'Nonaktif' },
        ],
      }
    );

    return fields;
  })();

  const editFormFields: FormField[] = editingPromo
    ? (() => {
        const fields: FormField[] = [
          {
            id: 'edit-namaPromo',
            label: 'Nama Promo',
            type: 'text',
            value: editingPromo.nama,
            onChange: (value) =>
              setEditingPromo((prev) => (prev ? { ...prev, nama: value } : null)),
            required: true,
          },
          {
            id: 'edit-tipe_promo',
            label: 'Tipe Promo',
            type: 'select',
            value: editingPromo.tipe_promo,
            onChange: (value) =>
              setEditingPromo((prev) => (prev ? { ...prev, tipe_promo: value } : null)),
            options: [
              { value: 'HARGA_KHUSUS', label: 'Harga Khusus' },
              { value: 'DISKON_PERSEN', label: 'Diskon (Persen)' },
              { value: 'DISKON_NOMINAL', label: 'Diskon (Nominal)' },
              { value: 'DISKON_PSB', label: 'Diskon PSB' },
              { value: 'COMBO', label: 'Combo (Paket + PSB)' },
            ],
            required: true,
          },
        ];

        // DISKON_PERSEN
        if (editingPromo.tipe_promo === 'DISKON_PERSEN') {
          fields.push({
            id: 'edit-diskon_persen',
            label: 'Diskon (%)',
            type: 'number',
            value: editingPromo.diskon_persen ?? '',
            onChange: (value) =>
              setEditingPromo((prev) => (prev ? { ...prev, diskon_persen: value } : null)),
            min: 0,
            max: 100,
            step: 0.01,
            required: true,
          });
        }

        // DISKON_NOMINAL
        if (editingPromo.tipe_promo === 'DISKON_NOMINAL') {
          fields.push({
            id: 'edit-diskon_nominal',
            label: 'Diskon (Nominal)',
            type: 'number',
            value: editingPromo.diskon_nominal ?? '',
            onChange: (value) =>
              setEditingPromo((prev) => (prev ? { ...prev, diskon_nominal: value } : null)),
            min: 0,
            step: 1000,
            required: true,
          });
        }

        fields.push({
          id: 'edit-deskripsi',
          label: 'Deskripsi',
          type: 'text',
          value: editingPromo.deskripsi,
          onChange: (value) =>
            setEditingPromo((prev) => (prev ? { ...prev, deskripsi: value } : null)),
          required: true,
        });

        // DISKON_PSB
        if (editingPromo.tipe_promo === 'DISKON_PSB') {
          fields.push(
            {
              id: 'edit-psb_normal',
              label: 'PSB Normal',
              type: 'number',
              value: editingPromo.psb_normal ? Number(String(editingPromo.psb_normal).replace(/[^\d-]/g, '')) : '',
              onChange: (value) =>
                setEditingPromo((prev) => (prev ? { ...prev, psb_normal: value } : null)),
              min: 0,
              step: 1000,
            },
            {
              id: 'edit-psb_diskon_persen',
              label: 'Diskon PSB (%)',
              type: 'number',
              value: editingPromo.psb_diskon_persen ?? '',
              onChange: (value) =>
                setEditingPromo((prev) => (prev ? { ...prev, psb_diskon_persen: value } : null)),
              min: 0,
              max: 100,
              step: 0.01,
            },
            {
              id: 'edit-psb_setelah_diskon',
              label: 'PSB Setelah Diskon',
              type: 'number',
              value: editingPromo.psb_setelah_diskon ? Number(String(editingPromo.psb_setelah_diskon).replace(/[^\d-]/g, '')) : '',
              onChange: (value) =>
                setEditingPromo((prev) => (prev ? { ...prev, psb_setelah_diskon: value } : null)),
              min: 0,
              step: 1000,
            }
          );
        }

        // COMBO
        if (editingPromo.tipe_promo === 'COMBO') {
          fields.push(
            {
              id: 'edit-diskon_persen_combo',
              label: 'Diskon Paket Bulanan (%)',
              type: 'number',
              value: editingPromo.diskon_persen ?? '',
              onChange: (value) =>
                setEditingPromo((prev) => (prev ? { ...prev, diskon_persen: value } : null)),
              min: 0,
              max: 100,
              step: 0.01,
            },
            {
              id: 'edit-psb_normal',
              label: 'PSB Normal',
              type: 'number',
              value: editingPromo.psb_normal ?? '',
              onChange: (value) =>
                setEditingPromo((prev) => (prev ? { ...prev, psb_normal: value } : null)),
              min: 0,
              step: 1000,
            },
            {
              id: 'edit-psb_diskon_persen',
              label: 'Diskon PSB (%)',
              type: 'number',
              value: editingPromo.psb_diskon_persen ?? '',
              onChange: (value) =>
                setEditingPromo((prev) => (prev ? { ...prev, psb_diskon_persen: value } : null)),
              min: 0,
              max: 100,
              step: 0.01,
            },
            {
              id: 'edit-psb_setelah_diskon',
              label: 'PSB Setelah Diskon',
              type: 'number',
              value: editingPromo.psb_setelah_diskon ?? '',
              onChange: (value) =>
                setEditingPromo((prev) => (prev ? { ...prev, psb_setelah_diskon: value } : null)),
              min: 0,
              step: 1000,
            }
          );
        }

        fields.push(
          {
            id: 'edit-mulai',
            label: 'Tanggal Mulai',
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
            label: 'Tanggal Berakhir',
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
            id: 'edit-is_global',
            label: 'Terapkan ke Semua Paket',
            type: 'select',
            value: Boolean(editingPromo.is_global),
            onChange: (value) =>
              setEditingPromo((prev) =>
                prev ? { ...prev, is_global: typeof value === 'boolean' ? value : value === 'true' } : null
              ),
            options: [
              { value: 'true', label: 'Terapkan' },
              { value: 'false', label: 'Tidak' },
            ],
          },
          {
            id: 'edit-aktif',
            label: 'Status',
            type: 'select',
            value: Boolean(editingPromo.aktif),
            onChange: (value) =>
              setEditingPromo((prev) =>
                prev ? { ...prev, aktif: typeof value === 'boolean' ? value : value === 'true' } : null
              ),
            options: [
              { value: 'true', label: 'Aktif' },
              { value: 'false', label: 'Nonaktif' },
            ],
          }
        );

        return fields;
      })()
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