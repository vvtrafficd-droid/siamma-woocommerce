"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { formatPostalCode, searchPostalCodes, PostalCodeInfo } from "@/lib/postalCodes";
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<PostalCodeInfo[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.length >= 2) {
      const results = searchPostalCodes(value);
      setSearchResults(results);
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPostalCode(rawValue);
    onChange(formattedValue);
  };

  const handleSelect = (postalCode: PostalCodeInfo) => {
    onChange(postalCode.code);
    onSelect(postalCode);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
          handleSelect(searchResults[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
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

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {searchResults.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nenhum código postal encontrado
            </div>
          ) : (
            searchResults.map((result, index) => (
              <div
                key={`${result.code}-${index}`}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-start gap-2",
                  highlightedIndex === index && "bg-gray-100"
                )}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{result.code}</div>
                  <div className="text-xs text-gray-600 truncate">
                    {result.locality}, {result.municipality}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.district}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};