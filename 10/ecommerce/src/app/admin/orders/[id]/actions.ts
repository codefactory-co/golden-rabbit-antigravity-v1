
'use server'

import { createClient } from '@/utils/supabase/server';
import { SupabaseOrderRepository } from '@/infrastructure/repositories/SupabaseOrderRepository';
import { GetOrderDetailUseCase } from '@/core/application/use-cases/order/GetOrderDetailUseCase';
import { UpdateOrderStatusUseCase } from '@/core/application/use-cases/order/UpdateOrderStatusUseCase';
import { UpdateTrackingInfoUseCase } from '@/core/application/use-cases/order/UpdateTrackingInfoUseCase';
import { OrderStatusType } from '@/core/domain/entities/order/OrderStatus';
import { revalidatePath } from 'next/cache';

export async function getOrderDetailAction(id: string) {
    const supabase = await createClient();
    const orderRepository = new SupabaseOrderRepository(supabase);
    const useCase = new GetOrderDetailUseCase(orderRepository);

    return await useCase.execute(id);
}

export async function updateOrderStatusAction(id: string, status: OrderStatusType) {
    const supabase = await createClient();
    const orderRepository = new SupabaseOrderRepository(supabase);
    const useCase = new UpdateOrderStatusUseCase(orderRepository);

    await useCase.execute(id, status);
    revalidatePath(`/admin/orders/${id}`);
}

export async function updateTrackingNumberAction(id: string, carrier: string, trackingNumber: string) {
    const supabase = await createClient();
    const orderRepository = new SupabaseOrderRepository(supabase);
    const useCase = new UpdateTrackingInfoUseCase(orderRepository);

    await useCase.execute(id, carrier, trackingNumber);
    revalidatePath(`/admin/orders/${id}`);
}
