import ICourse = require('../interfaces/ICourse');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import CourseResource = require('../services/CourseResource');

'use strict';

class SearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$resource',
        'CourseResource',
    ];

    constructor(
            private $scope: ICourseSearchScope,
            private $resource: ng.resource.IResourceService,
            private courseResource
            ) {
        this.$scope.vm = this;
        this.$scope.courses = courseResource.get();

        // watching for events/changes in scope, which are caused by view/user input
        // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
        // $scope.$watch('todos', () => this.onTodos(), true);
        // $scope.$watch('location.path()', path => this.onPath(path))

        // if ($location.path() === '') $location.path('/');
        // $scope.location = $location;
    }

    public onMouseOver(course) {
        var eventTimes = this.getEventTimes(course);
    }

    private getEventTimes(course) {
        return [];
    }
}

export = SearchCtrl;
