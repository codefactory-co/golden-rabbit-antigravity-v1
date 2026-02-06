import { User } from '@/core/domain/entities/User';
import { LoginDTO } from '@/core/application/dtos/LoginDTO';

export interface IAuthRepository {
    login(dto: LoginDTO): Promise<User>;
}
