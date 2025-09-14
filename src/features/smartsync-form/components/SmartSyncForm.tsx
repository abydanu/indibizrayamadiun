'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useState, useEffect } from 'react';
import {
  CheckIcon,
  ChevronsUpDownIcon,
  ArrowLeft,
  ArrowRight,
  Info,
  FileText,
  User,
  Package,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import { cn } from '@/lib/utils';
import paket_indibiz from '../services/PaketIndibiz';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import CustomFileInput from '@/shared/components/CustomFileInput';
import LocationPicker from '@/shared/components/LocationPicker';
import { useSmartForm, SmartFormData } from '../hooks/useSmartForm';
import { useSmartFormStore } from '../store/useSmartFormStore';

const SmartForm = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const form = useSmartForm();
  const { formData, currentStep, setFormData, updateFormField, setCurrentStep, nextStep: storeNextStep, prevStep: storePrevStep, resetForm } = useSmartFormStore();

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      form.reset(formData);
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name && type === 'change') {
        updateFormField(name as keyof SmartFormData, value[name as keyof SmartFormData]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormField]);

  const nextStep = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      const step1Fields = ['nama_usaha', 'datel_pemesanan', 'hp1', 'hp2', 'alamat_pemasangan', 'koordinat_alamat', 'foto_lokasi', 'bukti_usaha', 'bukti_nib_npwp'];
      isValid = await validateStepFields(step1Fields);
    } else if (currentStep === 2) {
      const step2Fields = ['nama_pic', 'ttl_pic', 'nomor_ktp', 'email', 'foto_ktp', 'foto_ktp_selfie'];
      isValid = await validateStepFields(step2Fields);
    } else if (currentStep === 3) {
      const step3Fields = ['paket_indibiz', 'nama_sales', 'kode_sales', 'agency', 'asal_datel'];
      isValid = await validateStepFields(step3Fields);
    }
    
    if (isValid && currentStep < 3) {
      storeNextStep();
    }
  };

  const prevStep = () => {
    storePrevStep();
  };

  const validateStepFields = async (fieldNames: string[]) => {
    let isValid = true;
    
    for (const fieldName of fieldNames) {
      await form.trigger(fieldName as keyof SmartFormData);
      const fieldError = form.formState.errors[fieldName as keyof SmartFormData];
      if (fieldError) {
        isValid = false;
      }
      
      
      const currentValue = form.getValues(fieldName as keyof SmartFormData);
      if (fieldName.includes('foto') || fieldName.includes('bukti')) {
        if (!currentValue) {
          form.setError(fieldName as keyof SmartFormData, {
            type: 'required',
            message: `${fieldName.replace('_', ' ')} wajib diisi`
          });
          isValid = false;
        }
      } else if (fieldName === 'datel_pemesanan' || fieldName === 'paket_indibiz' || fieldName === 'agency' || fieldName === 'asal_datel') {
        if (!currentValue || currentValue === '') {
          form.setError(fieldName as keyof SmartFormData, {
            type: 'required',
            message: `${fieldName.replace('_', ' ')} wajib diisi`
          });
          isValid = false;
        }
      }
    }
    
    return isValid;
  };


  const steps = [
    { number: 1, title: 'Informasi Usaha', icon: FileText },
    { number: 2, title: 'Data PIC', icon: User },
    { number: 3, title: 'Paket & Sales', icon: Package },
  ];

  const handleSubmit = async (data: any) => {
    try {
      console.log('=== FORM SUBMISSION STARTED ===');
      console.log('Form data received:', data);
      console.log('Store data:', formData);
      
      const isValid = await form.trigger();
      console.log('Form validation result:', isValid);
      
      if (!isValid) {
        console.log('Form validation failed - errors:', form.formState.errors);
        alert('Mohon lengkapi semua field yang wajib diisi');
        return;
      }
      
      const finalData = { ...formData, ...data };
      console.log('Final merged data for submission:', finalData);
      
      console.log('=== FORM SUBMITTED SUCCESSFULLY ===');
      alert('Form berhasil disubmit!');
      
      form.reset();
      resetForm();
      setValue('');
      
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===', error);
      alert('Gagal submit form. Silakan coba lagi.');
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8 md:mb-12">
        <div className="relative">
          {/* Background progress line */}
          <div className="absolute top-4 md:top-6 left-0 w-full h-0.5 bg-gray-300 rounded-full" />
          
          {/* Animated progress line */}
          <div
            className="absolute top-4 md:top-6 left-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000 ease-in-out rounded-full"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full" />
          </div>
          
          {/* Steps container */}
          <div className="relative flex justify-between px-1 md:px-0">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full border-2 transition-all duration-500 ease-in-out hover:scale-105',
                      isActive || isCompleted
                        ? 'border-red-600 bg-red-50 shadow-lg scale-110 ring-2 md:ring-4 ring-red-100'
                        : 'border-gray-300 bg-white hover:border-red-300'
                    )}
                  >
                    <IconComponent
                      className={cn(
                        'w-4 h-4 md:w-6 md:h-6 transition-all duration-500',
                        isActive || isCompleted
                          ? 'text-red-600'
                          : 'text-gray-400'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'mt-2 md:mt-3 text-[10px] md:text-sm font-medium transition-all duration-500 text-center leading-tight',
                      isActive || isCompleted
                        ? 'text-red-600 font-semibold'
                        : 'text-gray-500'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Step 1: Informasi Usaha */}
        {currentStep === 1 && (
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Informasi Usaha & Alamat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
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
                  <Select
                    value={form.watch('datel_pemesanan') || ''}
                    onValueChange={(val) => {
                      form.setValue('datel_pemesanan', val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="bojonegoro">BOJONEGORO</SelectItem>
                        <SelectItem value="ngawi">NGAWI</SelectItem>
                        <SelectItem value="madiun">MADIUN</SelectItem>
                        <SelectItem value="ponorogo">PONOROGO</SelectItem>
                        <SelectItem value="tuban">TUBAN</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.datel_pemesanan && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.datel_pemesanan.message}
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="hp1">
                      NO HP CP 1<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hp1"
                      type="number"
                      placeholder=""
                      {...form.register('hp1', {
                        required: 'No HP CP 1 wajib diisi',
                        minLength: {
                          value: 10,
                          message: 'Nomor HP terlalu pendek'
                        },
                        maxLength: {
                          value: 13,
                          message: 'Nomor HP terlalu panjang'
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
                      NO HP CP 2<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hp2"
                      type="number"
                      placeholder=""
                      {...form.register('hp2', {
                        minLength: {
                          value: 10,
                          message: 'Nomor HP terlalu pendek'
                        },
                        maxLength: {
                          value: 13,
                          message: 'Nomor HP terlalu panjang'
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
                <div className="grid gap-2">
                  <Label htmlFor="alamat_pemasangan">
                    ALAMAT PEMASANGAN<span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="alamat_pemasangan"
                    placeholder=""
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
                    placeholder="Klik 'Pilih Lokasi' untuk memilih koordinat pada peta"
                    error={form.formState.errors.koordinat_alamat?.message}
                  />
                </div>
                <div className="grid md:grid-cols-2 md:gap-2 gap-5">
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <Label htmlFor="foto_lokasi">
                        FOTO LOKASI INSTALASI
                        <span className="text-red-500">*</span>
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-500" />
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
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <Label htmlFor="bukti_usaha">
                        BUKTI USAHA
                        <span className="text-red-500">*</span>
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-500" />
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
        )}

        {/* Step 2: Data Personal */}
        {currentStep === 2 && (
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Data PIC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="nama_pic">
                    NAMA PIC<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nama_pic"
                    type="text"
                    placeholder=""
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
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="nomor_ktp">
                      NOMOR KTP/NIK PIC<span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="nomor_ktp" 
                      type="text" 
                      placeholder="" 
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
                          message: 'email tidak valid'
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
                <div className="grid md:grid-cols-2 gap-5">
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
                      onChange={(file) => {
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
                      onChange={(file) => {
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
        )}

        {/* Step 3: Paket & Sales */}
        {currentStep === 3 && (
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                Paket & Informasi Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="paket_indibiz">
                    PAKET INDIBIZ<span className="text-red-500">*</span>
                  </Label>
                  <input
                    type="hidden"
                    {...form.register('paket_indibiz', {
                      required: 'Paket Indibiz wajib diisi'
                    })}
                  />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-transparent"
                      >
                        {value
                          ? (
                              paket_indibiz.find(
                                (paket) => paket.name === value
                              )?.name || ''
                            ).substring(0, 45) + '...'
                          : 'Pilih Paket'}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="md:w-full w-[350px] p-0">
                      <Command className="shadow-lg">
                        <CommandInput placeholder="Cari" />
                        <CommandList>
                          <CommandEmpty>Paket tidak di temukan.</CommandEmpty>
                          <CommandGroup>
                            {paket_indibiz.map((paket) => (
                              <CommandItem
                                key={paket.name}
                                value={paket.name}
                                onSelect={(currentValue) => {
                                  const newValue = currentValue === value ? '' : currentValue;
                                  setValue(newValue);
                                  form.setValue('paket_indibiz', newValue);
                                  setOpen(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    value === paket.name
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {paket.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.paket_indibiz && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.paket_indibiz.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nama_sales">
                    NAMA SALES (WAJIB NAMA LENGKAP)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="nama_sales" 
                    type="text" 
                    placeholder="" 
                    {...form.register('nama_sales', {
                      required: 'Nama sales wajib diisi',
                      minLength: {
                        value: 3,
                        message: 'Minimal 3 karakter'
                      }
                    })} 
                  />
                  {form.formState.errors.nama_sales && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.nama_sales.message}
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="kode_sales">
                      KODE SALES AGENT<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="kode_sales"
                      type="text"
                      placeholder="ex:  M5010000"
                      {...form.register('kode_sales', {
                        required: 'Kode sales wajib diisi',
                        pattern: {
                          value: /^[A-Z]\d{7}$/,
                          message: 'Format: M1234567'
                        }
                      })}
                    />
                    {form.formState.errors.kode_sales && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.kode_sales.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="agency">
                      AGENCY SALES<span className="text-red-500">*</span>
                    </Label>
                    <input
                      type="hidden"
                      {...form.register('agency', {
                        required: 'Agency sales wajib diisi'
                      })}
                    />
                    <Select
                      value={form.watch('agency') || ''}
                      onValueChange={(val) => {
                        form.setValue('agency', val);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="mca">MCA</SelectItem>
                          <SelectItem value="kopeg_ngawi">
                            KOPEG NGAWI
                          </SelectItem>
                          <SelectItem value="mat">MAT</SelectItem>
                          <SelectItem value="gad">GAD</SelectItem>
                          <SelectItem value="hero">HERO</SelectItem>
                          <SelectItem value="am">AM</SelectItem>
                          <SelectItem value="ar">AR</SelectItem>
                          <SelectItem value="non">NON AGENCY</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.agency && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.agency.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="asal_datel_sales">
                    ASAL DATEL SALES<span className="text-red-500">*</span>
                  </Label>
                  <input
                    type="hidden"
                    {...form.register('asal_datel', {
                      required: 'Asal datel sales wajib diisi'
                    })}
                  />
                  <Select
                    value={form.watch('asal_datel') || ''}
                    onValueChange={(val) => {
                      form.setValue('asal_datel', val);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="bojonegoro">BOJONEGORO</SelectItem>
                        <SelectItem value="ngawi">NGAWI</SelectItem>
                        <SelectItem value="madiun">MADIUN</SelectItem>
                        <SelectItem value="ponorogo">PONOROGO</SelectItem>
                        <SelectItem value="tuban">TUBAN</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.asal_datel && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.asal_datel.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" onClick={() => form.handleSubmit(handleSubmit)()}>Kirim</Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SmartForm;
