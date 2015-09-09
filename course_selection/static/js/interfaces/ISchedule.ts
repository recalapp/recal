import IUser = require("./IUser");

interface ISchedule extends angular.resource.IResource<ISchedule> {
    id: number;
    available_colors: string;
    enrollments: string;
    title: string;
    user: IUser;
}

export = ISchedule;
