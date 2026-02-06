import { Customer, CustomerStats } from "../../domain/entities/Customer";
import { CustomerDetail } from "../../domain/entities/CustomerDetail";
export type { Customer, CustomerStats };

export interface GetCustomersParams {
    page: number;
    limit: number;
    search?: string;
    sortBy?: 'joinedAt' | 'totalAmount';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ICustomerRepository {
    getCustomers(params: GetCustomersParams): Promise<PaginatedResult<Customer>>;
    getCustomerStats(): Promise<CustomerStats>;
    getCustomerDetail(id: string): Promise<CustomerDetail | null>;
}
