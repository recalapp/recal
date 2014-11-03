/// <reference path="typings/tsd.d.ts" />
import $ = require('jquery');
import View = require('library/CoreUI/View');
import Set = require('library/DataStructures/Set');

var testView: View = new View($('<div>'));
var someSet: Set<number> = new Set<number>();
