"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { formatPostalCode, PostalCodeInfo, isValidPostalCode } from "@/lib/postalCodes";
import { cn } from "@/lib/utils";

interface PostalCodeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (postalCode: PostalCodeInfo) => void;
  placeholder?: string;
  className?: string;
}

export const PostalCodeAutocomplete: React.FC<PostalCodeAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "XXXX-XXX",
  className,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isValidPostalCode(value)) return;
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const run = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=pt&postalcode=${encodeURIComponent(value)}&limit=1`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;
        const item = data[0];
        const addr = item.address || {};
        const locality = addr.city || addr.town || addr.village || "";
        const municipality = addr.county || addr.city || addr.town || "";
        const district = addr.state || "";
        const info: PostalCodeInfo = { code: value, locality, municipality, district };
        onSelect(info);
      } catch {}
    };
    run();
    return () => controller.abort();
  }, [value, onSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPostalCode(rawValue);
    onChange(formattedValue);
  };

  const handleSelect = (postalCode: PostalCodeInfo) => {
    onChange(postalCode.code);
    onSelect(postalCode);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => prev + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (isValidPostalCode(value)) {
          handleSelect({ code: value, locality: "", municipality: "", district: "" });
        }
        break;
      case "Escape":
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10",
            className
          )}
          maxLength={8}
        />
      </div>

      
  </div>
  );
};