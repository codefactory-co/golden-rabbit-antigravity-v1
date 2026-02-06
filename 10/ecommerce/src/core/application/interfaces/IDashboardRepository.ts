
import { DashboardData } from "../../domain/entities/DashboardData";

export interface IDashboardRepository {
    getDashboardData(): Promise<DashboardData>;
}
