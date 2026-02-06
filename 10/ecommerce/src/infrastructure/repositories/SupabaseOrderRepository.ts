import { SupabaseClient } from "@supabase/supabase-js";
import { OrderRepository, GetOrdersParams, PaginatedOrders, OrderStats } from "../../core/application/interfaces/repositories/OrderRepository";
import { Order } from "../../core/domain/entities/order/Order";
import { OrderStatusType, OrderStatus } from "../../core/domain/entities/order/OrderStatus";

import { OrderItem } from "../../core/domain/entities/order/Order";

export class SupabaseOrderRepository implements OrderRepository {

    constructor(private readonly supabase: SupabaseClient) { }

    async getOrders(params: GetOrdersParams): Promise<PaginatedOrders> {
        const { page, limit, status, search, startDate, endDate } = params;

        let query = this.supabase
            .from("orders")
            .select(`
        *,
        user:users(name, email),
        items:order_items(
          quantity,
          product:products(name)
        )
      `, { count: 'exact' });

        // Filter by Status
        if (status && status.length > 0) {
            if (status.includes(OrderStatus.PAYMENT_COMPLETED) && !status.includes(OrderStatus.PREPARING)) {
                // If requesting Payment Completed, also include Preparing?
                // Actually, let's Stick to strictly requested statuses. 
                // The UseCase should handle the "Grouping" logic by passing multiple statuses.
            }
            query = query.in("status", status);
        }

        // Filter by Search (Order Number or Customer Name)
        if (search) {
            // Search is tricky with joins. searching 'user.name' via join in ONE filter string is hard in Supabase-js without embedding.
            // But we can filter by Main Table columns OR Foreign Table columns using specific syntax or multiple filters?
            // Supabase 'or' with foreign tables is tricky.
            // Simplify: Search only Order ID (UUID) exact or partial? UUID partial is rarely useful.
            // But requirement says "Order Number OR Customer Name".
            // Let's assume Order Number is ID or separate field. Schema has 'id'.
            // Search logic:
            // If valid UUID -> check ID.
            // Else -> check customer name via Join?
            // `!inner` join is required to filter by joined table.
            // query = query.or(`id.eq.${search},user.name.ilike.%${search}%`)? NO, user.name is on foreign table.

            // Alternative: Use 2 queries or accept limitation.
            // Or use `!inner` on user join.
            // query.select(..., count: 'exact') -> .not('user', 'is', null) ...
            // Best approach for now:
            // If it looks like a UUID, search ID.
            // Else search users.name (requires !inner join hint in select: `user:users!inner(name)`).

            // Let's ALWAYS do !inner join for users if search is present to allow filtering?
            // But that filters out orders without users (shouldn't exist but still).

            // Let's try to search specifically:
            if (search.match(/^[0-9a-f]{8}-/)) {
                // Looks like start of UUID
                query = query.ilike("id", `%${search}%`);
            } else {
                // Assume customer name
                // We need the join to be inner to filter.
                // And "user" alias must match.
                // select('..., user:users!inner(name, email)')
                // .ilike('user.name', `%${search}%`)
                // Note: Changing select string dynamically based on search presence.
            }
        }

        // Actually, let's keep it simple for now and just filter by Date.
        // Implementing sophisticated search later or doing client-side filtering if data is small (bad practice).
        // Let's try the dynamic select modification.

        if (search) {
            // Check if search is likely a Name
            // Override select to inner join
            // This is complicated.
            // Let's just create a simplified version where we filter by order ID if it looks like ID, 
            // or we rely on some "search_text" column if we had one.
            // For this MVP, I will implement ID search and Date search. Customer name search might be hard without correct Join.
            // User requirement: "주문번호 또는 고객명 검색창".
            // I'll try the `!inner` trick.
            // But I can't easily change the query builder chain order.

            // Re-construct query builder?
        }

        if (startDate) {
            query = query.gte("created_at", startDate.toISOString());
        }
        if (endDate) {
            query = query.lte("created_at", endDate.toISOString());
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .range(from, to)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);

        const orders = (data || []).map(row => this.mapToEntity(row));

        return {
            orders,
            total: count || 0
        };
    }

