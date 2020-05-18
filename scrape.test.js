var fs = require("fs");

const { getRougeStock } = require("./scrape");

describe("getRougeStock", () => {
    const mockHtml = fs.readFileSync(__dirname + "/mock.html");
    it("finds stock", () => {
        const mockInstock = getRougeStock(mockHtml.toString(), [
          "0.25LB Calibrated Plate - Pair",
          "1LB Calibrated Plate - Pair",
          "10LB Calibrated Plate - Pair",
          "35LB Calibrated Plate - Pair",
          "45LB Calibrated Plate - Pair",
          "55LB Calibrated Plate - Pair",
        ]);
        expect(mockInstock).toEqual([
          "0.25LB Calibrated Plate - Pair",
          "1LB Calibrated Plate - Pair",
        ]);
    })
    it("nothing instock", () => {
        const mockInstock = getRougeStock(mockHtml.toString(), [
          "35LB Calibrated Plate - Pair",
          "45LB Calibrated Plate - Pair",
          "55LB Calibrated Plate - Pair",
        ]);
        expect(mockInstock).toEqual([]);
    })
});
