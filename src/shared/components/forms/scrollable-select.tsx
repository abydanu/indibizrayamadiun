"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"

export interface ScrollableSelectOption {
  value: any
  label: any
}

interface ScrollableSelectProps {
  options: ScrollableSelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
}

export function ScrollableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className,
  disabled = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
}: ScrollableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedOption = options.find((option) => option.value === value)

  // Filter options based on search value for better performance
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

  // Reset search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("")
    }
  }, [open])

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedOption ? (
              <span className="truncate">{selectedOption.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder={searchPlaceholder} 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-80 overflow-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value === value ? "" : option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
