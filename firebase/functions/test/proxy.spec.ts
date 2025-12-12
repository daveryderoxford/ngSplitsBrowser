import * as sinon from "sinon";
import { expect } from "chai";
import { resultsProxy } from "../src/proxy";

describe("resultsProxy", () => {
   afterEach(() => {
      sinon.restore();
   });

   it("should return 400 if no URL is provided", async () => {
      const req = { query: {} };
      const res = {
         status: (code: number) => {
            expect(code).to.equal(400);
            return {
               send: (message: string) => {
                  expect(message).to.equal(
                     "Please provide a URL in the query string."
                  );
               },
            };
         },
      };

      await resultsProxy(req as any, res as any);
   });

   it("should proxy the request and return the response", async () => {
      const targetUrl = "http://example.com/results";
      const mockHtml = "<html><body>Results</body></html>";

      const fetchResponse = {
         status: 200,
         text: () => Promise.resolve(mockHtml),
      };
      sinon.stub(global, "fetch").resolves(fetchResponse as any);

      const req = { query: { url: targetUrl } };
      const res = {
         status: (code: number) => {
            expect(code).to.equal(200);
            return {
               send: (response: any) => {
                  expect(response).to.equal(fetchResponse);
               },
            };
         },
      };

      await resultsProxy(req as any, res as any);
      expect((global.fetch as any).getCall(0).args[0]).to.equal(targetUrl);
   });

   it("should handle fetch errors gracefully", async () => {
      const targetUrl = "http://example.com/nonexistent";
      const error = new Error("Network error");
      sinon.stub(global, "fetch").rejects(error);

      const req = { query: { url: targetUrl } };
      const res = {
         status: (code: number) => {
            expect(code).to.equal(500);
            return {
               send: (message: string) => {
                  expect(message).to.equal("Error fetching the URL.");
               },
            };
         },
      };
      await resultsProxy(req as any, res as any);
   });
});


