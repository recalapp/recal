/// <reference path="../typings/tsd.d.ts" />

import $ = require('jquery');
describe("Sample test", function(){
    it("Testing jQuery", function(){
        expect(false).toBe(false);
        var a = $("<div>");
        expect(a).toEqual($("<div>"));
    });
});
