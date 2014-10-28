/// <reference path="../../../nice/static/ts/typings/tsd.d.ts" />
declare class Module {
    public app: ng.IModule;
    constructor(name: string, modules: string[]);
    public addController(name: string, controller: Function): void;
    public addService(name: string, service: Function): void;
    public addFilter(name: string, filter: Function): void;
}
export = Module;
