import { describe, expect, it, vi } from "vitest";

import { openApiDocument } from "../../src/docs/openapi";
import { docsUiOptions, openApiHandler, relaxSwaggerHeaders } from "../../src/docs/swagger";

describe("swagger docs", () => {
  it("expose le document OpenAPI via le handler dedie", async () => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res = { status, json } as unknown as Parameters<typeof openApiHandler>[1];

    await openApiHandler({} as Parameters<typeof openApiHandler>[0], res, vi.fn());

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(openApiDocument);
  });

  it("configure Swagger UI avec les options attendues", () => {
    expect(docsUiOptions.customSiteTitle).toBe("PHARMA 221 API Docs");
    expect(docsUiOptions.explorer).toBe(true);
    expect(docsUiOptions.swaggerOptions.persistAuthorization).toBe(true);
  });

  it("relache les headers de securite sur la route docs", async () => {
    const removeHeader = vi.fn();
    const next = vi.fn();
    const res = { removeHeader } as unknown as Parameters<typeof relaxSwaggerHeaders>[1];

    await relaxSwaggerHeaders(
      {} as Parameters<typeof relaxSwaggerHeaders>[0],
      res,
      next,
    );

    expect(removeHeader).toHaveBeenCalledWith("Content-Security-Policy");
    expect(removeHeader).toHaveBeenCalledWith("Cross-Origin-Opener-Policy");
    expect(next).toHaveBeenCalled();
  });
});
