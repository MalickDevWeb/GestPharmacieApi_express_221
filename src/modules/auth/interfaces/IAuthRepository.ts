import { UserRole } from "../../../common/enums/role.enum";
import { AuthResponseDTO } from "../dto/AuthResponseDTO";

export interface IAuthRepository {
  createLoginSession(email: string, role: UserRole): Promise<AuthResponseDTO>;
}
