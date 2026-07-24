import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder = "Select option" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:border-zinc-400 hover:bg-zinc-100/50 transition-all text-left cursor-pointer"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown 
          size={14} 
          className={`text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180 text-zinc-800" : ""}`} 
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200/80 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto py-1"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm transition-colors cursor-pointer ${
                  isSelected 
                    ? "bg-zinc-950 text-white font-medium" 
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
