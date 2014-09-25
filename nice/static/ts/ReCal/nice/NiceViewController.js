/// <reference path="../../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../library/Core/GlobalBrowserEventsManager', '../../library/CoreUI/ViewController', '../../library/CoreUI/ViewTemplateRetriever'], function(require, exports, GlobalBrowserEventsManager, ViewController, ViewTemplateRetriever) {
    var NiceViewController = (function (_super) {
        __extends(NiceViewController, _super);
        function NiceViewController(view) {
            _super.call(this, view);
            /**
            * Global Browser Events Manager
            */
            this._globalBrowserEventsManager = null;
            /**
            * View template retriever
            */
            this._viewTemplateRetriever = null;
            this.initialize();
        }
        Object.defineProperty(NiceViewController.prototype, "globalBrowserEventsManager", {
            get: function () {
                if (!this._globalBrowserEventsManager) {
                    this._globalBrowserEventsManager = new GlobalBrowserEventsManager();
                }
                return this._globalBrowserEventsManager;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(NiceViewController.prototype, "viewTemplateRetriever", {
            get: function () {
                if (!this._viewTemplateRetriever) {
                    this._viewTemplateRetriever = new ViewTemplateRetriever();
                }
                return this._viewTemplateRetriever;
            },
            enumerable: true,
            configurable: true
        });

        NiceViewController.prototype.initialize = function () {
        };
        return NiceViewController;
    })(ViewController);

    
    return NiceViewController;
});
