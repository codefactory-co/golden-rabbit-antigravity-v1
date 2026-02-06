import { ExecuteBillingPaymentUseCase } from "./ExecuteBillingPaymentUseCase";
import { RegisterBillingKeyUseCase } from "./RegisterBillingKeyUseCase";

export class StartSubscriptionUseCase {
    constructor(
        private registerBillingKeyUseCase: RegisterBillingKeyUseCase,
        private executeBillingPaymentUseCase: ExecuteBillingPaymentUseCase
    ) { }

    async execute(params: {
        authKey: string;
        customerKey: string;
        plan?: string;
        amount?: number;
    }): Promise<void> {
        // 1. Issue Billing Key and Register
        await this.registerBillingKeyUseCase.execute(params);

        // 2. Execute First Payment (Immediate)
        await this.executeBillingPaymentUseCase.execute(params.customerKey);
    }
}
