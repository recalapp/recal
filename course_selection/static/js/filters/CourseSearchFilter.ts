/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import ICourse = require('../interfaces/ICourse');
import Filter = require('./Filter');

class CourseSearchFilter extends Filter
{
    public static Factory()
    {
        return (courses: ICourse[], query: string) => {
            console.log("query: " + query);
            var filtered: ICourse[] = [];
            angular.forEach(courses, (course) => {
                if (course.title.substr(0, query.length).toLowerCase()
                        == query.toLowerCase()) {
                    filtered.push(course);
                }
            });
            return filtered;
        }
    }
}

export = CourseSearchFilter;
