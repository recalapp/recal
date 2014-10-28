import Color = require('../../../library/Color/Color');
export interface ICoursesModel
{
    courseId: string;
    title: string;
    description: string;
    courseListings: string[];
    primaryListing: string;
    sectionsModels: ISectionsModel[];
}
export interface ISectionsModel
{
    coursesModel?: ICoursesModel;
    sectionId: string;
    title: string;
    sectionTypesModel: ISectionTypesModel;
    color: Color;
}
export interface ISectionTypesModel
{
    code: string;
    displayText: string;
}