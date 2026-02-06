import { Payment } from "../../domain/entities/Payment";

export interface IPaymentRepository {
    savePayment(payment: Payment): Promise<void>;
    createPayment(payment: Payment): Promise<void>;
    updateStatus(orderId: string, status: string, reason?: string): Promise<void>;
    updatePayment(payment: Partial<Payment> & { orderId: string }): Promise<void>;
}
