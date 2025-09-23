import { Header } from '@/features/smartsync-dashboard/components/header'
import { ThemeSwitch } from '@/shared/components/theme-switch'
import { PageBreadcrumb } from '@/shared/components/page-breadcrumb'
import { Button } from '@/shared/ui/button'
import { Plus } from 'lucide-react'

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
  addButtonText?: string
  onAddClick?: () => void
  children?: React.ReactNode
}

export function PageTitle({
  title,
  description,
  showAddButton = false,
  addButtonText = "Tambah",
  onAddClick,
  children
}: PageTitleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {showAddButton && onAddClick && (
        <Button onClick={onAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText}
        </Button>
      )}
      {children}
    </div>
  )
}
