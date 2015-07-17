define(["require", "exports", '../models/Schedule', './RemoveScheduleModalCtrl', './ChangeScheduleTitleModalCtrl', './NewScheduleModalCtrl'], function(require, exports, Schedule, RemoveScheduleModalCtrl, ChangeScheduleTitleModalCtrl, NewScheduleModalCtrl) {
    'use strict';

    var ScheduleCtrl = (function () {
        function ScheduleCtrl($scope, $modal, $element, hotkeys, userService, scheduleResource, scheduleManagerService) {
            this.$scope = $scope;
            this.$modal = $modal;
            this.$element = $element;
            this.hotkeys = hotkeys;
            this.userService = userService;
            this.scheduleResource = scheduleResource;
            this.scheduleManagerService = scheduleManagerService;
            this.semester = this.$scope.$parent.semester;
            this.$scope.canAddNewSchedules = this.semester.current;

            this.schedules = [];
            this._restoreUserSchedules();
            this.$scope.schedules = this.schedules;
            this.$scope.selectedSchedule = -1;

            hotkeys.add({
                combo: 'mod+f',
                description: 'search',
                callback: function (event, hotkey) {
                }
            });
        }
        ScheduleCtrl.prototype._restoreUserSchedules = function () {
            var _this = this;
            var gettingPrevSchedules = this.userService.schedules.$promise;
            gettingPrevSchedules.then(function (schedules) {
                for (var i = 0; i < schedules.length; i++) {
                    var schedule = schedules[i];
                    if (schedule.semester.term_code == _this.semester.term_code) {
                        var newSchedule = {
                            id: schedule.id,
                            scheduleObject: schedule,
                            active: true,
                            scheduleManager: _this.scheduleManagerService.newScheduleManager(schedule)
                        };

                        _this._setAllInactive();
                        _this.schedules.push(newSchedule);
                    }
                }

                _this.schedules.sort(Schedule.compare);
            }).then(function () {
                if (_this.schedules.length == 0) {
                    _this.addSchedule();
                }
            });
        };

        ScheduleCtrl.prototype._setAllInactive = function () {
            angular.forEach(this.schedules, function (schedule) {
                schedule.active = false;
            });
        };

        ScheduleCtrl.prototype.changeScheduleTitle = function (index) {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: '/static/templates/changeScheduleTitleModal.html',
                controller: ChangeScheduleTitleModalCtrl,
                windowClass: 'center-modal',
                backdropClass: 'modal-backdrop',
                resolve: {
                    title: function () {
                        return _this.schedules[index].scheduleObject.title;
                    }
                }
            });

            modalInstance.result.then(function (title) {
                _this.schedules[index].scheduleObject.title = title;
                _this.schedules[index].scheduleObject.$update(function (newSchedule) {
                    console.log('title updated: ' + newSchedule.title);
                });
            });
        };

        ScheduleCtrl.prototype.confirmRemoveSchedule = function (index) {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: '/static/templates/removeScheduleModal.html',
                controller: RemoveScheduleModalCtrl,
                windowClass: 'center-modal',
                backdropClass: 'modal-backdrop',
                resolve: {
                    title: function () {
                        return _this.schedules[index].scheduleObject.title;
                    }
                }
            });

            modalInstance.result.then(function () {
                _this._removeSchedule(index);
            });
        };

        ScheduleCtrl.prototype.askForNewScheduleName = function (prevIdx) {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: '/static/templates/newScheduleModal.html',
                controller: NewScheduleModalCtrl,
                keyboard: true,
                resolve: {
                    semester: function () {
                        return _this.semester.name;
                    }
                },
                backdropClass: 'modal-backdrop',
                windowClass: 'center-modal'
            });

            modalInstance.result.then(function (name) {
                _this._createSchedule(name);
            }, function () {
                _this.schedules[prevIdx].active = true;
            });
        };

        ScheduleCtrl.prototype._createSchedule = function (scheduleName) {
            var index = this.schedules.length;
            var newSchedule = new this.scheduleResource();
            newSchedule.semester = this.semester;
            newSchedule.user = this.userService.user;
            newSchedule.enrollments = JSON.stringify([]);
            newSchedule.title = scheduleName ? scheduleName : "New Schedule";
            this.schedules.push({
                scheduleObject: newSchedule,
                active: true,
                scheduleManager: this.scheduleManagerService.newScheduleManager(newSchedule)
            });

            this.$scope.selectedSchedule = index;
        };

        ScheduleCtrl.prototype.onSelect = function ($index) {
            this._setSelectedSchedule($index);
        };

        ScheduleCtrl.prototype._setSelectedSchedule = function (index) {
            this.$scope.selectedSchedule = index;
        };

        ScheduleCtrl.prototype._removeSchedule = function (index) {
            this.schedules[index].scheduleManager.schedule.$remove();
            this.schedules.splice(index, 1);
        };

        ScheduleCtrl.prototype.canRemove = function () {
            return this.schedules.length > 1;
        };

        ScheduleCtrl.prototype.addSchedule = function () {
            this._setAllInactive();
            this._createSchedule();
        };
        ScheduleCtrl.$inject = [
            '$scope',
            '$modal',
            '$element',
            'hotkeys',
            'UserService',
            'ScheduleResource',
            'ScheduleManagerService'
        ];
        return ScheduleCtrl;
    })();

    
    return ScheduleCtrl;
});
//# sourceMappingURL=ScheduleCtrl.js.map
