import { User } from "./User";

export interface Customer extends User {
    orderCount: number;
    totalOrderAmount: number;
}

export interface CustomerStats {
    totalUsers: number;
    newUsersThisMonth: number;
    vipUsers: number;
}
