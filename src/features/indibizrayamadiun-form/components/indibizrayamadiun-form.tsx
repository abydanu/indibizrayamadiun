'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSmartForm, SmartFormData } from '../hooks/use-smart-form';
import { useSmartFormStore } from '../store/use-smart-form-store';
import { toast } from 'sonner';
import api from '@/lib/api/useFetch';
import type { Paket } from '@/features/indibizrayamadiun-dashboard/types/paket';
import type { Sales } from '@/features/indibizrayamadiun-dashboard/types/sales';
import FormStepper from './steps/form-stepper';
import FormNavigation from './steps/form-navigation';
import Step1InformasiUsaha from './steps/step-1';
import Step2DataPIC from './steps/step-2';
import Step3PaketSales from './steps/step-3';
import { Datel } from '@/features/indibizrayamadiun-dashboard/types/datel';

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
        `${process.env.NEXT_PUBLIC_API_URL}/wilayah/list`
      );
      const data = (res.data as any).data || [];
      console.log(data);
      setDatels(data);
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
        `${process.env.NEXT_PUBLIC_API_URL}/paket/list`
      );
      const list = (res.data as any).data || [];
      const mapped = list.map((p: any) => ({
        id: p.id,
        nama: p.nama,
        bandwith: p.bandwith,
        final_price: p.final_price,
        applied_promos: Array.isArray(p.paket_promos)
          ? p.paket_promos.map((pp: any) => ({ nama: pp?.promo?.nama }))
          : [],
      }));
      setPakets(mapped || []);
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
        `${process.env.NEXT_PUBLIC_API_URL}/sales/list`
      );
      const salesData = (res.data as any).data || [];
      setSales(salesData);
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
      form.setValue('asal_datel', selectedSalesData.wilayah?.nama || '');

      updateFormField('nama_sales', selectedSalesData.nama);
      updateFormField('kode_sales', selectedSalesData.kode_sales || '');
      updateFormField('agency', selectedSalesData.agency?.nama || '');
      updateFormField('asal_datel', selectedSalesData.wilayah?.nama || '');

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
        'foto_lokasi',
        'bukti_usaha',
        'foto_lokasi',
        'bukti_nib_npwp',
      ];
      isValid = await validateStepFields(step1Fields);
    } else if (currentStep === 2) {
      const step2Fields = [
        'nama_pic',
        'ttl_pic',
        'nomor_ktp',
        'email',
        'foto_ktp',
        'foto_ktp_selfie'
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
        no_hp_2: finalData.hp2 || '-',
        kordinat: finalData.koordinat_alamat || '-',
        alamat: finalData.alamat_pemasangan,
        nama_pic: finalData.nama_pic,
        ttl_pic: finalData.ttl_pic,
        no_ktp: finalData.nomor_ktp,
        email: finalData.email || '',
        foto_ktp: finalData.foto_ktp || null,
        foto_selfie: finalData.foto_ktp_selfie || null,
        foto_lokasi: finalData.foto_lokasi || null,
        bukti_usaha: finalData.bukti_usaha || null,
        bukti_niwp: finalData.bukti_nib_npwp || null,
      };

      const apiFormData = new FormData();

      const fileKeys = new Set([
        'foto_ktp',
        'foto_selfie',
        'foto_lokasi',
        'bukti_usaha',
        'bukti_niwp',
      ]);

      Object.keys(submitData).forEach((key) => {
        const value = submitData[key];

        if (value instanceof File) {
          apiFormData.append(key, value);
          return;
        }

        if (value !== null && value !== undefined && String(value) !== '') {
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
    <div className="container max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
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
