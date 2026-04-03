import { UserRole } from "../../common/enums/role.enum";
import { AuthResponseDTO } from "./dto/AuthResponseDTO";
import { LoginDTO } from "./dto/LoginDTO";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { IAuthService } from "./interfaces/IAuthService";
import { AuthRepository } from "./auth.repository";

export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository = new AuthRepository()) {}

  async login(payload: LoginDTO): Promise<AuthResponseDTO> {
    return this.authRepository.createLoginSession(payload.email, UserRole.ADMIN);
  }
}
