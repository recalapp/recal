import Filter = require('./Filter');

class CourseSearchFilter extends Filter
{
    public static Factory()
    {
        return (input: string) => {
            return true;
        }
    }
}

export = CourseSearchFilter;
