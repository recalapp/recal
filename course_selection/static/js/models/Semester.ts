class Semester {
    static compare(a: Semester, b: Semester) {
        return a.term_code - b.term_code;
    }

    constructor(
            public name: string,
            public active: boolean,
            public current: boolean,
            public term_code: number)
    {
    }
}

export = Semester;
