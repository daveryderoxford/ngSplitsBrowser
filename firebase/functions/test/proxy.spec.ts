import { describe, it, expect, afterEach, vi } from "vitest";
import { resultsProxy } from "../src/proxy.js";
import { mockHttpRequest } from "./firebase-test-helper.js";

describe("resultsProxy", () => {
   afterEach(() => {
      vi.unstubAllGlobals();
   });

   it("should return 400 if no URL is provided", async () => {
      const { req, res } = mockHttpRequest("GET", null, {}, {});
      await resultsProxy(req as any, res as any);
      const { status, body } = res.getSent();
      expect(status).toBe(400);
      expect(body).toBe("Please provide a URL in the query string.");
   });

   it("should proxy the request and return the response", async () => {
      const targetUrl = "http://example.com/results";
      const mockHtml = "<html><body>Results</body></html>";

      const fetchResponse = {
         ok: true,
         status: 200,
         statusText: "OK",
         text: () => Promise.resolve(mockHtml),
         headers: { get: () => "text/html" },
      };
      
      const fetchSpy = vi.fn().mockResolvedValue(fetchResponse);
      vi.stubGlobal("fetch", fetchSpy);

      const { req, res } = mockHttpRequest("GET", null, { url: targetUrl }, {});
      await resultsProxy(req as any, res as any);
      const { status, body } = res.getSent();
      expect(status).toBe(200);
      expect(body).toBe(mockHtml);
      expect(fetchSpy).toHaveBeenCalledWith(targetUrl, expect.anything());
   });

   it("should handle fetch errors gracefully", async () => {
      const targetUrl = "http://example.com/nonexistent";
      const error = new Error("Network error");
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));

      const { req, res } = mockHttpRequest("GET", null, { url: targetUrl }, {});
      await resultsProxy(req as any, res as any);
      const { status, body } = res.getSent();
      expect(status).toBe(500);
      expect(body).toBe("Error fetching the URL.");
   });
});
