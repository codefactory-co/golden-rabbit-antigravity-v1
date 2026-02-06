import { ICustomerRepository, CustomerStats } from '../../interfaces/ICustomerRepository';

export class GetCustomerStatsUseCase {
    constructor(private customerRepository: ICustomerRepository) { }

    async execute(): Promise<CustomerStats> {
        return this.customerRepository.getCustomerStats();
    }
}
