'use client';

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function CustomerFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            // Only update if the search param actually changed to avoid loop with page reset
            if (params.get('search') !== searchParams.get('search')) {
                params.set('page', '1');
                router.replace(`?${params.toString()}`);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, router, searchParams]);

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', value);
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="이름 또는 이메일 검색"
                    className="pl-8"
                    defaultValue={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select
                defaultValue={searchParams.get('sort') || "joinedAt_desc"}
                onValueChange={handleSort}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="joinedAt_desc">가입일시 (최신순)</SelectItem>
                    <SelectItem value="joinedAt_asc">가입일시 (과거순)</SelectItem>
                    <SelectItem value="totalAmount_desc">구매금액 (높은순)</SelectItem>
                    <SelectItem value="totalAmount_asc">구매금액 (낮은순)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
