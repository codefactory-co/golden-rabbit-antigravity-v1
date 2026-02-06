
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart2,
    Settings
} from "lucide-react";

export function Sidebar() {
    const menuItems = [
        { name: "대시보드", href: "/dashboard", icon: LayoutDashboard },
        { name: "상품 관리", href: "/admin/products", icon: Package },
        { name: "주문 관리", href: "/admin/orders", icon: ShoppingCart },
        { name: "고객 관리", href: "/dashboard/customers", icon: Users },
        { name: "매출 분석", href: "/admin/sales", icon: BarChart2 },
        { name: "설정", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600">Admin</h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
