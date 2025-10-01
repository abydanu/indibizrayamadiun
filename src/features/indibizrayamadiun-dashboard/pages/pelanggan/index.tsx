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
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import type {
  Pelanggan,
  PelangganValidationPayload,
} from '../../types/pelanggan';
import type { ApiResult } from '../../types/api';
import CustomFileInput from '@/shared/components/custom/custom-file-input';
import { getDisplayErrorMessage } from '@/utils/api-error';
import { Button } from '@/shared/ui/button';

type SimpleMap = { id: string; nama: string };
type PaketLite = {
  id: string;
  nama: string;
  bandwith?: number | string;
  price?: number | string;
  final_price?: number | string;
  applied_promos?: { id: string; nama: string; diskon?: number }[];
};
type SalesLite = {
  id: string;
  nama: string;
  kode_sales?: string;
  datel_nama?: string;
  agency_nama?: string;
};

const registrasiSkeletonColumns = [
  { width: 'w-6', height: 'h-4' },
  { width: 'w-[160px]', height: 'h-4' },
  { width: 'w-[160px]', height: 'h-4' },
  { width: 'w-[220px]', height: 'h-4' },
  { width: 'w-[120px]', height: 'h-4' },
  { width: 'w-[120px]', height: 'h-4' },
  { width: 'w-[220px]', height: 'h-4' },
  { width: 'w-[160px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[180px]', height: 'h-4' },
  { width: 'w-[140px]', height: 'h-6', rounded: true },
  { width: 'w-8', height: 'h-8' },
];

