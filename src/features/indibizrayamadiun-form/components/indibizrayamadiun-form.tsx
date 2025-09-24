'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSmartForm, SmartFormData } from '../hooks/use-smart-form';
import { useSmartFormStore } from '../store/use-smart-form-store';
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import type { Datel } from '@/features/indibizrayamadiun-dashboard/types/sales';
import type { Paket } from '@/features/indibizrayamadiun-dashboard/types/paket';
import type { Sales } from '@/features/indibizrayamadiun-dashboard/types/sales';
import FormStepper from './steps/form-stepper';
import FormNavigation from './steps/form-navigation';
import Step1InformasiUsaha from './steps/step-1';
import Step2DataPIC from './steps/step-2';
import Step3PaketSales from './steps/step-3';

const SmartForm = () => {
  const [tooltipFotoLokasi, setTooltipFotoLokasi] = useState(true);
  const [tooltipBuktiUsaha, setTooltipBuktiUsaha] = useState(true);
  const [datels, setDatels] = useState<Datel[]>([]);
  const [pakets, setPakets] = useState<Paket[]>([]);
  const [sales, setSales] = useState<Sales[]>([]);
  const [loadingDatels, setLoadingDatels] = useState(false);
  const [loadingPakets, setLoadingPakets] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [salesOpen, setSalesOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState('');
  const [hasKodeSales, setHasKodeSales] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useSmartForm();
  const skipFilesGlobal = process.env.NEXT_PUBLIC_SKIP_FILES === 'fasle';
  const {
    formData,
    currentStep,
    setFormData,
    updateFormField,
    setCurrentStep,
    nextStep: storeNextStep,
    prevStep: storePrevStep,
    resetForm,
  } = useSmartFormStore();

  const fetchDatels = useCallback(async () => {
    setLoadingDatels(true);
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/datel/list`
      );
      const datelData = (res.data as any).data || [];

      setDatels(datelData);
    } catch (error) {
      console.error('Error fetching datels:', error);
      toast.error('Gagal memuat data datel');
    } finally {
      setLoadingDatels(false);
    }
  }, []);

  const fetchPakets = useCallback(async () => {
    setLoadingPakets(true);
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/paket?limit=1000`
      );

      const paketData = (res.data as any).result?.data || [];

      setPakets(paketData || []);
    } catch (error) {
      console.error('Error fetching pakets:', error);
      toast.error('Gagal memuat data paket');
    } finally {
      setLoadingPakets(false);
    }
  }, []);

  const fetchSales = useCallback(async () => {
    setLoadingSales(true);
    try {
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sales?limit=1000` 
      );
      const salesData = (res.data as any).result?.data || [];
      const activeSales = salesData.filter((sales: any) => sales.status === 'ACTIVE');
      setSales(activeSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Gagal memuat data sales');
    } finally {
      setLoadingSales(false);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      form.reset({
        ...form.getValues(),
        ...(formData as Partial<SmartFormData>),
      });
    }
  }, []);

  useEffect(() => {
    fetchDatels();
    fetchPakets();
    fetchSales();
  }, [fetchDatels, fetchPakets, fetchSales]);

  useEffect(() => {
    const subscription = form.watch((value: any, { name, type }) => {
      if (name && type === 'change') {
        updateFormField(
          name as keyof SmartFormData,
          value[name as keyof SmartFormData]
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormField]);

  const handleSalesSelection = (salesId: string) => {
    const selectedSalesData = sales.find((s) => s.id === salesId);
    if (selectedSalesData) {
      form.setValue('nama_sales', selectedSalesData.nama);
      form.setValue('kode_sales', selectedSalesData.kode_sales || '');
      form.setValue('agency', selectedSalesData.agency?.nama || '');
      form.setValue('asal_datel', selectedSalesData.datel?.nama || '');

      updateFormField('nama_sales', selectedSalesData.nama);
      updateFormField('kode_sales', selectedSalesData.kode_sales || '');
      updateFormField('agency', selectedSalesData.agency?.nama || '');
      updateFormField('asal_datel', selectedSalesData.datel?.nama || '');

      setSelectedSales(selectedSalesData.nama);
      const hasCode = !!(
        selectedSalesData.kode_sales &&
        selectedSalesData.kode_sales.trim() !== ''
      );
      setHasKodeSales(hasCode);
    }
  };

  const nextStep = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    let isValid = false;

    if (currentStep === 1) {
      const step1Fields = [
        'nama_usaha',
        'datel_pemesanan',
        'hp1',
        'hp2',
        'alamat_pemasangan',
        'koordinat_alamat',
        ...(skipFilesGlobal
          ? []
          : ['foto_lokasi', 'bukti_usaha', 'bukti_nib_npwp']),
      ];
      isValid = await validateStepFields(step1Fields);
    } else if (currentStep === 2) {
      const step2Fields = [
        'nama_pic',
        'ttl_pic',
        'nomor_ktp',
        'email',
        ...(skipFilesGlobal ? [] : ['foto_ktp', 'foto_ktp_selfie']),
      ];
      isValid = await validateStepFields(step2Fields);
    } else if (currentStep === 3) {
      const step3Fields = [
        'paket_indibiz',
        'nama_sales',
        'kode_sales',
        'agency',
        'asal_datel',
      ];
      isValid = await validateStepFields(step3Fields);
    }

    if (isValid && currentStep < 3) {
      storeNextStep();
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    storePrevStep();
  };

  const validateStepFields = async (fieldNames: string[]) => {
    const valid = await form.trigger(fieldNames as any);
    return valid;
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const finalData = { ...formData, ...data };
      const skipFiles = process.env.NEXT_PUBLIC_SKIP_FILES === 'false';

      const selectedSalesData = sales.find((s) => s.nama === selectedSales);
      if (!selectedSalesData) {
        toast.error('Sales yang dipilih tidak valid');
        return;
      }

      const submitData: any = {
        nama: finalData.nama_usaha,
        datel_id: finalData.datel_pemesanan,
        paket_id: finalData.paket_indibiz,
        sales_id: selectedSalesData.id,
        no_hp_1: finalData.hp1,
        no_hp_2: finalData.hp2 || '',
        kordinat: finalData.koordinat_alamat || '',
        alamat: finalData.alamat_pemasangan,
        nama_pic: finalData.nama_pic,
        ttl_pic: finalData.ttl_pic,
        no_ktp: finalData.nomor_ktp,
        email: finalData.email || '',
        foto_ktp: finalData.foto_ktp || null,
        foto_selfie: finalData.foto_ktp_selfie || null,
        bukti_usaha: finalData.bukti_usaha || null,
        bukti_niwp: finalData.bukti_nib_npwp || null,
      };

      // const compressImageFile = async (
      //   file: File,
      //   maxWidth = 1280,
      //   maxHeight = 1280,
      //   quality = 0.8
      // ): Promise<File> => {
      //   if (!file.type.startsWith('image/')) return file;
      //   const originalMime = file.type === 'image/png' || file.type === 'image/jpeg' ? file.type : 'image/jpeg';

      //   const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      //     const image = new Image();
      //     const url = URL.createObjectURL(file);
      //     image.onload = () => resolve(image);
      //     image.onerror = reject;
      //     image.src = url;
      //   }).catch(() => null as unknown as HTMLImageElement);
      //   if (!img) return file;

      //   const { width, height } = img;
      //   const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      //   if (ratio >= 1) return file;

      //   const targetWidth = Math.round(width * ratio);
      //   const targetHeight = Math.round(height * ratio);
      //   const canvas = document.createElement('canvas');
      //   canvas.width = targetWidth;
      //   canvas.height = targetHeight;
      //   const ctx = canvas.getContext('2d');
      //   if (!ctx) return file;
      //   ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      //   const blob: Blob | null = await new Promise((resolve) =>
      //     canvas.toBlob(
      //       b => resolve(b),
      //       originalMime,
      //       originalMime === 'image/jpeg' ? quality : undefined
      //     )
      //   );
      //   if (!blob) return file;
      //   return new File([blob], file.name, { type: originalMime });
      // };

      const fileKeys = ['foto_ktp', 'foto_selfie', 'bukti_usaha', 'bukti_niwp'];
      if (skipFiles) {
        for (const key of fileKeys) {
          if (key in submitData) delete submitData[key];
        }
      } else {
      }

      const apiFormData = new FormData();

      Object.keys(submitData).forEach((key) => {
        const value = submitData[key];

        if (value instanceof File) {
          apiFormData.append(key, value);
        } else if (value !== null && value !== undefined && value !== '') {
          apiFormData.append(key, String(value));
        }
      });

      const res = await api.post(
        `${process.env.NEXT_PUBLIC_API_URL}/registrasi_indibiz`,
        apiFormData,
        { timeout: 120000 }
      );

      if (res.ok) {
        toast.success('Data Berhasil Di Kirim!');

        form.reset();
        resetForm();
        setSelectedSales('');
        setHasKodeSales(false);
      } else {
        throw new Error((res.data as any)?.message || 'Failed to submit form');
      }
    } catch (error: any) {
      console.error('=== FORM SUBMISSION ERROR ===', error);

      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);

        const serverMessage =
          error.response.data?.message || error.response.data?.error;
        if (serverMessage) {
          toast.error(`Server Error: ${serverMessage}`);
        } else {
          toast.error(
            `HTTP ${error.response.status}: ${error.response.statusText}`
          );
        }
      } else {
        const errorMessage =
          error.message || 'Gagal submit registrasi. Silakan coba lagi.';
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const mergedFormData: SmartFormData = {
    ...form.getValues(),
    ...(formData as Partial<SmartFormData>),
  } as SmartFormData;

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6">
      <FormStepper currentStep={currentStep} />

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {currentStep === 1 && (
          <Step1InformasiUsaha
            form={form}
            formData={mergedFormData}
            updateFormField={updateFormField}
            datels={datels}
            loadingDatels={loadingDatels}
            tooltipFotoLokasi={tooltipFotoLokasi}
            setTooltipFotoLokasi={setTooltipFotoLokasi}
            tooltipBuktiUsaha={tooltipBuktiUsaha}
            setTooltipBuktiUsaha={setTooltipBuktiUsaha}
          />
        )}

        {currentStep === 2 && (
          <Step2DataPIC
            form={form}
            formData={mergedFormData}
            updateFormField={updateFormField}
          />
        )}

        {currentStep === 3 && (
          <Step3PaketSales
            form={form}
            formData={mergedFormData}
            updateFormField={updateFormField}
            pakets={pakets}
            sales={sales}
            loadingPakets={loadingPakets}
            loadingSales={loadingSales}
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            salesOpen={salesOpen}
            setSalesOpen={setSalesOpen}
            selectedSales={selectedSales}
            hasKodeSales={hasKodeSales}
            handleSalesSelection={handleSalesSelection}
          />
        )}

        <FormNavigation
          currentStep={currentStep}
          totalSteps={3}
          isSubmitting={isSubmitting}
          onPrevStep={prevStep}
          onNextStep={nextStep}
        />
      </form>
    </div>
  );
};

export default SmartForm;
