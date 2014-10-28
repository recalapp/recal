import Filter = require('./Filter');
declare class CourseSearchFilter extends Filter {
    static Factory(): (input: string) => void;
}
export = CourseSearchFilter;
