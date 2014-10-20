import Course = require('../models/Course');

interface ICourseStorage {
    get (): Course[];
}

export = ICourseStorage;
