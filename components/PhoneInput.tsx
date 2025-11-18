"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
};

function formatPhonePT(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("351")) {
    const local = digits.slice(3, 12);
    let out = "+351";
    if (local.length > 0) out += " " + local.slice(0, 3);
    if (local.length > 3) out += " " + local.slice(3, 6);
    if (local.length > 6) out += " " + local.slice(6, 9);
    return out;
  }
  const local = digits.slice(0, 9);
  if (local.length <= 3) return local;
  if (local.length <= 6) return `${local.slice(0, 3)} ${local.slice(3, 6)}`;
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 9)}`;
}

export const PhoneInput: React.FC<Props> = ({ value, onChange, placeholder = "+351 912 345 678", id, className }) => {
  return (
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(formatPhonePT(e.target.value))}
      placeholder={placeholder}
      className={cn("", className)}
      inputMode="tel"
    />
  );
};