import ComparableResult = require('./ComparableResult');
import Equalable = require('./Equalable');

interface Comparable extends Equalable
{
    compareTo(other: Comparable): ComparableResult;
}
export = Comparable;
