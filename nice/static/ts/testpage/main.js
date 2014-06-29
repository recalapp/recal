define(["require", "exports", 'jquery', '../library/DataStructures/Set', '../library/PopUp/PopUpView'], function(require, exports, $, Set, PopUpView) {
    $('#content').append('sample');
    var testSet = new Set();
    console.log(testSet.contains(1));
    testSet.add(1);
    console.log(testSet.contains(1));
    $('#content').data('set', testSet);
    testSet = $('#content').data('set');
    console.log(testSet.contains(1));
    testSet.remove(1);
    console.log(testSet.contains(1));
    var test = PopUpView.fromJQuery($('<div>'));
});
