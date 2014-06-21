/// <reference path="../typings/tsd.d.ts" />
import $ = require('jquery');
import Set = require('../library/DataStructures/Set');

$('#content').append('sample');
var testSet: Set<number> = new Set<number>();
console.log(testSet.contains(1));
testSet.add(1);
console.log(testSet.contains(1));
$('#content').data('set', testSet);
testSet = $('#content').data('set');
console.log(testSet.contains(1));
testSet.remove(1);
console.log(testSet.contains(1));
