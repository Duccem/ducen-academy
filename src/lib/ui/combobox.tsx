"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/lib/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/lib/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/ui/popover"
import { cn } from "@/lib/utils/utils"

export interface ComboBoxProps {
  options: { label: string; value: string }[],
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}
export const Combobox = React.forwardRef<any, ComboBoxProps>(
  ({ options, placeholder = 'Select item', value, onChange, ...props}, ref) => {
    const [open, setOpen] = React.useState(false)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? options.find((element) => element.value === value)?.label
              : placeholder }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((element) => (
                <CommandItem
                  key={element.value}
                  value={element.value}
                  onSelect={() => {
                    onChange(element.value === value ? "" : element.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === element.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {element.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
Combobox.displayName = "Combobox";
