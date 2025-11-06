import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/ui/command';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartFormData } from '../../hooks/use-smart-form';
import type { Sales } from '@/features/indibizrayamadiun-dashboard/types/sales';
import { Skeleton } from '@/shared/ui/skeleton';

interface Step3PaketSalesProps {
  form: UseFormReturn<SmartFormData>;
  formData: SmartFormData;
  updateFormField: (field: keyof SmartFormData, value: any) => void;
  pakets: any[];
  sales: Sales[];
  loadingPakets: boolean;
  loadingSales: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  salesOpen: boolean;
  setSalesOpen: (value: boolean) => void;
  selectedSales: string;
  hasKodeSales: boolean;
  handleSalesSelection: (salesId: string) => void;
}

const Step3PaketSales: React.FC<Step3PaketSalesProps> = ({
  form,
  formData,
  updateFormField,
  pakets,
  sales,
  loadingPakets,
  loadingSales,
  open,
  setOpen,
  value,
  setValue,
  salesOpen,
  setSalesOpen,
  selectedSales,
  hasKodeSales,
  handleSalesSelection,
}) => {
  const selectedPaket = pakets.find(paket => paket.id === value);

  const getPaketLabel = (paket: any) => paket?.label_option || 'Paket';

  return (
    <Card className="shadow-lg rounded-2xl border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
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
            
            {loadingPakets ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                  >
                    {value && selectedPaket
                      ? getPaketLabel(selectedPaket)
                      : 'Pilih Paket'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="md:w-full w-[350px] p-0">
                  <Command className="shadow-lg">
                    <CommandInput placeholder="Cari paket..." />
                    <CommandList>
                      <CommandEmpty>Paket tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {pakets.map((paket) => (
                          <CommandItem
                            key={paket.id}
                            value={paket.id}
                            onSelect={(currentValue: string) => {
                              const newValue = currentValue === value ? '' : currentValue;
                              setValue(newValue);
                              form.setValue('paket_indibiz', newValue);
                              updateFormField('paket_indibiz', newValue);
                              setOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                value === paket.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {getPaketLabel(paket)}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            
            {form.formState.errors.paket_indibiz && (
              <p className="text-sm text-red-500">
                {form.formState.errors.paket_indibiz.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nama_sales">
              NAMA SALES
              <span className="text-red-500">*</span>
            </Label>
            <input
              type="hidden"
              {...form.register('nama_sales', {
                required: 'Nama sales wajib diisi'
              })}
            />
            
            {loadingSales ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Popover open={salesOpen} onOpenChange={setSalesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={salesOpen}
                    className="w-full justify-between bg-transparent"
                  >
                    {selectedSales || 'Pilih Sales'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="md:w-full w-[350px] p-0">
                  <Command className="shadow-lg">
                    <CommandInput placeholder="Cari nama sales..." />
                    <CommandList>
                      <CommandEmpty>Sales tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {sales.map((salesItem) => (
                          <CommandItem
                            key={salesItem.id}
                            value={salesItem.id}
                            onSelect={(currentValue: string) => {
                              handleSalesSelection(currentValue);
                              setSalesOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedSales === salesItem.nama
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{salesItem.nama}</span>
                              <span className="text-sm text-muted-foreground">
                                {salesItem.kode_sales || 'Tidak ada kode'} - {salesItem.agency?.nama || 'No Agency'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {salesItem.wilayah?.nama || '-'} - {salesItem.sto?.abbreviation || '-'}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            
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
                placeholder={hasKodeSales ? "Akan terisi otomatis" : "Masukkan kode sales"}
                readOnly={hasKodeSales}
                className={hasKodeSales ? "bg-gray-50 dark:bg-gray-800" : ""}
                {...form.register('kode_sales', {
                  required: 'Kode sales wajib diisi'
                })}
                onChange={(e) => {
                  if (!hasKodeSales) {
                    form.setValue('kode_sales', e.target.value);
                    updateFormField('kode_sales', e.target.value);
                  }
                }}
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
              <Input
                id="agency"
                type="text"
                placeholder="Akan terisi otomatis"
                readOnly
                className="bg-gray-50 dark:bg-gray-800"
                {...form.register('agency')}
              />
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
            <Input
              id="asal_datel"
              type="text"
              placeholder="Akan terisi otomatis"
              readOnly
              className="bg-gray-50 dark:bg-gray-800"
              {...form.register('asal_datel')}
            />
            {form.formState.errors.asal_datel && (
              <p className="text-sm text-red-500">
                {form.formState.errors.asal_datel.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3PaketSales;
