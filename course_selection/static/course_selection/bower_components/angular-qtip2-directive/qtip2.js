!function($) {

  'use strict';

  angular.module('qtip2', [])
    .directive('qtip', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var my = attrs.my || 'bottom center'
            , at = attrs.at || 'top center'
            , qtipClass = attrs.class || 'qtip'

          $(element).qtip({
            content: attrs.content,
            position: {
              my: my,
              at: at,
              target: element
            },
            hide: {
              fixed : true,
              delay : 100
            },
            style: qtipClass
          })
        }
      }
    })

}(window.jQuery);
