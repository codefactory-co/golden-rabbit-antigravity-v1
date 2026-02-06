
import { IDashboardRepository } from "../../interfaces/IDashboardRepository";
import { DashboardData } from "../../../domain/entities/DashboardData";

export class GetDashboardDataUseCase {
    constructor(private dashboardRepository: IDashboardRepository) { }

    async execute(): Promise<DashboardData> {
        return this.dashboardRepository.getDashboardData();
    }
}
