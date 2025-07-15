"use client";

import { ChevronDown, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Portal } from "./portal";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface CustomMultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  maxDisplay?: number;
}

export function CustomMultiSelect({ 
  options, 
  value, 
  onValueChange, 
  placeholder = "옵션 선택...",
  className,
  maxDisplay = 3
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onValueChange(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(value.filter(v => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange([]);
  };

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  const renderTriggerContent = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (selectedOptions.length <= maxDisplay) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 rounded-sm bg-secondary px-2 py-1 text-xs font-medium"
            >
              {option.label}
              <button
                onClick={(e) => handleRemove(option.value, e)}
                className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {selectedOptions.slice(0, maxDisplay).map(opt => opt.label).join(", ")}
        </span>
        <span className="rounded-sm bg-secondary px-2 py-1 text-xs font-medium">
          +{selectedOptions.length - maxDisplay} more
        </span>
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full min-h-[2.5rem] items-center justify-between rounded-md border border-input bg-background",
          "px-3 py-2 text-sm ring-offset-background",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <div className="flex-1 text-left">
          {renderTriggerContent()}
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      
      {isOpen && (
        <Portal>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className={cn(
              "absolute z-50 mt-1",
              "rounded-md border bg-popover p-1 shadow-md max-h-60 overflow-auto"
            )}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            {value.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              >
                모두 삭제
              </button>
            )}
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
}