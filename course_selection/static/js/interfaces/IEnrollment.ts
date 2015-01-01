import IColorPalette = require('./IColorPalette');

// TODO: rename sections to section_ids
interface IEnrollment {
    color: IColorPalette;
    course_id: number;
    sections: Array<number>;
}

export = IEnrollment;
