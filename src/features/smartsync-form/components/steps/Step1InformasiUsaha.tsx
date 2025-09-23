import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Info } from 'lucide-react';
import { ScrollableSelect, type ScrollableSelectOption } from '@/shared/components/forms/scrollable-select';
import CustomFileInput from '@/shared/components/custom/CustomFileInput';
import LocationPicker from '@/shared/components/custom/LocationPicker';
import { SmartFormData } from '../../hooks/useSmartForm';
import type { Datel } from '@/features/smartsync-dashboard/types/sales';

interface Step1InformasiUsahaProps {
  form: UseFormReturn<SmartFormData>;
  formData: SmartFormData;
  updateFormField: (field: keyof SmartFormData, value: any) => void;
  datels: Datel[];
  loadingDatels: boolean;
  tooltipFotoLokasi: boolean;
  setTooltipFotoLokasi: (value: boolean) => void;
  tooltipBuktiUsaha: boolean;
  setTooltipBuktiUsaha: (value: boolean) => void;
}

const Step1InformasiUsaha: React.FC<Step1InformasiUsahaProps> = ({
  form,
  formData,
  updateFormField,
  datels,
  loadingDatels,
  tooltipFotoLokasi,
  setTooltipFotoLokasi,
  tooltipBuktiUsaha,
  setTooltipBuktiUsaha,
}) => {
  return (
    <Card className="shadow-lg rounded-2xl border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Informasi Usaha & Alamat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Nama Usaha */}
          <div className="grid gap-2">
            <Label htmlFor="nama_usaha">
              NAMA USAHA (Diikuti Nama Datel)
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_usaha"
              type="text"
              placeholder="ex : Toko Barokah Ponorogo"
              {...form.register('nama_usaha', {
                required: 'Nama usaha wajib diisi',
                minLength: {
                  value: 3,
                  message: 'Minimal 3 karakter'
                }
              })}
            />
            {form.formState.errors.nama_usaha && (
              <p className="text-sm text-red-500">
                {form.formState.errors.nama_usaha.message}
              </p>
            )}
          </div>

          {/* Datel Pemesanan */}
          <div className="grid gap-2">
            <Label htmlFor="datel_pemesanan">
              DATEL PEMESANAN<span className="text-red-500">*</span>
            </Label>
            <input
              type="hidden"
              {...form.register('datel_pemesanan', {
                required: 'Datel pemesanan wajib diisi'
              })}
            />
            <ScrollableSelect
              options={datels.map((datel): ScrollableSelectOption => ({
                value: datel.id,
                label: datel.nama,
              }))}
              value={form.watch('datel_pemesanan') || ''}
              onChange={(value) => {
                console.log('Selected datel:', value);
                form.setValue('datel_pemesanan', value);
                updateFormField('datel_pemesanan', value);
              }}
              placeholder={loadingDatels ? "Memuat data datel..." : "Pilih Datel..."}
              searchPlaceholder="Cari datel..."
              emptyMessage="Tidak ada datel ditemukan."
              disabled={loadingDatels}
            />
            {form.formState.errors.datel_pemesanan && (
              <p className="text-sm text-red-500">
                {form.formState.errors.datel_pemesanan.message}
              </p>
            )}
          </div>

          {/* No HP */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="hp1">
                NO HP CP 1<span className="text-red-500">*</span>
              </Label>
              <Input
                id="hp1"
                type="text"
                placeholder="08xxxxxxxxxx"
                {...form.register('hp1', {
                  required: 'No HP CP 1 wajib diisi',
                  minLength: {
                    value: 10,
                    message: 'Nomor HP terlalu pendek'
                  },
                  maxLength: {
                    value: 13,
                    message: 'Nomor HP terlalu panjang'
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Hanya angka yang diperbolehkan'
                  }
                })}
              />
              {form.formState.errors.hp1 && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.hp1.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hp2">
                NO HP CP 2
              </Label>
              <Input
                id="hp2"
                type="text"
                placeholder="08xxxxxxxxxx (opsional)"
                {...form.register('hp2', {
                  minLength: {
                    value: 10,
                    message: 'Nomor HP terlalu pendek'
                  },
                  maxLength: {
                    value: 13,
                    message: 'Nomor HP terlalu panjang'
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: 'Hanya angka yang diperbolehkan'
                  }
                })}
              />
              {form.formState.errors.hp2 && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.hp2.message}
                </p>
              )}
            </div>
          </div>

          {/* Alamat Pemasangan */}
          <div className="grid gap-2">
            <Label htmlFor="alamat_pemasangan">
              ALAMAT PEMASANGAN<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="alamat_pemasangan"
              placeholder="Masukkan alamat lengkap pemasangan"
              {...form.register('alamat_pemasangan', {
                required: 'Alamat pemasangan wajib diisi',
                minLength: {
                  value: 5,
                  message: 'Alamat terlalu pendek'
                }
              })}
            />
            {form.formState.errors.alamat_pemasangan && (
              <p className="text-sm text-red-500">
                {form.formState.errors.alamat_pemasangan.message}
              </p>
            )}
          </div>

          {/* Koordinat Alamat */}
          <div className="grid gap-2">
            <Label htmlFor="koordinat_alamat">
              KOORDINAT ALAMAT<span className="text-red-500">*</span>
            </Label>
            <input
              type="hidden"
              {...form.register('koordinat_alamat', {
                required: 'Koordinat alamat wajib diisi',
                pattern: {
                  value: /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/,
                  message: 'Format koordinat tidak valid (contoh: -7.2575, 112.7521)'
                }
              })}
            />
            <LocationPicker
              value={formData.koordinat_alamat}
              onChange={(coordinates) => {
                form.setValue('koordinat_alamat', coordinates);
                updateFormField('koordinat_alamat', coordinates);
                form.trigger('koordinat_alamat'); 
              }}
              onAddressChange={(address) => {
                form.setValue('alamat_pemasangan', address);
                updateFormField('alamat_pemasangan', address);
                form.trigger('alamat_pemasangan');
              }}
              placeholder="Klik 'Pilih Lokasi' untuk memilih koordinat pada peta"
              error={form.formState.errors.koordinat_alamat?.message}
            />
          </div>

          {/* Upload Files */}
          <div className="grid md:grid-cols-2 md:gap-2 gap-5">
            {/* Foto Lokasi */}
            <div className="grid gap-2">
              <div className="flex gap-2">
                <Label htmlFor="foto_lokasi">
                  FOTO LOKASI INSTALASI
                  <span className="text-red-500">*</span>
                </Label>
                <Tooltip open={tooltipFotoLokasi} onOpenChange={setTooltipFotoLokasi}>
                  <TooltipTrigger asChild>
                    <Info 
                      className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                      onClick={() => setTooltipFotoLokasi(!tooltipFotoLokasi)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    Mohon difotokan Full Bangunannya
                  </TooltipContent>
                </Tooltip>
              </div>
              <input
                type="hidden"
                {...form.register('foto_lokasi', {
                  required: 'Foto lokasi wajib diisi'
                })}
              />
              <CustomFileInput
                id="foto_lokasi"
                value={formData.foto_lokasi}
                onChange={(file) => {
                  form.setValue('foto_lokasi', file);
                  updateFormField('foto_lokasi', file);
                }}
              />
              {form.formState.errors.foto_lokasi && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.foto_lokasi.message}
                </p>
              )}
            </div>

            {/* Bukti Usaha */}
            <div className="grid gap-2">
              <div className="flex gap-2">
                <Label htmlFor="bukti_usaha">
                  BUKTI USAHA
                  <span className="text-red-500">*</span>
                </Label>
                <Tooltip open={tooltipBuktiUsaha} onOpenChange={setTooltipBuktiUsaha}>
                  <TooltipTrigger asChild>
                    <Info 
                      className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                      onClick={() => setTooltipBuktiUsaha(!tooltipBuktiUsaha)}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-sm">
                    Foto lokasi usaha/kantor/sekolah yang terlihat nama,
                    plang, atau banner.
                  </TooltipContent>
                </Tooltip>
              </div>
              <input
                type="hidden"
                {...form.register('bukti_usaha', {
                  required: 'Bukti usaha wajib diisi'
                })}
              />
              <CustomFileInput
                id="bukti_usaha"
                value={formData.bukti_usaha}
                onChange={(file) => {
                  form.setValue('bukti_usaha', file);
                  updateFormField('bukti_usaha', file);
                }}
              />
              {form.formState.errors.bukti_usaha && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.bukti_usaha.message}
                </p>
              )}
            </div>
          </div>

          {/* Bukti NIB NPWP */}
          <div className="grid gap-2">
            <Label htmlFor="bukti_nib_npwp">
              BUKTI NIB DAN NPWP USAHA
              <span className="text-red-500">*</span>
            </Label>
            <input
              type="hidden"
              {...form.register('bukti_nib_npwp', {
                required: 'Bukti NIB dan NPWP wajib diisi'
              })}
            />
            <CustomFileInput
              id="bukti_nib_npwp"
              value={formData.bukti_nib_npwp}
              onChange={(file) => {
                form.setValue('bukti_nib_npwp', file);
                updateFormField('bukti_nib_npwp', file);
              }}
            />
            {form.formState.errors.bukti_nib_npwp && (
              <p className="text-sm text-red-500">
                {form.formState.errors.bukti_nib_npwp.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1InformasiUsaha;
