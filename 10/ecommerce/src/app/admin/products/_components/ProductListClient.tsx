
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductTable } from './ProductTable';
import { ProductFilters } from './ProductFilters';
import { ProductViewModel } from './ProductTable';
import { PaginatedResult } from '@/core/application/interfaces/ProductRepository';

interface Props {
    initialData: PaginatedResult<ProductViewModel>;
}

export function ProductListClient({ initialData }: Props) {
    // We'll manage local state here or sync with URL params. 
    // For TDD step 1 of UI, let's just render the structure.

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">상품 관리</h1>
                <Link href="/admin/products/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    상품 등록
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <ProductFilters />
                <div className="mt-6">
                    <ProductTable initialData={initialData.data} />
                </div>
                {/* Pagination Stub */}
                <div className="mt-4 flex justify-center">
                    <span className="p-2">1</span>
                </div>
            </div>
        </div>
    );
}
