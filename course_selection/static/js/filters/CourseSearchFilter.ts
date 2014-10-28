import Filter = require('./Filter');

class CourseSearchFilter extends Filter
{
    public static Factory()
    {
        return (input: string) => {
        }
    }
}

export = CourseSearchFilter;
