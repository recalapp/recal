import Comparable = require('../Core/Comparable');
interface Date extends Comparable
{
    year: number;
    month: number;
    date: number;
    day: number;
    format(format?: string): string;
}

export = Date;