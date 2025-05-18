// src/components/ui/select.tsx
"use client";

import { Fragment, forwardRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    { options, value, onChange, placeholder = "Select an option", error, disabled, className },
    ref
  ) => {
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className="relative" ref={ref}>
        <Listbox value={value} onChange={onChange} disabled={disabled}>
          <Listbox.Button
            className={cn(
              "relative w-full cursor-default rounded-md border border-input bg-background py-2 pl-3 pr-10 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error focus:ring-error",
              className
            )}
          >
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-10 pr-4",
                      active ? "bg-primary/10 text-foreground" : "text-foreground"
                    )
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={cn(
                          "block truncate",
                          selected ? "font-medium" : "font-normal"
                        )}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>

        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
