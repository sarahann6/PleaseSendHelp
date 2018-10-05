import { Robinhood } from "..";

describe("sdfsdf", () => {
    it("should do something", async (done) => {
        let response = await new Robinhood().quoteData("GOOG");

        expect(response.results[0].symbol).toBe("GOOG");
        done();
    });
});
