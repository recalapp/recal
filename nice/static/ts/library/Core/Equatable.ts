interface Equatable
{
    equals(other: Equatable) : boolean;
}
(<any>Object.prototype).equal = function(other) { return this === other; }; // provide a default implementation
export = Equatable;
