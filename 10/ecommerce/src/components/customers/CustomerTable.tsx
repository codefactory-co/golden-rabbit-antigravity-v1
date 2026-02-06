'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Customer } from "@/core/domain/entities/Customer";
import { useRouter, useSearchParams } from "next/navigation";

interface CustomerTableProps {
    data: Customer[];
    totalPages: number;
    currentPage: number;
}

export function CustomerTable({ data, totalPages, currentPage }: CustomerTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>고객명</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead className="text-right">주문수</TableHead>
                            <TableHead className="text-right">총구매액</TableHead>
                            <TableHead className="text-right">가입일</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                                >
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {customer.name}
                                        {customer.isVip && (
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        )}
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell className="text-right">{customer.orderCount}건</TableCell>
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(customer.totalOrderAmount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Date(customer.createdAt).toLocaleDateString('ko-KR')}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    이전
                </Button>
                <div className="text-sm font-medium">
                    {currentPage} / {Math.max(1, totalPages)} 페이지
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}
