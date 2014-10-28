define(["require", "exports"], function(require, exports) {
    'use strict';

    var SearchCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function SearchCtrl($scope, $resource, courseResource) {
            this.$scope = $scope;
            this.$resource = $resource;
            this.courseResource = courseResource;
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            this.$scope.vm = this;
            this.$scope.courses = courseResource.get();
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            // $scope.$watch('todos', () => this.onTodos(), true);
            // $scope.$watch('location.path()', path => this.onPath(path))
            // if ($location.path() === '') $location.path('/');
            // $scope.location = $location;
        }
        SearchCtrl.$inject = [
            '$scope',
            '$resource',
            'CourseResource'
        ];
        return SearchCtrl;
    })();

    
    return SearchCtrl;
});
