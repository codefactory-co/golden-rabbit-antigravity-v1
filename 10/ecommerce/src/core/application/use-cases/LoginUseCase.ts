import { LoginDTO } from '../dtos/LoginDTO';
import { IAuthRepository } from '../interfaces/IAuthRepository';

export class LoginUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(dto: LoginDTO): Promise<any> {
        // Validate Input (Basic)
        if (!dto.email || !dto.password) {
            throw new Error('Email and password are required');
        }

        return await this.authRepository.login(dto);
    }
}
