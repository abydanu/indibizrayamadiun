import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import CustomFileInput from '@/shared/components/custom/CustomFileInput';
import { SmartFormData } from '../../hooks/useSmartForm';

interface Step2DataPICProps {
  form: UseFormReturn<SmartFormData>;
  formData: SmartFormData;
  updateFormField: (field: keyof SmartFormData, value: any) => void;
}

const Step2DataPIC: React.FC<Step2DataPICProps> = ({
  form,
  formData,
  updateFormField,
}) => {
  return (
    <Card className="shadow-lg rounded-2xl border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Data PIC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Nama PIC */}
          <div className="grid gap-2">
            <Label htmlFor="nama_pic">
              NAMA PIC<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_pic"
              type="text"
              placeholder="Masukkan nama lengkap PIC"
              {...form.register('nama_pic', {
                required: 'Nama PIC wajib diisi',
                minLength: {
                  value: 3,
                  message: 'Minimal 3 karakter'
                }
              })}
            />
            {form.formState.errors.nama_pic && (
              <p className="text-sm text-red-500">
                {form.formState.errors.nama_pic.message}
              </p>
            )}
          </div>

          {/* TTL PIC */}
          <div className="grid gap-2">
            <Label htmlFor="ttl_pic">
              TEMPAT TANGGAL LAHIR PIC
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ttl_pic"
              type="text"
              placeholder="ex: Madiun, 19/12/1998"
              {...form.register('ttl_pic', {
                required: 'Tempat tanggal lahir wajib diisi',
                pattern: {
                  value: /^[A-Za-z\s]+,\s\d{1,2}\/\d{1,2}\/\d{4}$/,
                  message: 'Format: Tempat Lahir, DD/MM/YYYY'
                }
              })}
            />
            {form.formState.errors.ttl_pic && (
              <p className="text-sm text-red-500">
                {form.formState.errors.ttl_pic.message}
              </p>
            )}
          </div>

          {/* Nomor KTP dan Email */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="nomor_ktp">
                NOMOR KTP/NIK PIC<span className="text-red-500">*</span>
              </Label>
              <Input 
                id="nomor_ktp" 
                type="text" 
                placeholder="16 digit nomor KTP" 
                {...form.register('nomor_ktp', {
                  required: 'Nomor KTP wajib diisi',
                  minLength: {
                    value: 16,
                    message: 'Nomor KTP harus 16 digit'
                  },
                  maxLength: {
                    value: 16,
                    message: 'Nomor KTP harus 16 digit'
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: 'Hanya angka yang diperbolehkan'
                  }
                })}
              />
              {form.formState.errors.nomor_ktp && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.nomor_ktp.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">EMAIL</Label>
              <Input
                id="email"
                type="email"
                placeholder="ex: johndoe@example.com"
                {...form.register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid'
                  }
                })}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Files */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Foto KTP */}
            <div className="grid gap-2">
              <Label htmlFor="foto_ktp">
                FOTO KTP<span className="text-red-500">*</span>
              </Label>
              <input
                type="hidden"
                {...form.register('foto_ktp', {
                  required: 'Foto KTP wajib diisi'
                })}
              />
              <CustomFileInput 
                id="foto_ktp" 
                value={formData.foto_ktp}
                onChange={(file: File | null) => {
                  form.setValue("foto_ktp", file);
                  updateFormField('foto_ktp', file);
                }}
              />
              {form.formState.errors.foto_ktp && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.foto_ktp.message}
                </p>
              )}
            </div>

            {/* Foto KTP Selfie */}
            <div className="grid gap-2">
              <Label htmlFor="foto_ktp_selfie">
                SELFIE DENGAN KTP<span className="text-red-500">*</span>
              </Label>
              <input
                type="hidden"
                {...form.register('foto_ktp_selfie', {
                  required: 'Selfie dengan KTP wajib diisi'
                })}
              />
              <CustomFileInput 
                id="foto_ktp_selfie" 
                value={formData.foto_ktp_selfie}
                onChange={(file: File | null) => {
                  form.setValue("foto_ktp_selfie", file);
                  updateFormField('foto_ktp_selfie', file);
                }}
              />
              {form.formState.errors.foto_ktp_selfie && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.foto_ktp_selfie.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step2DataPIC;
