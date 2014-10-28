/// <reference path="../../../../nice/static/ts/typings/tsd.d.ts" />
import ICourse = require('../interfaces/ICourse');
import Service = require('./Service');
declare class CourseResource extends Service {
    private $resource;
    static $inject: string[];
    constructor($resource: ng.resource.IResourceService);
    public query(): void;
    public get(): void;
    public put(courses: ICourse[]): void;
}
export = CourseResource;
