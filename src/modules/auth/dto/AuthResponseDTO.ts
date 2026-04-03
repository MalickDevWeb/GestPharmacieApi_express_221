import { UserRole } from "../../../common/enums/role.enum";

export interface AuthResponseDTO {
  token: string;
  user: {
    email: string;
    role: UserRole;
  };
}
