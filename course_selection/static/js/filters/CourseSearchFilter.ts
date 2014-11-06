/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import Filter = require('./Filter');

class CourseSearchFilter extends Filter
{
    private static dists = ['LA','SA','HA','EM','QR','STL','STN'];

    public static Factory()
    {
        return (courses: ICourse[], query: string) => {
            return CourseSearchFilter.search(courses, query);
            /*
            console.log("query: " + query);
            var filtered: ICourse[] = [];
            angular.forEach(courses, (course) => {
                if (course.title.substr(0, query.length).toLowerCase()
                        == query.toLowerCase()) {
                    filtered.push(course);
                }
            });
            return filtered;
            */
        }
    }

    public static search(courses: ICourse[], input: string) {
        if (!input) {
            return [];
        }

        var queries: string[] = input.split(' ');
        var results: ICourse[] = courses;
        for (var i = 0; i < queries.length; i++) {
            var query = queries[i].toUpperCase();
            if (query == '') {
                break;
            }

            /*
            if (CourseSearchFilter.arrayContains(CourseSearchFilter.dists, query)) {
                results.filter((course) => {
                    return course.distribution == query;
                });
            }
            */

            // is department
            if (query.length <= 3 && CourseSearchFilter.isAlpha(query)) {
                results = results.filter((course) => {
                    return CourseSearchFilter.isListed(course, 'course_listings', 'dept', query);
                });
            } 
            // is course number
            else if (query.length <= 3 && CourseSearchFilter.isNumber(query)) {
                results = results.filter((course) => {
                    return CourseSearchFilter.isListed(course, 'course_listings', 'number', query);
                });
            } else if (query.length > 3) {
                results = results.filter((course) => {
                    return CourseSearchFilter.regexTest(course, query);
                });
            } else {
                // query is too short
                // results = []
            }
        }

        return results;
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
