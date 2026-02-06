export type UserRole = 'admin' | 'customer';

export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly name: string,
        public readonly role: UserRole,
        public readonly isVip: boolean,
        public readonly createdAt: Date,
    ) { }
}
