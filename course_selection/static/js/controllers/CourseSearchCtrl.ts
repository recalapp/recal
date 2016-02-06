/// <reference path='../../ts/typings/tsd.d.ts' />

import ISection = require('../interfaces/ISection');
import ICourseSearchScope = require('../interfaces/ICourseSearchScope');
import ICourse = require('../interfaces/ICourse');
import Course = require('../models/Course');
import SearchCtrl = require('./SearchCtrl');
import IScheduleManager = require('../interfaces/IScheduleManager');
import ExportScheduleModalCtrl = require('./ExportScheduleModalCtrl');
import Utils = require('../Utils');

'use strict';

class CourseSearchCtrl {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$sce',
        '$filter',
        '$modal',
        '$http'
    ];

    private _scheduleManager: IScheduleManager;
    public get scheduleManager() {
        return this._scheduleManager;
    }

    constructor(
            private $scope,
            private $sce,
            private $filter,
            private $modal,
            private $http
            ) {

        this.$scope.vm = this;
        this._scheduleManager = (<any>this.$scope.$parent).schedule.scheduleManager;
        this.$scope.data = this._scheduleManager.getData();
        this.$scope.filteredCourses = this.$scope.data.courses;

        var scheduleID = Utils.idxInList(this.$scope.schedule, this.$scope.schedules);
        this.$scope.enrolledPanelsContainer = $(this.$scope.semesterDiv).find(".enrolled-courses-container").eq(scheduleID);
        this.$scope.searchPanelsContainer = $(this.$scope.semesterDiv)
        .find("#searchResultsContainer")
        .find(".course-panels-container")
        .eq(scheduleID);

        this.$scope.$watch(() => {
            return this.$scope.query;
        }, (newVal, oldVal) => {
            // don't do anything if not is course search mode
            if (this.$scope.whichSearch != SearchCtrl.whichSearchEnum.COURSE_SEARCH) {
                return;
            }

            this.search(newVal);
        });

        // also update search results if we switch back from friend
        // search to course search
        this.$scope.$watch(() => {
            return this.$scope.whichSearch;
            }, (newVal, oldVal) => {
                if (newVal == oldVal) {
                    return;
                }

                if (newVal == SearchCtrl.whichSearchEnum.COURSE_SEARCH) {
                    this.search(this.$scope.query);
                }
                });

        this.$scope.$watchCollection(() => {
            return this.$scope.data.enrolledCourses;
        }, (newVal, oldVal) => {
            if (newVal.length == oldVal.length) {
                return;
            }

            // don't do anything if not is course search mode
            if (this.$scope.whichSearch != SearchCtrl.whichSearchEnum.COURSE_SEARCH) {
                return;
            }

            this.$scope.filteredCourses =
                this.$filter("courseSearch")(this.$scope.data.courses, this.$scope.query);
        });
    }

    public search(query: string) {
        this._scheduleManager.clearPreviewCourse();

        this.$scope.filteredCourses = this.$filter("courseSearch")(this.$scope.data.courses, query);

        var enrolledLength = this.$scope.data.enrolledCourses.length;
        var searchResultLength = this.$scope.filteredCourses.length;

        this.updateContainerHeight(enrolledLength, searchResultLength);
    }

    // if user is not enrolled in course yet, add course events to previewEvents
    // else, don't do anything
    public onMouseOver(course) {
        if (this._scheduleManager.isCourseEnrolled(course)) {
            this._scheduleManager.clearPreviewCourse();
        } else {
            this._scheduleManager.setPreviewCourse(course);
        }
    }

    // clear preview course on mouse leave
    public onMouseLeave(course) {
        this._scheduleManager.clearPreviewCourse();
    }

    // toggle enrollment of course
    public toggleEnrollment(course) {
        if (this._scheduleManager.isCourseEnrolled(course)) {
            this._scheduleManager.unenrollCourse(course);
        } else {
            this._scheduleManager.enrollCourse(course);
        }
    }

    // we assume that course-panel-min-height is 5vh
    public updateContainerHeight(numEnrolled: number, numSearchResults) {
        var THRESHOLD = 10;
        var ENROLLED_CONTAINER_HEIGHT = '20vh';
        var SEARCH_CONTAINER_HEIGHT = '45vh';
        var MAX_HEIGHT = '70vh';

        var enrolledIsVisible = Utils.isVisible(this.$scope.enrolledPanelsContainer);
        var searchIsVisible = Utils.isVisible(this.$scope.searchPanelsContainer);

        // we clip at least one of the panel containers if we exceed the threshold
        if (numEnrolled + numSearchResults > THRESHOLD)
        {
            if (enrolledIsVisible && searchIsVisible) {
                this.$scope.enrolledPanelsContainer[0].style.maxHeight = ENROLLED_CONTAINER_HEIGHT;
                this.$scope.searchPanelsContainer[0].style.maxHeight = SEARCH_CONTAINER_HEIGHT;
            } else if (enrolledIsVisible) {
                this.$scope.enrolledPanelsContainer[0].style.maxHeight = MAX_HEIGHT;
            } else if (searchIsVisible) {
                this.$scope.searchPanelsContainer[0].style.maxHeight = MAX_HEIGHT;
            }
        } else {
            // reset things
            if (enrolledIsVisible) {
                this.$scope.enrolledPanelsContainer[0].style.maxHeight= MAX_HEIGHT;
            }
            if (searchIsVisible) {
                this.$scope.searchPanelsContainer[0].style.maxHeight= MAX_HEIGHT;
            }
        }
    }

    public getCourseStyles(course): any {
        return angular.extend({}, this.getCourseBorderStyle(course),
                this.getCourseBackgroundAndTextStyle(course));
    }

    public getCourseBorderStyle(course): any {
        return {
            'border-color': course.colors.dark
        };
    }

    public getCourseBackgroundAndTextStyle(course): any
    {
        return {
            'background-color': course.colors.light,
            'color': course.colors.dark
        };
    }

    public isConfirmed(course: ICourse) {
        return this._scheduleManager.isCourseAllSectionsEnrolled(course);
    }

    // TODO: this function no longer works due to course.colors never being null
    public getLinkColor(course) {
        if (course.colors) {
            return course.colors.dark;
        } else {
            return 'blue';
        }
    }

    // export feature
    public exportToGoogleCalendar(index: number) {
      // TODO: fix this validation
      /* if (this.$scope.selectedSchedule != index) {
          return;
      } */

      // make ajax call to get the url -- don't call something in ExportScheduleModalCtrl?
      var ical_api_url = '/icalapi/geturl/';
      var ical_api_url_makenew = '/icalapi/regenerate/';

      //this.$http.get(ical_api_url + index).then( function(response) {
      this.$http.get(ical_api_url + index).then((function($modal) { // have to pass in $modal to callback (http://stackoverflow.com/questions/19116815/how-to-pass-a-value-to-an-angularjs-http-success-callback)
        return function(response) {
          console.log('Ical api url: ' + response.data);
          var icalurl  = response.data;


          var modalInstance = $modal.open({
              templateUrl: '/static/templates/exportModal.html',
              controller: ExportScheduleModalCtrl,
              keyboard: true,
              resolve: {
                  id: () => {
                      return index; //this.schedules[index].scheduleObject.id;
                  },
                  url: () => {
                    return icalurl;
                  },
                  apiurl: () => {
                    return ical_api_url_makenew;
                  }
              },
              backdropClass: 'modal-backdrop',
              //windowClass: 'center-modal',
              size: 'lg'
          });

          modalInstance.result.then(() => {

          });
        }
      })(this.$modal));


    }
}

export = CourseSearchCtrl;
