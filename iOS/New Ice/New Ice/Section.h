//
//  Section.h
//  New Ice
//
//  Created by Naphat Sanguansin on 4/23/14.
//
//

#import <Foundation/Foundation.h>
#import <CoreData/CoreData.h>
#import "ServerObject.h"

@class Course, EventGroup, UserSectionTable;

@interface Section : ServerObject

@property (nonatomic, retain) NSString * name;
@property (nonatomic, retain) NSString * sectionType;
@property (nonatomic, retain) Course *course;
@property (nonatomic, retain) NSSet *eventGroups;
@property (nonatomic, retain) NSSet *enrollment;
@end

@interface Section (CoreDataGeneratedAccessors)

- (void)addEventGroupsObject:(EventGroup *)value;
- (void)removeEventGroupsObject:(EventGroup *)value;
- (void)addEventGroups:(NSSet *)values;
- (void)removeEventGroups:(NSSet *)values;

- (void)addEnrollmentObject:(UserSectionTable *)value;
- (void)removeEnrollmentObject:(UserSectionTable *)value;
- (void)addEnrollment:(NSSet *)values;
- (void)removeEnrollment:(NSSet *)values;

@end
