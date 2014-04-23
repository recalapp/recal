//
//  Semester.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import "ServerObject.h"

@class Course;

@interface Semester : ServerObject

@property (nonatomic, retain) NSDate * startDate;
@property (nonatomic, retain) NSString * termCode;
@property (nonatomic, retain) NSDate * endDate;
@property (nonatomic, retain) NSSet *courses;
@end

@interface Semester (CoreDataGeneratedAccessors)

- (void)addCoursesObject:(Course *)value;
- (void)removeCoursesObject:(Course *)value;
- (void)addCourses:(NSSet *)values;
- (void)removeCourses:(NSSet *)values;

@end
