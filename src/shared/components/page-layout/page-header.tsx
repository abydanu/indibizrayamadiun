import { Header } from '@/features/indibizrayamadiun-dashboard/components/header'
import { ThemeSwitch } from '@/shared/components/theme-switch'
import { PageBreadcrumb } from '@/shared/components/page-breadcrumb'
import { Button } from '@/shared/ui/button'
import { Import, Plus } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  showAddButton?: boolean
  addButtonText?: string
  onAddClick?: () => void
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  showAddButton = false,
  addButtonText = "Tambah",
  onAddClick,
  children
}: PageHeaderProps) {
  return (
    <Header fixed>
      <div className="flex items-center justify-between w-full">
        <PageBreadcrumb />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </div>
    </Header>
  )
}

interface PageTitleProps {
  title: string
  description?: string
  showAddButton?: boolean
  showImportButton?: boolean
  importButtonText?: string
  addButtonText?: string
  onImportClick?: () => void
  onAddClick?: () => void
  children?: React.ReactNode
}

export function PageTitle({
  title,
  description,
  showAddButton = false,
  showImportButton = false,
  importButtonText = "Import Data",
  addButtonText = "Tambah",
  onImportClick,
  onAddClick,
  children
}: PageTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Title + Description */}
      <div className="space-y-0.5">
        <h1 className="text-xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="md:text-base text-[13px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-row gap-2 self-end">
        {showAddButton && onAddClick && (
          <Button
            onClick={onAddClick}
            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm w-auto"
          >
            <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {addButtonText}
          </Button>
        )}
        {showImportButton && onImportClick && (
          <Button
            onClick={onImportClick}
            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm w-auto"
          >
            <Import className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {importButtonText}
          </Button>
        )}
      </div>

      {children}
    </div>
  )
}
