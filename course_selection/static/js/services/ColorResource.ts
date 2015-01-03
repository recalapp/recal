/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />

import IColorPalette = require('../interfaces/IColorPalette');
import Service = require('./Service');

'use strict';

class ColorResource implements ICourseResource {

    public static $inject = ['$resource'];
    public static BASE_URL: string = "/course_selection/api/v1/course/";

    public static previewColor: IColorPalette = {
        id: -1,
        dark: 'rgb(84, 84, 84)',
        light: 'rgb(210, 210, 210)'
    };

    private resource;

    constructor(private $resource: ng.resource.IResourceService) {
        this.resource = $resource(ColorResource.BASE_URL, {},
                {
                    query: {
                        method: 'GET', 
                        isArray: false,
                    },
                    getBySemester: {
                        method: 'GET',
                        isArray: true,
                        cache: true,
                        transformResponse: this.transformTastypieResponse
                    }
                });
    }

    public query() {
        return this.resource.query();
    }

    public getBySemester(semesterTermCode: string) {
        return this.resource.getBySemester({semester__term_code: semesterTermCode});
    }

    private transformTastypieResponse(data, header) {
        var parsed = JSON.parse(data);
        // data could be an array with metadata
        if (parsed.meta && parsed.objects) {
            return parsed.objects;
        } else {
            return parsed;
        }
    }
}

export = ColorResource;
