export interface UserProfileInfoServerData
{
    username: string;
    display_name: string;
    enrolled_courses: CourseInfoServerData[];
    event_types: any;
    calendar_pref: string[];
    agenda_pref: string[];
}
export interface CourseInfoServerData
{
    course_description: string;
    course_title: string;
    course_professor: string;
    course_listings: string;
    course_primary_listing: string;
    course_id: number;
    sections: SectionInfoServerData[];
}
export interface SectionInfoServerData
{
    section_type_code: string;
    section_id: number;
    section_name: string;
    section_color: string;
}
