import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog"

interface ActionDropdownProps {
  onEdit: () => void
  onDelete: () => void
  itemName: string
  isSubmitting?: boolean
  editLabel?: string
  deleteLabel?: string
  deleteTitle?: string
  deleteDescription?: string
}

export function ActionDropdown({
  onEdit,
  onDelete,
  itemName,
  isSubmitting = false,
  editLabel = "Edit",
  deleteLabel = "Hapus Data",
  deleteTitle = "Apakah Anda Yakin?",
  deleteDescription = "Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data secara permanen."
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          {editLabel}
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteLabel}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteDescription} <span className='font-bold'>"{itemName}"</span> secara permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menghapus...' : 'Hapus'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
