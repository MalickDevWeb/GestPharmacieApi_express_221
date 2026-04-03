import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserRole } from "../../src/common/enums/role.enum";
import { AuthService } from "../../src/modules/auth/auth.service";
import { IAuthRepository } from "../../src/modules/auth/interfaces/IAuthRepository";

describe("AuthService", () => {
  let repository: IAuthRepository;
  let service: AuthService;

  beforeEach(() => {
    repository = {
      createLoginSession: vi.fn().mockResolvedValue({
        token: "token-123",
        user: {
          email: "admin@pharma221.sn",
          role: UserRole.ADMIN,
        },
      }),
    };

    service = new AuthService(repository);
  });

  it("cree une session admin via le repository", async () => {
    const result = await service.login({
      email: "admin@pharma221.sn",
      password: "secret123",
    });

    expect(repository.createLoginSession).toHaveBeenCalledWith(
      "admin@pharma221.sn",
      UserRole.ADMIN,
    );
    expect(result.token).toBe("token-123");
    expect(result.user.role).toBe(UserRole.ADMIN);
  });
});