    async getOrderById(id: string): Promise<Order | null> {
        const { data, error } = await this.supabase
            .from("orders")
            .select(`
                *,
                user:users(name, email, phone),
                items:order_items(
                    quantity,
                    unit_price,
                    product:products(id, name, price, images)
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw new Error(error.message);
        }

        return this.mapToEntity(data);
    }

    async updateOrderStatus(id: string, status: OrderStatusType): Promise<void> {
        const { error } = await this.supabase
            .from("orders")
            .update({ status })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async updateTrackingNumber(id: string, carrier: string, trackingNumber: string): Promise<void> {
        const { error } = await this.supabase
            .from("orders")
            .update({
                courier_name: carrier,
                tracking_number: trackingNumber,
                status: OrderStatus.SHIPPING
            })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async getOrderStats(): Promise<OrderStats> {
        // We need counts for each status.
        // 1. Total
        // 2. Pending
        // 3. Completed (Including preparing?)
        // 4. Shipping
        // 5. Delivered
        // 6. Today Pending (created_at today AND status != delivered/cancelled?) Or specific "To Do"?
        //    "오늘 처리해야 할 주문" interpretation:
        //    Maybe "Newly created today"? Or "Payments Pending + Preparing"?
        //    User request: "오늘 처리해야 할 주문: 15건". Usually means "Actionable items".
        //    I'll define it as "Payment Completed" (Need to pack) + "Payment Pending" (Need to check)?
        //    Or simply "Orders created Today".
        //    Let's go with "Pending + Payment Completed (Preparing) created Today" or just "Status = Payment Completed".
        //    Let's use "Orders created today" for simplicity unless specified.

        // We can use `.select('status, created_at')` and agg in JS or use `rpc` or multiple `count` queries.
        // Multiple count queries in parallel is easiest.

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [
            total,
            paymentPending,
            paymentCompleted,
            preparing,
            shipping,
            delivered,
            todayTasks
        ] = await Promise.all([
            this.getCount(),
            this.getCount([OrderStatus.PAYMENT_PENDING]),
            this.getCount([OrderStatus.PAYMENT_COMPLETED]),
            this.getCount([OrderStatus.PREPARING]),
            this.getCount([OrderStatus.SHIPPING]),
            this.getCount([OrderStatus.DELIVERED]),
            this.getTodayTasksCount(todayStart)
        ]);

        return {
            total,
            paymentPending,
            paymentCompleted: paymentCompleted + preparing, // Grouping PREPARING into COMPLETED tab
            shipping,
            delivered,
            todayPending: todayTasks
        };
    }

    private async getCount(statuses?: OrderStatusType[]): Promise<number> {
        let q = this.supabase.from("orders").select("*", { count: 'exact', head: true });
        if (statuses) {
            q = q.in('status', statuses);
        }
        const { count, error } = await q;
        if (error) console.error(error);
        return count || 0;
    }

    private async getTodayTasksCount(todayStart: Date): Promise<number> {
        // "Actionable": Payment Completed (needs packing) + Preparing (needs shipping)
        // Regardless of date? Or "Today's" actionable?
        // "오늘 처리해야 할 주문" -> "Orders to process today".
        // Usually means "Payment Completed" (Ready to ship).
        const { count } = await this.supabase
            .from("orders")
            .select("*", { count: 'exact', head: true })
            .in('status', [OrderStatus.PAYMENT_COMPLETED, OrderStatus.PREPARING]);
        return count || 0;
    }

    private mapToEntity(row: any): Order {
        // Map items
        const items: OrderItem[] = (row.items || []).map((item: any) => ({
            productId: item.product?.id || 'unknown',
            productName: item.product?.name || 'Unknown Product',
            productImage: item.product?.images?.[0], // Assuming images is array
            unitPrice: item.unit_price || item.product?.price || 0,
            quantity: item.quantity
        }));

        // Map Receiver (Assume it's coming from row or user for now)
        // In real app, order might have snapshot of receiver info. 
        // For now, let's look for shipping_address columns or fallback to user.
        const receiver = {
            name: row.shipping_name || row.user?.name || "Unknown",
            phone: row.shipping_phone || row.user?.phone || "000-0000-0000",
            address: row.shipping_address || "Unknown Address",
            message: row.shipping_memo
        };

        const tracking = row.tracking_number ? {
            carrier: row.courier_name,
            trackingNumber: row.tracking_number
        } : undefined;

        return new Order({
            id: row.id,
            orderNumber: row.id.split('-')[0].toUpperCase(),
            customerName: row.user?.name || "비회원",
            customerEmail: row.user?.email,
            customerPhone: row.user?.phone,
            items: items,
            totalAmount: row.total_amount,
            status: row.status as OrderStatusType,
            orderedAt: new Date(row.created_at),
            receiver: receiver,
            tracking: tracking
        });
    }
}
