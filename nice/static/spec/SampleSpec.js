/// <reference path="../typings/tsd.d.ts" />
require(["require", "exports", 'jquery'], function(require, exports, $) {
    describe("Sample test", function () {
        it("Testing jQuery", function () {
            expect(false).toBe(false);
            var a = $("<div>");
            expect(a).toEqual($("<div>"));
        });
    });
});
