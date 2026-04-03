import jwt from "jsonwebtoken";

import { UserRole } from "../../common/enums/role.enum";
import { env } from "../../config/env";
import { AuthResponseDTO } from "./dto/AuthResponseDTO";
import { IAuthRepository } from "./interfaces/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  async createLoginSession(email: string, role: UserRole): Promise<AuthResponseDTO> {
    const token = jwt.sign({ role }, env.JWT_SECRET, {
      subject: email,
      expiresIn: "1d",
    });

    return {
      token,
      user: {
        email,
        role,
      },
    };
  }
}
