import { ProductSales } from "@/core/domain/entities/ProductSales";

interface Props {
    bestSellers: ProductSales[];
}

export default function BestSellerList({ bestSellers }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow h-full">
            <h3 className="text-lg font-bold mb-4">베스트셀러</h3>
            <div className="space-y-4">
                {bestSellers.map((item) => (
                    <div key={item.rank} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mr-3 ${item.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                                    item.rank === 2 ? "bg-gray-100 text-gray-700" :
                                        item.rank === 3 ? "bg-orange-100 text-orange-700" : "text-gray-500"
                                }`}>
                                {item.rank}
                            </span>
                            <p className="font-medium text-sm text-gray-900">{item.productName}</p>
                        </div>
                        <p className="text-sm text-gray-500">{item.salesCount}개 판매</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
