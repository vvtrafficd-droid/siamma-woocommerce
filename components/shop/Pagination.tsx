"use client";

import React from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ totalPages }: { totalPages: number }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  // ✅ Update URL parameters
  const updateParams = (updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || value === 0) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // ✅ Generate compact page numbers like: 1 2 … 9 10
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push("...");

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-2 mt-12">
      <div className="bg-white shadow-xs p-2 rounded-md flex gap-2 items-center">
        {/* Prev Button */}
        <Button
          className="bg-gray-100 border border-gray-300 hover:bg-gray-200 cursor-pointer"
          onClick={() => updateParams({ page: page - 1 })}
          disabled={page === 1}
        >
          <i className="ri-arrow-left-line mr-1"></i>
          
          <span className="hidden md:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        {getPageNumbers().map((num, i) =>
          num === "..." ? (
            <span key={i} className="px-2 text-gray-500 select-none">
              ...
            </span>
          ) : (
            <Button
              key={i}
              onClick={() => updateParams({ page: num as number })}
              className={
                page === num
                  ? "bg-blue-600 text-white cursor-pointer"
                  : "bg-gray-100 cursor-pointer"
              }
            >
              {num}
            </Button>
          )
        )}

        {/* Next Button */}
        <Button
          className="bg-gray-100 border border-gray-300 hover:bg-gray-200 cursor-pointer"
          onClick={() => updateParams({ page: page + 1 })}
          disabled={page === totalPages}
        >
          <span className="hidden md:inline">Next</span>
          <i className="ri-arrow-right-line ml-1"></i>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
