define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        function SearchCtrl($scope, $resource, courseResource) {
            this.$scope = $scope;
            this.$resource = $resource;
            this.courseResource = courseResource;
            this.$scope.vm = this;
            this.$scope.courses = courseResource.get();
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            // $scope.$watch('todos', () => this.onTodos(), true);
            // $scope.$watch('location.path()', path => this.onPath(path))
            // if ($location.path() === '') $location.path('/');
            // $scope.location = $location;
        }
        SearchCtrl.prototype.onMouseOver = function (course) {
            var eventTimes = this.getEventTimes(course);
        };

        SearchCtrl.prototype.getEventTimes = function (course) {
            return [];
        };
        SearchCtrl.$inject = [
            '$scope',
            '$resource',
            'CourseResource'
        ];
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});
