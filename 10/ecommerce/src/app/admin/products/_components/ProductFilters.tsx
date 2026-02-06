
export function ProductFilters() {
    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
                <input
                    type="text"
                    placeholder="상품명 검색"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                />
            </div>

            <select className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border">
                <option value="all">전체 카테고리</option>
                <option value="1">전자제품</option>
                <option value="2">의류</option>
                <option value="3">식품</option>
            </select>

            <select className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border">
                <option value="all">전체 상태</option>
                <option value="active">판매중</option>
                <option value="out_of_stock">품절</option>
                <option value="draft">숨김</option>
            </select>
        </div>
    );
}
