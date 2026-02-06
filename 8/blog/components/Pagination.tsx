import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath?: string;
    searchParams?: Record<string, string>;
}

function buildHref(basePath: string, page: number, searchParams: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
        params.set('page', String(page));
    } else {
        params.delete('page');
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (currentPage > 3) {
        pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - 2) {
        pages.push('...');
    }

    pages.push(totalPages);

    return pages;
}

export default function Pagination({ currentPage, totalPages, basePath = '/', searchParams = {} }: PaginationProps) {
    const pageNumbers = getPageNumbers(currentPage, Math.max(1, totalPages));

    return (
        <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
            {currentPage > 1 ? (
                <Link
                    href={buildHref(basePath, currentPage - 1, searchParams)}
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Link>
            ) : (
                <span className="p-2 rounded-md text-gray-400 opacity-50">
                    <ChevronLeft className="w-4 h-4" />
                </span>
            )}

            {pageNumbers.map((item, index) =>
                item === '...' ? (
                    <span key={`dots-${index}`} className="text-gray-600 px-2">...</span>
                ) : (
                    <Link
                        key={item}
                        href={buildHref(basePath, item, searchParams)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            item === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                    >
                        {item}
                    </Link>
                )
            )}

            {currentPage < totalPages ? (
                <Link
                    href={buildHref(basePath, currentPage + 1, searchParams)}
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <span className="p-2 rounded-md text-gray-400 opacity-50">
                    <ChevronRight className="w-4 h-4" />
                </span>
            )}
        </div>
    );
}
