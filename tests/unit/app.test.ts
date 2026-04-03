import { describe, expect, it, vi } from "vitest";

import { healthHandler } from "../../src/routes";

describe("healthHandler", () => {
  it("retourne l'etat de sante de l'API", async () => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res = { status, json } as unknown as Parameters<typeof healthHandler>[1];

    await healthHandler({} as Parameters<typeof healthHandler>[0], res, vi.fn());

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      success: true,
      message: "API GestPharmacie operationnelle.",
      data: {
        service: "GestPharmacie API",
        status: "ok",
      },
    });
  });
});
