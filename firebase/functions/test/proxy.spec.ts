import * as sinon from "sinon";
import { expect } from "chai";
import { resultsProxy } from "../src/proxy.js";
import { mockHttpRequest } from "./firebase-test-helper.js";

describe("resultsProxy", () => {
   afterEach(() => {
      sinon.restore();
   });

   it("should return 400 if no URL is provided", async () => {
      const { req, res } = mockHttpRequest("GET", null, {}, {});
      await resultsProxy(req as any, res as any);
      const { status, body } = res.getSent();
      expect(status).to.equal(400);
      expect(body).to.equal("Please provide a URL in the query string.");
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
      sinon.stub(global, "fetch").resolves(fetchResponse as any);

      const { req, res } = mockHttpRequest("GET", null, { url: targetUrl }, {});
      await resultsProxy(req as any, res as any);
      const { status, body } = res.getSent();
      expect(status).to.equal(200);
      expect(body).to.equal(mockHtml);
      expect((global.fetch as any).getCall(0).args[0]).to.equal(targetUrl);
   });

   it("should handle fetch errors gracefully", async () => {
      const targetUrl = "http://example.com/nonexistent";
      const error = new Error("Network error");
      sinon.stub(global, "fetch").rejects(error);

      const { req, res } = mockHttpRequest("GET", null, { url: targetUrl }, {});
      await resultsProxy(req as any, res as any);
      const { status, body } = res.getSent();
      expect(status).to.equal(500);
      expect(body).to.equal("Error fetching the URL.");
   });
});
