import { ICustomerRepository, GetCustomersParams, PaginatedResult } from '../../interfaces/ICustomerRepository';
import { Customer } from '@/core/domain/entities/Customer';

export class GetCustomerListUseCase {
    constructor(private customerRepository: ICustomerRepository) { }

    async execute(params: GetCustomersParams): Promise<PaginatedResult<Customer>> {
        return this.customerRepository.getCustomers(params);
    }
}
