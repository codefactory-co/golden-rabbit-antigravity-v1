import { ISalesRepository, Period, DashboardData } from "../../interfaces/ISalesRepository";

export class GetSalesDashboardStatsUseCase {
    constructor(private salesRepository: ISalesRepository) { }

    async execute(period: Period): Promise<DashboardData> {
        return this.salesRepository.getDashboardData(period);
    }
}
