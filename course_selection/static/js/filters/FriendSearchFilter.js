var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
            // only allow 1 query for now --
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
            // output = input.replace(/\D\d+\.?\d+\D/g, function(text){
            //     return text.charAt(0) + ' ' + text.substring(1, text.length - 1) + ' ' + text.slice(-1);
            // });
            // output = output.replace(/\D\d+\.?\d+/g, function(text){
            //     return text.charAt(0) + ' ' + text.substring(1);
            // });
            // output = output.replace(/\d+\.?\d+\D/g, function(text){
            //     return text.substring(0, text.length - 1) + ' ' + text.slice(-1);
            // });
            // takes care of numbers of the form x.yz, .yz are optional
            output = input.replace(/\d+\.?\d*/g, function (text) {
                return ' ' + text + ' ';
            });
            // takes care of numbers of the form .xyz
            output = output.replace(/\D\.\d+/g, function (text) {
                return ' ' + text + ' ';
            });
            // trim spaces
            output = output.replace(/\s+/g, " ");
            return output;
        };
        // test whether s starts with t
        FriendSearchFilter.startsWith = function (s, t) {
            return s.substring(0, t.length) === t;
        };
        FriendSearchFilter.$inject = [];
        return FriendSearchFilter;
    })(Filter);
    return FriendSearchFilter;
});
//# sourceMappingURL=FriendSearchFilter.js.map