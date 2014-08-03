import ComparableResult = require('./ComparableResult');

interface Comparable
{
    compareTo(other: Comparable): ComparableResult;
}
export = Comparable;
