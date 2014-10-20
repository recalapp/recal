import ICourseStorage = require('../interfaces/ICourseStorage');
import Course = require('../models/Course');

'use strict';

class CourseStorage implements ICourseStorage {
    STORAGE_ID = 'nice-course-storage';

    get(): Course[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
    }

    put(courses: Course[]) {
        localStorage.setItem(this.STORAGE_ID, JSON.stringify(courses));
    }
}

export = CourseStorage;
