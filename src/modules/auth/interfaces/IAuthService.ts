import { AuthResponseDTO } from "../dto/AuthResponseDTO";
import { LoginDTO } from "../dto/LoginDTO";

export interface IAuthService {
  login(payload: LoginDTO): Promise<AuthResponseDTO>;
}
