/// <reference path='../../ts/typings/tsd.d.ts' />

import Schedule = require('../models/Schedule');
import Semester = require('../models/Semester');
import RemoveScheduleModalCtrl = require('./RemoveScheduleModalCtrl');
import ChangeScheduleTitleModalCtrl = require('./ChangeScheduleTitleModalCtrl');
import NewScheduleModalCtrl = require('./NewScheduleModalCtrl');
import ExportScheduleModalCtrl = require('./ExportScheduleModalCtrl');
import Utils = require('../Utils');

'use strict';

class ScheduleCtrl {
    public static $inject =[
        '$scope',
        '$modal',
        '$element',
        'hotkeys',
        'UserService',
        'ScheduleResource',
        'ScheduleManagerService'
        ];

    private schedules;
    private semester;
    private prevScheduleIdx: number;

    constructor(
            private $scope,
            private $modal,
            private $element,
            private hotkeys,
            private userService,
            private scheduleResource,
            private scheduleManagerService
            ) {
        this.semester = this.$scope.$parent.semester;
        var semesterID = Utils.idxInList(
            this.$scope.semester, this.$scope.semesters, Semester.comp);
        this.$scope.semesterDiv =
            $("#semesterContainer .tab-content").eq(0).children().eq(semesterID);
        this.$scope.canAddNewSchedules = this.semester.current;

        this.schedules = [];
        this._restoreUserSchedules();
        this.$scope.schedules = this.schedules;
        this._setSelectedSchedule(-1);
        this.prevScheduleIdx = -1;

        this.$scope.$watch(() => {
            return this.$scope.selectedSchedule;
        }, (_newVal, oldVal) => {
            this.prevScheduleIdx = oldVal;
        });

        hotkeys.add({
            combo: 'mod+f',
            description: 'search',
            callback: (event, hotkey) => {
                // TODO: this is a hack using jQuery...
                // looks for the visible search bar and focuses
                // event.preventDefault();
                //$('.searchBar').filter(':visible').focus();
            }
        });
    }

    private _restoreUserSchedules() {
        var gettingPrevSchedules = this.userService.schedules.$promise;
        gettingPrevSchedules.then((schedules) => {
            for (var i = 0; i < schedules.length; i++) {
                var schedule = schedules[i];
                if (schedule.semester.term_code == this.semester.term_code) {
                    var newSchedule = {
                        id: schedule.id,
                        scheduleObject: schedule,
                        scheduleManager: this.scheduleManagerService.newScheduleManager(schedule),
                    };

                    this.schedules.push(newSchedule);
                }
            }

            this.schedules.sort(Schedule.compare);
            this._setSelectedSchedule(0);
        }).then(() => {
            if (this.schedules.length == 0) {
                this.addSchedule();
            }
        });
    }

    // TODO: refactor the modals for deleting and changing a modal
    public changeScheduleTitle(index: number) {
        if (this.$scope.selectedSchedule != index) {
            return;
        }

        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/changeScheduleTitleModal.html',
            controller: ChangeScheduleTitleModalCtrl,
            windowClass: 'center-modal',
            backdropClass: 'modal-backdrop',
            resolve: {
                title: () => {
                    return this.schedules[index].scheduleObject.title;
                }
            }
        });

        modalInstance.result.then((title) => {
            this.schedules[index].scheduleObject.title = title;
            this.schedules[index].scheduleObject.$update((newSchedule) => {
                console.log('title updated: ' + newSchedule.title);
            });
        });
    }

    public confirmRemoveSchedule(index: number) {
        if (this.$scope.selectedSchedule != index) {
            return;
        }

        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/removeScheduleModal.html',
            controller: RemoveScheduleModalCtrl,
            windowClass: 'center-modal',
            backdropClass: 'modal-backdrop',
            resolve: {
                title: () => {
                    return this.schedules[index].scheduleObject.title;
                }
            }
        });

        modalInstance.result.then(() => {
            this._removeSchedule(index);
        });
    }

    public askForNewScheduleName() {
        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/newScheduleModal.html',
            controller: NewScheduleModalCtrl,
            keyboard: true,
            resolve: {
                semester: () => {
                    return this.semester.name;
                }
            },
            backdropClass: 'modal-backdrop',
            windowClass: 'center-modal'
        });

        modalInstance.result.then((name) => {
            this._createSchedule(name);
        }, () => {
            this._setSelectedSchedule(this.prevScheduleIdx);
        });
    }

    private _createSchedule(scheduleName?: string) {
        var index = this.schedules.length;
        var newSchedule = new this.scheduleResource();
        newSchedule.semester = this.semester;
        newSchedule.enrollments = JSON.stringify([]);
        newSchedule.title = scheduleName ? scheduleName : "New Schedule";
        newSchedule.$save();
        this.schedules.push({
            scheduleObject: newSchedule,
            scheduleManager: this.scheduleManagerService.newScheduleManager(newSchedule)
        });

        this._setSelectedSchedule(index);
    }

    public onSelect($index: number) {
        this._setSelectedSchedule($index);
    }

    private _setSelectedSchedule(index: number) {
        this.$scope.selectedSchedule = index;
    }

    // TODO: this is a workaround
    // shouldn't have to access the schedule like this
    private _removeSchedule(index: number) {
        this.schedules[index].scheduleManager.schedule.$remove();
        this.schedules.splice(index, 1);
        this._setSelectedSchedule(Math.max(index - 1, 0));
    }

    public canRemove() {
        return this.schedules.length > 1;
    }

    public addSchedule() {
        this._createSchedule();
    }


    // export feature
    public exportToGoogleCalendar(index: number) {
      if (this.$scope.selectedSchedule != index) {
          return;
      }
        var modalInstance = this.$modal.open({
            templateUrl: '/static/templates/exportModal.html',
            controller: ExportScheduleModalCtrl,
            keyboard: true,
            resolve: {
                id: () => {
                    return this.schedules[index].scheduleObject.id;
                }
            },
            backdropClass: 'modal-backdrop',
            windowClass: 'center-modal'
        });

        modalInstance.result.then(() => {

        });
    }


}

export = ScheduleCtrl;
