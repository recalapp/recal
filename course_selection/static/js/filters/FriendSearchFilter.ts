/// <reference path='../../ts/typings/tsd.d.ts' />
import IUser = require('../interfaces/IUser');
import Filter = require('./Filter');

class FriendSearchFilter extends Filter
{
    static $inject = [];

    constructor() {
        super();
    }

    public filter(users: IUser[], input: string): IUser[] {
        if (users.length == 0) {
            return users;
        }

        var breakedQueries = FriendSearchFilter.breakQuery(input);
        var queries: string[] = breakedQueries.split(' ');

        // only allow 1 query for now --
        if (queries.length != 1) {
            return [];
        }

        var query = queries[0];
        return users.filter((user) => {
            return FriendSearchFilter.startsWith(user.netid, query);
        });
    }

    private static breakQuery(input: string): string {
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
        output = input.replace(/\d+\.?\d*/g, function(text) {
            return ' ' + text + ' ';
        });

        // takes care of numbers of the form .xyz
        output = output.replace(/\D\.\d+/g, function(text) {
            return ' ' + text + ' ';
        });

        // trim spaces
        output = output.replace(/\s+/g, " ");

        return output;
    }

    // test whether s starts with t
    private static startsWith(s: string, t: string) {
        return s.substring(0, t.length) === t;
    }
}

export = FriendSearchFilter;
