var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './Filter'], function (require, exports, Filter) {
    var FriendSearchFilter = (function (_super) {
        __extends(FriendSearchFilter, _super);
        function FriendSearchFilter() {
            _super.call(this);
        }
        FriendSearchFilter.prototype.filter = function (users, input) {
            if (users.length == 0) {
                return users;
            }
            var breakedQueries = FriendSearchFilter.breakQuery(input);
            var queries = breakedQueries.split(' ');
            if (queries.length != 1) {
                return [];
            }
            var query = queries[0];
            return users.filter(function (user) {
                return FriendSearchFilter.startsWith(user.netid, query);
            });
        };
        FriendSearchFilter.breakQuery = function (input) {
            var output;
            output = input.replace(/\d+\.?\d*/g, function (text) {
                return ' ' + text + ' ';
            });
            output = output.replace(/\D\.\d+/g, function (text) {
                return ' ' + text + ' ';
            });
            output = output.replace(/\s+/g, " ");
            return output;
        };
        FriendSearchFilter.startsWith = function (s, t) {
            return s.substring(0, t.length) === t;
        };
        FriendSearchFilter.$inject = [];
        return FriendSearchFilter;
    })(Filter);
    return FriendSearchFilter;
});
