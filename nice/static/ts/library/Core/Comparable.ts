import ComparableResult = require('./ComparableResult');
import Equatable = require('./Equatable');

interface Comparable extends Equatable
{
    compareTo(other: Comparable): ComparableResult;
}
export = Comparable;
