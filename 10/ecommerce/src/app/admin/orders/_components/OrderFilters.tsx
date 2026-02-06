'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";

export function OrderFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Reset to page 1
        router.push(`/admin/orders?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center space-x-2 my-4">
            <div className="relative max-w-sm w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="주문번호 또는 고객명 검색"
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {/* Date Picker (Range) is complex, for now standard Input type 'date' x2 or ignore per simple plan */}
            <div className="flex items-center space-x-2">
                <Input type="date" className="w-auto" aria-label="Start Date" />
                <span>~</span>
                <Input type="date" className="w-auto" aria-label="End Date" />
            </div>
            <Button onClick={handleSearch}>검색</Button>
        </div>
    );
}