export const createColumns = (
  handleEdit: (item: Pelanggan) => void,
  handleValidate: (item: Pelanggan) => void,
  handleDelete: (id: string) => void,
  isSubmitting: boolean
): ColumnDef<Pelanggan>[] => [
  {
    id: 'select',
    header: '#',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: () => <span className="font-extrabold">Tanggal Input</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at') as string);
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
  {
    accessorKey: 'datel_nama',
    header: () => <span className="font-extrabold">Datel Pemasangan</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('datel_nama')}</div>
    ),
  },
  {
    accessorKey: 'nama',
    header: () => <span className="font-extrabold">Nama Usaha</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('nama')}</div>
    ),
  },
  {
    accessorKey: 'nama_pic',
    header: () => <span className="font-extrabold">Nama PIC</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('nama_pic')}</div>
    ),
  },
  {
    accessorKey: 'no_hp_1',
    header: () => <span className="font-extrabold">No. HP 1</span>,
    cell: ({ row }) => <div>{row.getValue('no_hp_1')}</div>,
  },
  {
    accessorKey: 'no_hp_2',
    header: () => <span className="font-extrabold">No. HP 2</span>,
    cell: ({ row }) => <div>{row.getValue('no_hp_2') || '-'}</div>,
  },
  {
    accessorKey: 'ttl_pic',
    header: () => <span className="font-extrabold">Tempat Tgl Lahir PIC</span>,
    cell: ({ row }) => <div>{row.getValue('ttl_pic')}</div>,
  },
  {
    accessorKey: 'no_ktp',
    header: () => <span className="font-extrabold">No KTP/NIK PIC</span>,
    cell: ({ row }) => <div>{row.getValue('no_ktp')}</div>,
  },
  {
    accessorKey: 'email',
    header: () => <span className="font-extrabold">Email</span>,
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return email ? (
        <a
          href={`mailto:${email}`}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {email}
        </a>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: 'alamat',
    header: () => <span className="font-extrabold">Alamat</span>,
    cell: ({ row }) => (
      <div className="line-clamp-1 max-w-[260px]">{row.getValue('alamat')}</div>
    ),
  },
  {
    accessorKey: 'koordinat',
    header: () => <span className="font-extrabold">Koordinat</span>,
    cell: ({ row }) => <div>{row.getValue('koordinat') || '-'}</div>,
  },
  {
    accessorKey: 'paket_nama',
    header: () => <span className="font-extrabold">Paket</span>,
    cell: ({ row }) => (
      <div className="font-medium">
        {(row.getValue('paket_nama') as string) || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'sales_nama',
    header: () => <span className="font-extrabold">Sales</span>,
    cell: ({ row }) => (
      <div className="font-medium">
        {(row.getValue('sales_nama') as string) || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'foto_ktp',
    header: () => <span className="font-extrabold">Foto KTP</span>,
    cell: ({ row }) => {
      const url = row.getValue('foto_ktp') as string;
      return url ? (
        <a
          href={url}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Lihat
        </a>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: 'foto_selfie',
    header: () => <span className="font-extrabold">Selfie dengan KTP</span>,
    cell: ({ row }) => {
      const url = row.getValue('foto_selfie') as string;
      return url ? (
        <a
          href={url}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Lihat
        </a>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: 'foto_lokasi',
    header: () => <span className="font-extrabold">Foto Lokasi Instalasi</span>,
    cell: ({ row }) => {
      const url = row.getValue('foto_lokasi') as string;
      return url ? (
        <a
          href={url}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Lihat
        </a>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: 'bukti_usaha',
    header: () => <span className="font-extrabold">Bukti Usaha</span>,
    cell: ({ row }) => {
      const url = row.getValue('bukti_usaha') as string;
      return url ? (
        <a
          href={url}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Lihat
        </a>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: 'bukti_niwp',
    header: () => (
      <span className="font-extrabold">Bukti NIB & NPWP Usaha</span>
    ),
    cell: ({ row }) => {
      const url = row.getValue('bukti_niwp') as string;
      return url ? (
        <a
          href={url}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Lihat
        </a>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: 'sales_kode',
    header: () => <span className="font-extrabold">Kode Sales</span>,
    cell: ({ row }) => (
      <div>{(row.getValue('sales_kode') as string) || '-'}</div>
    ),
  },
  {
    accessorKey: 'sales_agency_nama',
    header: () => <span className="font-extrabold">Agency Sales</span>,
    cell: ({ row }) => (
      <div>{(row.getValue('sales_agency_nama') as string) || '-'}</div>
    ),
  },
  {
    accessorKey: 'sales_datel_nama',
    header: () => <span className="font-extrabold">Asal Datel Sales</span>,
    cell: ({ row }) => (
      <div>{(row.getValue('sales_datel_nama') as string) || '-'}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <span className="font-extrabold">Status</span>,
    cell: ({ row }) => {
      const raw = (row.getValue('status') as string) || '-';
      const status = raw.replaceAll('_', ' ');
      const isOk = raw === 'PS';
      return (
        <Badge
          variant="outline"
          className={`capitalize font-medium ${
            isOk
              ? 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/50'
              : 'text-yellow-700 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-950/50'
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <ActionDropdown
          onEdit={() => handleEdit(item)}
          onSecondary={() => handleValidate(item)}
          secondaryLabel="Validasi"
          onDelete={() => handleDelete(item.id)}
          itemName={item.nama}
          isSubmitting={isSubmitting}
        />
      );
    },
  },
];

export default function ManageRegistrasi() {
  const [items, setItems] = React.useState<Pelanggan[]>([]);
  const [editing, setEditing] = React.useState<Pelanggan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isValidateDialogOpen, setIsValidateDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState<ServerPaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [datels, setDatels] = React.useState<SimpleMap[]>([]);
  const [pakets, setPakets] = React.useState<PaketLite[]>([]);
  const [sales, setSales] = React.useState<SalesLite[]>([]);

  const formatPaketDisplay = React.useCallback((paket?: PaketLite) => {
    if (!paket) return undefined;
    const band = paket.bandwith ? `${paket.bandwith} Mbps` : '-';
    const name = paket.nama || '-';
    const truncatedName = name.length > 30 ? `${name.slice(0, 30)}…` : name;
    const promos =
      paket.applied_promos && paket.applied_promos.length > 0
        ? ` + Promo(${paket.applied_promos.map((p) => p.nama).join(', ')})`
        : '';
    const priceNumber = Number(paket.final_price ?? paket.price ?? 0);
    const priceText = priceNumber ? priceNumber.toLocaleString('id-ID') : '0';
    const fullText = `[${band}] ${truncatedName}${promos} (Rp ${priceText})`;
    return fullText.length > 60 ? `${fullText.slice(0, 60)}…` : fullText;
  }, []);

  const formatSalesDisplay = React.useCallback((s?: SalesLite) => s?.nama, []);

  const resolveNames = React.useCallback(
    (list: Pelanggan[]): Pelanggan[] => {
      const datelMap = new Map(datels.map((d) => [d.id, d.nama]));
      const paketMapFull = new Map(pakets.map((p) => [p.id, p]));
      const salesMapFull = new Map(sales.map((s) => [s.id, s]));
      return list.map((it) => {
        const paket = paketMapFull.get(it.paket_id);
        const salesData = salesMapFull.get(it.sales_id);
        return {
          ...it,
          datel_nama: datelMap.get(it.datel_id) || undefined,
          paket_nama: formatPaketDisplay(paket) || paket?.nama,
          sales_nama: formatSalesDisplay(salesData) || salesData?.nama,
          sales_kode: salesData?.kode_sales,
          sales_datel_nama: salesData?.datel_nama,
          sales_agency_nama: salesData?.agency_nama,
        };
      });
    },
    [datels, pakets, sales, formatPaketDisplay, formatSalesDisplay]
  );

  const fetchRegistrasi = React.useCallback(
    async (page?: number, limit?: number) => {
      setLoading(true);
      try {
        const currentPage = page || pagination.page;
        const currentLimit = limit || pagination.limit;
        const res = await api.get<ApiResult<Pelanggan>>(
          `${process.env.NEXT_PUBLIC_API_URL}/registrasi_indibiz?page=${currentPage}&limit=${currentLimit}`
        );
        const { data, pagination: pag } = (res.data as any).result;
        setItems(resolveNames(data ?? []));
        setPagination({
          page: pag.page,
          limit: pag.limit,
          total: pag.total,
          totalPages: pag.totalPages,
        });
      } catch (error) {
        console.error('Error fetching registrasi:', error);
        toast.error('Gagal Menampilkan data!');
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [resolveNames]
  );

  const fetchDatels = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/datel/list`
      );
      setDatels(
        ((res.data as any).data || []).map((d: any) => ({
          id: d.id,
          nama: d.nama,
        }))
      );
    } catch (error) {
      console.error('Error fetching datels:', error);
    }
  }, []);

  const fetchPakets = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/paket/list`
      );
      const list: PaketLite[] = ((res.data as any).data || []).map(
        (p: any) => ({
          id: p.id,
          nama: p.nama,
          bandwith: p.bandwith,
          final_price: p.final_price,
          applied_promos: Array.isArray(p.paket_promos)
            ? p.paket_promos.map((pp: any) => ({
                id: pp?.promo?.id,
                nama: pp?.promo?.nama,
              }))
            : [],
        })
      );
      setPakets(list);
    } catch (error) {
      console.error('Error fetching pakets:', error);
    }
  }, []);

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
        `${process.env.NEXT_PUBLIC_API_URL}/registrasi_indibiz/import`,
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

  const fetchSales = React.useCallback(async () => {
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/list`
      );
      const list: SalesLite[] = ((res.data as any).data || []).map(
        (s: any) => ({
          id: s.id,
          nama: s.nama,
          kode_sales: s.kode_sales,
          datel_nama: s.datel?.nama,
          agency_nama: s.agency?.nama,
        })
      );
      setSales(list);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }, []);

  const handlePaginationChange = (page: number, limit: number) => {
    fetchRegistrasi(page, limit);
  };

  const exportToExcel = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResult<Pelanggan>>(
        `${process.env.NEXT_PUBLIC_API_URL}/registrasi_indibiz?page=1&limit=1000`
      );
      const { data } = (res.data as any).result;
      const resolved = resolveNames(data ?? []);
      const rows = resolved.map((it) => ({
        'Tanggal Input': new Date(it.created_at as any).toLocaleDateString(
          'id-ID'
        ),
        'Datel Pemasangan': (it as any).datel_nama || '-',
        'Nama Usaha': it.nama,
        'Nama PIC': it.nama_pic,
        'No. HP 1': it.no_hp_1,
        'No. HP 2': it.no_hp_2 || '-',
        'Tempat Tgl Lahir PIC': it.ttl_pic || '-',
        'No KTP/NIK PIC': it.no_ktp || '-',
        Email: it.email || '-',
        Alamat: it.alamat,
        Koordinat: (it as any).koordinat || (it as any).kordinat || '-',
        Paket: (it as any).paket_nama || '-',
        Sales: (it as any).sales_nama || '-',
        'Foto KTP': (it as any).foto_ktp || '-',
        'Selfie Dengan KTP': (it as any).foto_selfie || '-',
        'Foto Lokasi Instalasi': (it as any).foto_lokasi || '-',
        'Bukti Usaha': (it as any).bukti_usaha || '-',
        'Bukti NIB dan NIWP Usaha': (it as any).bukti_niwp || '-',
        'Kode Sales': (it as any).sales_kode || '-',
        'Agency Sales': (it as any).sales_agency_nama || '-',
        'Asal Datel Sales': (it as any).sales_datel_nama || '-',
        'Nomor AO': (it as any).nomer_ao || '-',
        Status: (it.status as string)?.replaceAll('_', ' ') || '-',
        'Keteranngan Status': (it as any).keterangan || '-',
      }));
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Pelanggan');
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      XLSX.writeFile(wb, `pelanggan-${dateStr}.xlsx`);
      toast.success('Export Data Pelanggan berhasil');
    } catch (error) {
      console.error('Export Excel error:', error);
      const errorMessage = getDisplayErrorMessage(error, 'Gagal export Excel');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [resolveNames]);

  const handleValidate = (item: Pelanggan) => {
    setEditing(item);
    setIsValidateDialogOpen(true);
  };

  const handleEdit = (item: Pelanggan) => {
    setEditing(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/registrasi_indibiz/${id}`
      );
      if (res.ok) {
        await fetchRegistrasi();
        toast.success('Registrasi berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting registrasi:', error);
      const errorMessage = getDisplayErrorMessage(
        error,
        'Error saat memperbarui paket'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [validationForm, setValidationForm] = React.useState<
    Required<Pick<PelangganValidationPayload, 'status'>> &
      Partial<Pick<PelangganValidationPayload, 'nomer_ao' | 'keterangan'>>
  >({ status: 'PS', nomer_ao: '', keterangan: '' });

  React.useEffect(() => {
    if (editing) {
      setValidationForm({
        status: (editing.status as any) || 'PS',
        nomer_ao: editing.nomer_ao || '',
        keterangan: '',
      });
    }
  }, [editing]);

  const handleSaveValidation = async () => {
    if (!editing) return;
    setIsSubmitting(true);
    try {
      const payload: PelangganValidationPayload = {
        status: validationForm.status,
        nomer_ao: validationForm.nomer_ao,
        keterangan: validationForm.keterangan,
      };
      const res = await api.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/registrasi_indibiz/${editing.id}/status`,
        payload
      );
      if (res.ok) {
        await fetchRegistrasi();
        toast.success('Validasi berhasil disimpan');
        setIsValidateDialogOpen(false);
        setEditing(null);
      }
    } catch (error) {
      console.error('Error validating registrasi:', error);
      const errorMessage = getDisplayErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFormFields: FormField[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: validationForm.status as string,
      onChange: (value) =>
        setValidationForm((p) => ({ ...p, status: value as any })),
      options: [
        { value: 'PS', label: 'PS' },
        { value: 'CANCEL', label: 'CANCEL' },
        { value: 'KENDALA', label: 'KENDALA' },
        { value: 'REVOKE', label: 'REVOKE' },
        { value: 'QC1', label: 'QC1' },
        { value: 'PI', label: 'PI' },
        { value: 'FALLOUT', label: 'FALLOUT' },
        { value: 'WFM_UNSC', label: 'WFM UNSC' },
        { value: 'PAPERLESS', label: 'PAPERLESS' },
        { value: 'DECLINE_FCC', label: 'DECLINE FCC' },
        { value: 'PT3_WAITING_AKTIVASI', label: 'PT3 WAITING AKTIVASI' },
        { value: 'FOLLOWUP_TO_COMPLETE', label: 'FOLLOWUP TO COMPLETE' },
      ],
      required: true,
    },
    {
      id: 'nomer_ao',
      label: 'Nomor AO',
      type: 'text',
      value: validationForm.nomer_ao || '',
      onChange: (value) =>
        setValidationForm((p) => ({ ...p, nomer_ao: value })),
      placeholder: 'Masukkan nomor AO',
    },
    {
      id: 'keterangan',
      label: 'Keterangan',
      type: 'textarea',
      value: validationForm.keterangan || '',
      onChange: (value) =>
        setValidationForm((p) => ({ ...p, keterangan: value })),
      placeholder: 'Tambahkan keterangan validasi (opsional)',
    },
  ];

  const editFormFields: FormField[] = editing
    ? [
        {
          id: 'edit-datel_id',
          label: 'Datel Pemasangan',
          type: 'select',
          value: editing.datel_id,
          onChange: (v) =>
            setEditing((p) => (p ? { ...p, datel_id: v as string } : p)),
          options: datels.map((d) => ({ value: d.id, label: d.nama })),
          required: true,
        },
        {
          id: 'edit-paket_id',
          label: 'Paket',
          type: 'select',
          value: editing.paket_id,
          onChange: (v) =>
            setEditing((p) => (p ? { ...p, paket_id: v as string } : p)),
          options: pakets.map((p) => ({
            value: p.id,
            label: formatPaketDisplay(p) || p.nama,
          })),
          required: true,
        },
        {
          id: 'edit-sales_id',
          label: 'Sales',
          type: 'select',
          value: editing.sales_id,
          onChange: (v) =>
            setEditing((p) => (p ? { ...p, sales_id: v as string } : p)),
          options: sales.map((s) => ({ value: s.id, label: s.nama })),
          required: true,
        },
        {
          id: 'edit-nama',
          label: 'Nama Usaha',
          type: 'text',
          value: editing.nama,
          onChange: (v) => setEditing((p) => (p ? { ...p, nama: v } : p)),
          required: true,
        },
        {
          id: 'edit-nama_pic',
          label: 'Nama PIC',
          type: 'text',
          value: editing.nama_pic,
          onChange: (v) => setEditing((p) => (p ? { ...p, nama_pic: v } : p)),
          required: true,
        },
        {
          id: 'edit-email',
          label: 'Email',
          type: 'text',
          value: editing.email,
          onChange: (v) => setEditing((p) => (p ? { ...p, email: v } : p)),
        },
        {
          id: 'edit-no_hp_1',
          label: 'No. HP 1',
          type: 'text',
          value: editing.no_hp_1,
          onChange: (v) => setEditing((p) => (p ? { ...p, no_hp_1: v } : p)),
          required: true,
        },
        {
          id: 'edit-no_hp_2',
          label: 'No. HP 2',
          type: 'text',
          value: editing.no_hp_2 || '',
          onChange: (v) => setEditing((p) => (p ? { ...p, no_hp_2: v } : p)),
        },
        {
          id: 'edit-ttl_pic',
          label: 'Tempat Tgl Lahir PIC',
          type: 'text',
          value: editing.ttl_pic,
          onChange: (v) => setEditing((p) => (p ? { ...p, ttl_pic: v } : p)),
        },
        {
          id: 'edit-no_ktp',
          label: 'No KTP/NIK PIC',
          type: 'text',
          value: editing.no_ktp,
          onChange: (v) => setEditing((p) => (p ? { ...p, no_ktp: v } : p)),
        },
        {
          id: 'edit-alamat',
          label: 'Alamat',
          type: 'textarea',
          value: editing.alamat,
          onChange: (v) => setEditing((p) => (p ? { ...p, alamat: v } : p)),
          required: true,
        },
        {
          id: 'edit-kordinat',
          label: 'Koordinat',
          type: 'text',
          value: editing.kordinat,
          onChange: (v) => setEditing((p) => (p ? { ...p, kordinat: v } : p)),
        },
        {
          id: 'edit-foto_ktp',
          label: 'Foto KTP',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <CustomFileInput
                id="edit-foto_ktp"
                value={(editing as any).foto_ktp as any}
                onChange={(file: File | null) =>
                  setEditing((p) => (p ? { ...p, foto_ktp: file as any } : p))
                }
              />
            </div>
          ),
        },
        {
          id: 'edit-foto_selfie',
          label: 'Selfie dengan KTP',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <CustomFileInput
                id="edit-foto_selfie"
                value={(editing as any).foto_selfie as any}
                onChange={(file: File | null) =>
                  setEditing((p) =>
                    p ? { ...p, foto_selfie: file as any } : p
                  )
                }
              />
            </div>
          ),
        },
        {
          id: 'edit-bukti_usaha',
          label: 'Bukti Usaha',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <CustomFileInput
                id="edit-bukti_usaha"
                value={(editing as any).bukti_usaha as any}
                onChange={(file: File | null) =>
                  setEditing((p) =>
                    p ? { ...p, bukti_usaha: file as any } : p
                  )
                }
              />
            </div>
          ),
        },
        {
          id: 'edit-bukti_niwp',
          label: 'Bukti NIB & NPWP',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <CustomFileInput
                id="edit-bukti_niwp"
                value={(editing as any).bukti_niwp as any}
                onChange={(file: File | null) =>
                  setEditing((p) => (p ? { ...p, bukti_niwp: file as any } : p))
                }
              />
            </div>
          ),
        },
        {
          id: 'edit-foto_lokasi',
          label: 'Foto Lokasi Instalasi',
          type: 'custom',
          customComponent: (
            <div className="col-span-3">
              <CustomFileInput
                id="edit-foto_lokasi"
                value={(editing as any).foto_lokasi as any}
                onChange={(file: File | null) =>
                  setEditing((p) =>
                    p ? { ...p, foto_lokasi: file as any } : p
                  )
                }
              />
            </div>
          ),
        },
      ]
    : [];

  const columns = React.useMemo(
    () => createColumns(handleEdit, handleValidate, handleDelete, isSubmitting),
    [isSubmitting]
  );

  React.useEffect(() => {
    Promise.all([fetchDatels(), fetchPakets(), fetchSales()]);
  }, []);

  React.useEffect(() => {
    if (datels.length || pakets.length || sales.length) {
      fetchRegistrasi();
    }
  }, [datels.length, pakets.length, sales.length]);

  return (
    <>
      <PageHeader title="Pelanggan" />
      <Main>
        <PageTitle
          title="Pelanggan"
          description="Daftar pelanggan. Validasi status atau hapus data."
          showImportButton
          showExportButton
          importButtonText="Import Data"
          exportButtonText='Export Data'
          onImportClick={() => setIsImportDialogOpen(true)}
          onExportClick={exportToExcel}
        >
        </PageTitle>

        <FormDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          title="Import Pelanggan dari Excel"
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
          open={isValidateDialogOpen}
          onOpenChange={setIsValidateDialogOpen}
          title="Validasi Registrasi"
          description="Ubah status, nomor AO, atau keterangan registrasi."
          fields={validateFormFields}
          onSubmit={handleSaveValidation}
          submitText="Simpan Validasi"
          isSubmitting={isSubmitting}
        />

        <FormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Pelanggan"
          description="Perbarui data pelanggan. Klik simpan setelah selesai."
          fields={editFormFields}
          maxWidth="sm:max-w-[880px]"
          onSubmit={async () => {
            if (!editing) return;
            setIsSubmitting(true);
            try {
              const payload: any = {
                nama: editing.nama,
                datel_id: editing.datel_id,
                paket_id: editing.paket_id,
                sales_id: editing.sales_id,
                no_hp_1: editing.no_hp_1,
                no_hp_2: editing.no_hp_2 || '',
                kordinat: (editing as any).kordinat || '',
                alamat: editing.alamat,
                nama_pic: editing.nama_pic,
                ttl_pic: editing.ttl_pic,
                no_ktp: editing.no_ktp,
                email: editing.email || '',
              };
              const formData = new FormData();
              Object.entries(payload).forEach(([key, value]) => {
                formData.append(
                  key,
                  value !== undefined && value !== null ? String(value) : ''
                );
              });
              const res = await api.put(
                `${process.env.NEXT_PUBLIC_API_URL}/registrasi_indibiz/${editing.id}`,
                formData,
                { timeout: 120000 }
              );
              if (res.ok) {
                await fetchRegistrasi();
                toast.success('Pelanggan berhasil diperbarui');
                setIsEditDialogOpen(false);
                setEditing(null);
              }
            } catch (error) {
              console.error('Error updating pelanggan:', error);
              const errorMessage = getDisplayErrorMessage(error);
              toast.error(errorMessage);
            } finally {
              setIsSubmitting(false);
            }
          }}
          submitText="Simpan"
          isSubmitting={isSubmitting}
        />

        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          searchKey="nama"
          searchPlaceholder="Cari pelanggan..."
          emptyMessage="Tidak ada data Pelanggan"
          loadingComponent={
            <TableSkeleton rows={10} columns={registrasiSkeletonColumns} />
          }
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Main>
    </>
  );
}
