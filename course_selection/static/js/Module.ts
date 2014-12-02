/// <reference path='../../../nice/static/ts/typings/tsd.d.ts' />
/// <amd-dependency path="angular"/>

'use strict';

class Module
{
    app: ng.IModule;

    constructor(name: string, modules: Array<string>)
    {
        this.app = angular.module(name, modules);
    }

    public addController(name: string, controller: Function)
    {
        this.app.controller(name, controller);
    }

    public addService(name: string, service: Function)
    {
        this.app.service(name, service);
    }

    public addFilter(name: string, dependenciesAndFilter: Array<any>)
    {
        this.app.filter(name, dependenciesAndFilter);
    }

    public addDirective(name: string, dependenciesAndDirective: Array<any>) {
        this.app.directive(name, dependenciesAndDirective);
    }

}

export = Module;
