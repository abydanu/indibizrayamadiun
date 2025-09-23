# Komponen Reusable SmartSync

Dokumentasi ini menjelaskan komponen-komponen reusable yang telah dibuat untuk mengurangi duplikasi kode dan mempermudah maintenance.

## 📁 Struktur Folder

```
src/shared/components/
├── data-table/
│   ├── data-table.tsx          # Komponen tabel dengan pagination dan search
│   ├── table-skeleton.tsx      # Loading skeleton untuk tabel
│   ├── action-dropdown.tsx     # Dropdown menu untuk actions (edit/delete)
│   └── index.ts               # Export file
├── forms/
│   ├── form-dialog.tsx        # Dialog form yang fleksibel
│   └── index.ts              # Export file
├── page-layout/
│   ├── page-header.tsx       # Header halaman dengan breadcrumb
│   └── index.ts             # Export file
└── README.md                # Dokumentasi ini
```

## 🧩 Komponen yang Tersedia

### 1. DataTable

Komponen tabel yang lengkap dengan fitur:
- ✅ Pagination
- ✅ Search/Filter
- ✅ Sorting
- ✅ Loading state
- ✅ Empty state
- ✅ Responsive
- ✅ Customizable page size

**Penggunaan:**
```tsx
import { DataTable, TableSkeleton } from '@/shared/components/data-table'

const skeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  // ... kolom lainnya
]

<DataTable
  columns={columns}
  data={data}
  loading={loading}
  searchKey="nama"
  searchPlaceholder="Cari data..."
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  emptyMessage="Tidak ada data."
  loadingComponent={<TableSkeleton columns={skeletonColumns} />}
/>
```

### 2. TableSkeleton

Komponen loading skeleton yang dapat dikustomisasi untuk berbagai struktur tabel.

**Penggunaan:**
```tsx
import { TableSkeleton } from '@/shared/components/data-table'

const columns = [
  { width: 'w-4', height: 'h-4' }, // checkbox
  { width: 'w-[150px]', height: 'h-4' }, // text
  { width: 'w-[120px]', height: 'h-6', rounded: true }, // badge
  { width: 'w-8', height: 'h-8' }, // action button
]

<TableSkeleton rows={5} columns={columns} />
```

### 3. ActionDropdown

Dropdown menu standar untuk actions edit dan delete dengan konfirmasi.

**Penggunaan:**
```tsx
import { ActionDropdown } from '@/shared/components/data-table'

<ActionDropdown
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item.id)}
  itemName={item.nama}
  isSubmitting={isSubmitting}
  editLabel="Edit"
  deleteLabel="Hapus Data"
/>
```

### 4. FormDialog

Dialog form yang fleksibel untuk berbagai jenis input.

**Penggunaan:**
```tsx
import { FormDialog, FormField } from '@/shared/components/forms'

const formFields: FormField[] = [
  {
    id: 'nama',
    label: 'Nama',
    type: 'text',
    value: data.nama,
    onChange: (value) => setData(prev => ({ ...prev, nama: value })),
    required: true
  },
  {
    id: 'jenis',
    label: 'Jenis',
    type: 'select',
    value: data.jenis,
    onChange: (value) => setData(prev => ({ ...prev, jenis: value })),
    options: [
      { value: 'A', label: 'Tipe A' },
      { value: 'B', label: 'Tipe B' }
    ]
  }
]

<FormDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Tambah Data"
  description="Isi form berikut untuk menambah data baru"
  fields={formFields}
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
/>
```

### 5. PageHeader & PageTitle

Komponen header halaman yang konsisten.

**Penggunaan:**
```tsx
import { PageHeader, PageTitle } from '@/shared/components/page-layout'

<PageHeader />
<Main>
  <PageTitle
    title="Kelola Data"
    description="Kelola data aplikasi"
    showAddButton
    addButtonText="Tambah Data"
    onAddClick={() => setIsAddDialogOpen(true)}
  />
</Main>
```

## 🎯 Keuntungan Menggunakan Komponen Reusable

### ✅ Sebelum Refactor:
- File paket: **989 baris**
- File promo: **979 baris**
- File datel: **853 baris**
- **Total: ~2800+ baris**

### ✅ Setelah Refactor:
- File paket: **~400 baris** (-60%)
- Komponen reusable: **~300 baris**
- **Penghematan: ~2100 baris kode**

### 📈 Manfaat:
1. **Konsistensi UI** - Semua halaman menggunakan komponen yang sama
2. **Mudah Maintenance** - Update satu komponen, semua halaman terupdate
3. **Kode Lebih Bersih** - Fokus pada logika bisnis, bukan UI boilerplate
4. **Reusability** - Komponen bisa digunakan di halaman lain
5. **Type Safety** - Full TypeScript support
6. **Performance** - Optimized dengan React.memo dan useMemo

## 🚀 Cara Migrasi File Existing

1. **Import komponen reusable:**
```tsx
import { DataTable, TableSkeleton, ActionDropdown } from '@/shared/components/data-table'
import { FormDialog, FormField } from '@/shared/components/forms'
import { PageHeader, PageTitle } from '@/shared/components/page-layout'
```

2. **Ganti TableSkeleton lama:**
```tsx
// Sebelum
const TableSkeleton = () => (
  // 40+ baris kode skeleton
)

// Sesudah
const skeletonColumns = [
  { width: 'w-4', height: 'h-4' },
  { width: 'w-[150px]', height: 'h-4' },
  // ...
]
```

3. **Ganti struktur tabel:**
```tsx
// Sebelum: 100+ baris kode tabel dengan pagination

// Sesudah:
<DataTable
  columns={columns}
  data={data}
  loading={loading}
  loadingComponent={<TableSkeleton columns={skeletonColumns} />}
/>
```

4. **Ganti action dropdown:**
```tsx
// Sebelum: 50+ baris dropdown dengan alert dialog

// Sesudah:
<ActionDropdown
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item.id)}
  itemName={item.nama}
/>
```

5. **Ganti form dialog:**
```tsx
// Sebelum: 200+ baris dialog dengan form fields

// Sesudah:
<FormDialog
  fields={formFields}
  onSubmit={handleSubmit}
  // ...props lainnya
/>
```

## 💡 Tips Penggunaan

1. **Skeleton Configuration**: Sesuaikan `skeletonColumns` dengan struktur tabel Anda
2. **Form Fields**: Gunakan tipe field yang sesuai (`text`, `number`, `select`, `checkbox`, `custom`)
3. **Custom Components**: Untuk field yang kompleks, gunakan `type: 'custom'` dengan `customComponent`
4. **Type Safety**: Selalu definisikan tipe data yang benar untuk props
5. **Performance**: Gunakan `React.useMemo` untuk columns dan form fields yang tidak berubah

## 🔄 Roadmap

- [ ] Tambah komponen `FilterDropdown` untuk filter advanced
- [ ] Tambah komponen `BulkActions` untuk operasi bulk
- [ ] Tambah komponen `ExportButton` untuk export data
- [ ] Tambah komponen `ImportDialog` untuk import data
- [ ] Tambah unit tests untuk semua komponen
