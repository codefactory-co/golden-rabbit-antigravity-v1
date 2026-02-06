import { ICustomerRepository } from "../../interfaces/ICustomerRepository";
import { CustomerDetail } from "@/core/domain/entities/CustomerDetail";

export class GetCustomerDetailUseCase {
    constructor(private customerRepository: ICustomerRepository) { }

    async execute(id: string): Promise<CustomerDetail | null> {
        return this.customerRepository.getCustomerDetail(id);
    }
}
