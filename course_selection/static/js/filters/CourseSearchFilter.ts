/// <reference path='../../ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import Filter = require('./Filter');

class CourseSearchFilter extends Filter
{
    private static dists = ['LA','SA','HA','EM','QR','STL','STN'];

    static $inject = [];

    constructor() {
        super();
    }

    public filter(courses: ICourse[], input: string): ICourse[] {
        if (courses.length == 0) {
            return courses;
        }

        if (!input) {
            if (courses[0].enrolled) {
                return courses;
            } 
            else {
                return [];
            }
        }

        var breakedQueries = CourseSearchFilter.breakQuery(input);
        var queries: string[] = breakedQueries.split(' ');
        var results: ICourse[] = courses;
        for (var i = 0; i < queries.length; i++) {
            var query = queries[i].toUpperCase();
            if (query == '') {
                continue;
            }

            // the next query should be the min rating
            if (query[0] == '>') {
                i++;

                // continue if '>' is the last token
                if (i >= queries.length || !CourseSearchFilter.isNumber(queries[i])) {
                    continue;
                }

                var minRating = +queries[i];
                results = results.filter((course) => {
                    return course.rating >= minRating;
                });
            }
            // is department
            else if (query.length <= 3 && CourseSearchFilter.isAlpha(query)) {
                if (query.length < 3) {
                    return [];
                }

                results = results.filter((course) => {
                    return CourseSearchFilter.isListed(course, 'course_listings', 'dept', query);
                });
            } 
            // is course number
            else if (query.length <= 4 && CourseSearchFilter.isNumber(query)) {
                results = results.filter((course) => {
                    return CourseSearchFilter.isListed(course, 'course_listings', 'number', query);
                });
            } else {
                results = results.filter((course) => {
                    return CourseSearchFilter.regexTest(course, query);
                });
            } 
        }

        return results;
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

    private static regexTest(course: ICourse, regexStr): boolean {
        var re = new RegExp(regexStr, "i");
        if (re.test(course.title)) {
            return true;
        }

        return false;
    }

    private static isListed(course, first_arg, second_arg, target): boolean {
        if (!course[first_arg]) {
            return false;
        }

        // listings = course_listings
        var listings = course[first_arg];
        for (var i = 0; i < listings.length; i++) {
            var listing = listings[i];
            if (CourseSearchFilter.startsWith(listing[second_arg], target)) {
                return true;
            }
        }

        return false;
    }

    private static startsWith(s: string, t: string) {
        return s.substring(0, t.length) === t;
    }

    private static isDepartment(input: string) {
    }

    private static isAlpha(s: string) {
        return s.search(/[^A-Za-z\s]/) == -1;
    }

    private static isNumber(n: string) {
        return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
    }

    private static arrayContains(xs, x): boolean {
        return xs.indexOf(x) != -1;
    }
}

export = CourseSearchFilter;
