import Comparable = require('../Core/Comparable');
interface Time extends Comparable
{
    hours: number;
    minutes: number;
    seconds: number;
    format(format?: string): string;
}
export = Time;