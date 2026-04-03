import jwt from "jsonwebtoken";

import { UserRole } from "../../common/enums/role.enum";
import { env } from "../../config/env";

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async login(payload: LoginInput) {
    const token = jwt.sign({ role: UserRole.ADMIN }, env.JWT_SECRET, {
      subject: payload.email,
      expiresIn: "1d",
    });

    return {
      token,
      user: {
        email: payload.email,
        role: UserRole.ADMIN,
      },
    };
  }
}

