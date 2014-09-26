/// <reference path="../../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'jquery', './AgendaTableViewCell', './AgendaTableViewHeaderView', '../../../library/DateTime/DateTime', '../../common/ReCalCommonBrowserEvents', '../../../library/DataStructures/Set', '../../../library/Table/TableViewController'], function(require, exports, $, AgendaTableViewCell, AgendaTableViewHeaderView, DateTime, ReCalCommonBrowserEvents, Set, TableViewController) {
    var AgendaTableViewController = (function (_super) {
        __extends(AgendaTableViewController, _super);
        function AgendaTableViewController(tableView, dependencies) {
            var _this = this;
            _super.call(this, tableView);
            this._eventSectionArray = new Array();
            this._loading = false;
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            /**
            * View template retriever
            */
            this._viewTemplateRetriever = null;
            /**
            * Events Operations Facade
            */
            this._eventsOperationsFacade = null;
            this._viewTemplateRetriever = dependencies.viewTemplateRetriever;
            this._globalBrowserEventsManager = dependencies.globalBrowserEventsManager;
            this._eventsOperationsFacade = dependencies.eventsOperationsFacade;

            // when events change
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventsDataChanged, function (ev) {
                _this.reload();
            });

            // when settings close
            $('#' + SE_id).on('close', function (ev) {
                // TODO check if visible
                _this.reload();
            });

            // when switching between agenda and calendar
            $('#agenda.tab-pane').each(function (index, pane) {
                $(pane).on('transitionend', function (ev) {
                    if ($(pane).hasClass('in')) {
                        _this.reload();
                    }
                });
            });

            //// unhighlight closed events
            //PopUp_addCloseListener((closedEventId: string)=>{
            //    // get cell based on eventId and unhighlight it
            //    $.each(this.view.selectedIndexPaths(), (index: number, indexPath: IndexPath) =>{
            //        var eventId: string = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
            //        if (eventId == closedEventId)
            //        {
            //            this.view.deselectCellAtIndexPath(indexPath);
            //            return false; // breaks
            //        }
            //    });
            //});
            // this should be the sole place to unhighlight deselected events and
            // make sure the agenda view is in sync with the state of the events
            this.globalBrowserEventsManager.attachGlobalEventHandler(ReCalCommonBrowserEvents.eventSelectionChanged, function (ev, extra) {
                if (extra !== null && extra !== undefined && extra.eventIds !== null && extra.eventIds !== undefined) {
                    var changedEventIds = new Set(extra.eventIds);
                    var changedSize = changedEventIds.size();
                    var foundCount = 0;

                    // get cell based on eventId and unhighlight it
                    $.each(_this.view.selectedIndexPaths(), function (index, indexPath) {
                        var eventId = _this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
                        if (changedEventIds.contains(eventId)) {
                            if (_this.eventsOperationsFacade.eventIdIsSelected(eventId)) {
                                _this.view.selectCellAtIndexPath(indexPath);
                            } else {
                                _this.view.deselectCellAtIndexPath(indexPath);
                            }
                            ++foundCount;
                            if (foundCount == changedSize) {
                                return false;
                            }
                        }
                    });
                } else {
                    // TODO cannot tell what changed. update everything. need a way to map to all events in events manager
                }
            });

            // reload
            this.reload();
        }
        Object.defineProperty(AgendaTableViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AgendaTableViewController.prototype, "viewTemplateRetriever", {
            get: function () {
                return this._viewTemplateRetriever;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(AgendaTableViewController.prototype, "eventsOperationsFacade", {
            get: function () {
                return this._eventsOperationsFacade;
            },
            enumerable: true,
            configurable: true
        });

        AgendaTableViewController.prototype.reload = function () {
            // TODO Agenda_filter
            // TODO EventSectionRangeProvider
            if (this._loading) {
                return;
            }
            this._loading = true;
            LO_showLoading(AgendaTableViewController.LO_MESSAGE);
            this._eventSectionArray = new Array();

            // yesterday 0:00:00 AM to before midnight
            var curDate = new DateTime();
            var startDate = new DateTime();
            startDate.date = curDate.date - 1;
            startDate.hours = 0;
            startDate.minutes = 0;
            startDate.seconds = 0;
            var endDate = new DateTime();
            endDate.date = curDate.date;
            endDate.hours = 0;
            endDate.minutes = 0;
            endDate.seconds = 0;
            var eventIds = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('Yesterday', eventIds));
            }

            // today to midnight
            startDate = endDate;
            endDate = new DateTime();
            endDate.date = curDate.date + 1;
            endDate.hours = 0;
            endDate.minutes = 0;
            endDate.seconds = 0;
            eventIds = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('Today', eventIds));
            }

            // this week
            startDate = endDate;
            endDate = new DateTime();
            endDate.date = curDate.date + 7;
            endDate.hours = 0;
            endDate.minutes = 0;
            endDate.seconds = 0;
            eventIds = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('This Week', eventIds));
            }

            // this month
            startDate = endDate;
            endDate = new DateTime();
            endDate.month = curDate.month + 1;
            endDate.date = 0;
            endDate.hours = 0;
            endDate.minutes = 0;
            endDate.seconds = 0;
            eventIds = this.eventsOperationsFacade.getEventIdsInRange(startDate, endDate);
            if (eventIds.length > 0) {
                this._eventSectionArray.push(new EventSection('This Month', eventIds));
            }

            this.view.refresh();
            LO_hideLoading(AgendaTableViewController.LO_MESSAGE);
            this._loading = false;
        };

        /*******************************************************************
        * Table View Data Source
        *****************************************************************/
        /**
        * Returns true if a cell should be deselected
        * when it is selected and clicked on again.
        */
        AgendaTableViewController.prototype.shouldToggleSelection = function () {
            return false;
        };

        /**
        * Return a unique identifier for cell at the given index path.
        * Useful for when there are more than one types of cells in
        * a table view
        */
        AgendaTableViewController.prototype.identifierForCellAtIndexPath = function (indexPath) {
            return 'agenda';
        };

        /**
        * Return a unique identifier for the header at the given index path.
        * Useful for when there are more than one types of header in
        * a table view
        */
        AgendaTableViewController.prototype.identifierForHeaderViewAtSection = function (section) {
            return 'agenda-header';
        };

        /**
        * Create a new table view cell for the given identifier
        */
        AgendaTableViewController.prototype.createCell = function (identifier) {
            return AgendaTableViewCell.fromJQuery(this.viewTemplateRetriever.retrieveTemplate(AgendaTableViewCell.templateSelector));
        };

        /**
        * Create a new table view header view for the given identifier
        */
        AgendaTableViewController.prototype.createHeaderView = function (identifier) {
            return AgendaTableViewHeaderView.fromJQuery(this.viewTemplateRetriever.retrieveTemplate(AgendaTableViewHeaderView.templateSelector));
        };

        /**
        * Make any changes to the cell before it goes on screen.
        * Return (not necessarily the same) cell.
        */
        AgendaTableViewController.prototype.decorateCell = function (cell) {
            var eventsOperationsFacade = this.eventsOperationsFacade;
            var agendaCell = cell;
            var indexPath = cell.indexPath;
            var eventSection = this._eventSectionArray[indexPath.section];
            var eventId = eventSection.eventIds[indexPath.item];
            if (eventId === undefined) {
                // indexPath was invalid
                return cell;
            }
            var eventDict = eventsOperationsFacade.getEventById(eventId);

            agendaCell.setToEvent(eventDict);

            // TODO window resizing
            if (eventsOperationsFacade.eventIdIsSelected(eventId)) {
                this.view.selectCell(agendaCell);
            } else {
                this.view.deselectCell(agendaCell);
            }

            return cell;
        };

        /**
        * Make any changes to the cell before it goes on screen.
        * Return (not necessarily the same) cell.
        */
        AgendaTableViewController.prototype.decorateHeaderView = function (headerView) {
            var agendaHeaderView = headerView;
            var eventSection = this._eventSectionArray[headerView.section];
            agendaHeaderView.setTitle(eventSection.sectionName);
            return agendaHeaderView;
        };

        /**
        * The number of sections in this table view.
        */
        AgendaTableViewController.prototype.numberOfSections = function () {
            if (!this._eventSectionArray) {
                return 0;
            }
            return this._eventSectionArray.length;
        };

        /**
        * The number of items in this section.
        */
        AgendaTableViewController.prototype.numberOfItemsInSection = function (section) {
            if (!this._eventSectionArray) {
                return 0;
            }
            return this._eventSectionArray[section].eventIds.length;
        };

        /*******************************************************************
        * Table View Delegate
        *****************************************************************/
        /**
        * Callback for when a table view cell is selected
        */
        AgendaTableViewController.prototype.didSelectCell = function (cell) {
            var eventsOperationsFacade = this.eventsOperationsFacade;
            var indexPath = cell.indexPath;
            var eventId = this._eventSectionArray[indexPath.section].eventIds[indexPath.item];
            if (eventId === undefined) {
                // indexPath was invalid
                return;
            }

            if (eventsOperationsFacade.eventIdIsSelected(eventId)) {
                eventsOperationsFacade.selectEventWithId(eventId);
            } else {
                // TODO bring event popup into focus - maybe simply by calling select again?
                eventsOperationsFacade.selectEventWithId(eventId); // TODO works? Does this cause the popup to come into focus?
            }
        };
        AgendaTableViewController.LO_MESSAGE = 'agenda loading';
        return AgendaTableViewController;
    })(TableViewController);

    var EventSection = (function () {
        function EventSection(_sectionName, _eventIds) {
            this._sectionName = _sectionName;
            this._eventIds = _eventIds;
        }
        Object.defineProperty(EventSection.prototype, "sectionName", {
            get: function () {
                return this._sectionName;
            },
            set: function (value) {
                this._sectionName = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(EventSection.prototype, "eventIds", {
            get: function () {
                return this._eventIds;
            },
            set: function (value) {
                this._eventIds = value;
            },
            enumerable: true,
            configurable: true
        });

        return EventSection;
    })();

    
    return AgendaTableViewController;
});
